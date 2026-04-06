import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:pdfx/pdfx.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';

class PdfToJpgScreen extends StatefulWidget {
  const PdfToJpgScreen({super.key});

  @override
  State<PdfToJpgScreen> createState() => _PdfToJpgScreenState();
}

class _PdfToJpgScreenState extends State<PdfToJpgScreen> {
  File? _pdfFile;
  int _totalPages = 0;
  bool _processing = false;
  bool _sharing = false;
  final List<Uint8List> _previewPages = [];
  double _quality = 150; // DPI

  Future<void> _pickPdf() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (result == null || result.files.single.path == null) return;
    final file = File(result.files.single.path!);
    setState(() {
      _pdfFile = file;
      _previewPages.clear();
      _totalPages = 0;
    });
    await _loadPreview(file);
  }

  Future<void> _loadPreview(File file) async {
    setState(() => _processing = true);
    try {
      final doc = await PdfDocument.openFile(file.path);
      _totalPages = doc.pagesCount;

      // Load first 3 pages as preview
      _previewPages.clear();
      final previewCount = _totalPages.clamp(0, 3);
      for (var i = 1; i <= previewCount; i++) {
        final page = await doc.getPage(i);
        final image = await page.render(
          width: page.width * 1.5,
          height: page.height * 1.5,
          format: PdfPageImageFormat.png,
        );
        if (image != null) _previewPages.add(image.bytes);
        await page.close();
      }
      await doc.close();
      setState(() => _processing = false);
    } catch (e) {
      setState(() => _processing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error reading PDF: $e'),
              backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _convertAndShare() async {
    if (_pdfFile == null) return;
    setState(() => _sharing = true);
    try {
      final doc = await PdfDocument.openFile(_pdfFile!.path);
      final dir = await getTemporaryDirectory();
      final files = <XFile>[];

      for (var i = 1; i <= doc.pagesCount; i++) {
        final page = await doc.getPage(i);
        final image = await page.render(
          width: page.width * (_quality / 72),
          height: page.height * (_quality / 72),
          format: PdfPageImageFormat.jpeg,
          backgroundColor: '#FFFFFF',
        );
        if (image != null) {
          final file = File('${dir.path}/page_$i.jpg');
          await file.writeAsBytes(image.bytes);
          files.add(XFile(file.path));
        }
        await page.close();
      }
      await doc.close();

      await Share.shareXFiles(
        files,
        subject: 'PDF Pages as JPG from DocMinty',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error: $e'),
              backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _sharing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('PDF to JPG')),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Pick PDF ──────────────────────────────────────────────
                  GestureDetector(
                    onTap: _pickPdf,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppSpacing.xl),
                      decoration: BoxDecoration(
                        color: _pdfFile != null
                            ? AppColors.secondaryLight
                            : AppColors.bgCard,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        border: Border.all(
                          color: _pdfFile != null
                              ? AppColors.secondary
                              : AppColors.border,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            _pdfFile != null
                                ? Icons.picture_as_pdf_rounded
                                : Icons.upload_file_rounded,
                            size: 40,
                            color: _pdfFile != null
                                ? AppColors.secondary
                                : AppColors.textLight,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _pdfFile != null
                                ? _pdfFile!.path.split('/').last
                                : 'Tap to select PDF',
                            style: AppTextStyles.body.copyWith(
                              color: _pdfFile != null
                                  ? AppColors.secondary
                                  : AppColors.textMuted,
                              fontWeight: FontWeight.w600,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          if (_totalPages > 0) ...[
                            const SizedBox(height: 4),
                            Text(
                              '$_totalPages pages',
                              style: AppTextStyles.caption,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  if (_pdfFile != null) ...[
                    // ── Quality ────────────────────────────────────────────
                    AppCard(
                      padding: const EdgeInsets.all(AppSpacing.base),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Output Quality',
                                  style: AppTextStyles.body),
                              Text(
                                _quality == 72
                                    ? 'Low (72 DPI)'
                                    : _quality == 150
                                        ? 'Medium (150 DPI)'
                                        : 'High (300 DPI)',
                                style: AppTextStyles.body.copyWith(
                                    color: AppColors.secondary,
                                    fontWeight: FontWeight.w700),
                              ),
                            ],
                          ),
                          Slider(
                            value: _quality,
                            min: 72,
                            max: 300,
                            divisions: 2,
                            activeColor: AppColors.secondary,
                            onChanged: (v) =>
                                setState(() => _quality = v),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),

                    // ── Preview ────────────────────────────────────────────
                    if (_processing)
                      const Center(
                        child: CircularProgressIndicator(
                            color: AppColors.secondary),
                      )
                    else if (_previewPages.isNotEmpty) ...[
                      Text('Preview (first ${_previewPages.length} pages)',
                          style: AppTextStyles.h4),
                      const SizedBox(height: AppSpacing.sm),
                      SizedBox(
                        height: 200,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: _previewPages.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(width: 8),
                          itemBuilder: (_, i) => ClipRRect(
                            borderRadius:
                                BorderRadius.circular(AppRadius.md),
                            child: Image.memory(
                              _previewPages[i],
                              height: 200,
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ],
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
          if (_pdfFile != null && !_processing)
            Container(
              color: AppColors.bgCard,
              padding: const EdgeInsets.all(AppSpacing.base),
              child: SafeArea(
                top: false,
                child: AppButton(
                  label: _sharing
                      ? 'Converting...'
                      : 'Convert $_totalPages Pages & Share',
                  icon: const Icon(Icons.image_rounded,
                      color: Colors.white, size: 16),
                  onPressed: _sharing ? null : _convertAndShare,
                  loading: _sharing,
                  width: double.infinity,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

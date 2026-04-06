import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';

class JpgToPdfScreen extends StatefulWidget {
  const JpgToPdfScreen({super.key});

  @override
  State<JpgToPdfScreen> createState() => _JpgToPdfScreenState();
}

class _JpgToPdfScreenState extends State<JpgToPdfScreen> {
  final List<File> _images = [];
  bool _generating = false;
  String _pageSize = 'A4';
  bool _fitToPage = true;

  static const _pageSizes = ['A4', 'A3', 'Letter', 'Legal'];

  Future<void> _pickImages() async {
    final picker = ImagePicker();
    final picked = await picker.pickMultiImage(imageQuality: 90);
    if (picked.isNotEmpty) {
      setState(() {
        _images.addAll(picked.map((x) => File(x.path)));
      });
    }
  }

  void _removeImage(int index) => setState(() => _images.removeAt(index));

  void _reorder(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex--;
      final item = _images.removeAt(oldIndex);
      _images.insert(newIndex, item);
    });
  }

  PdfPageFormat _getFormat() => switch (_pageSize) {
        'A3' => PdfPageFormat.a3,
        'Letter' => PdfPageFormat.letter,
        'Legal' => PdfPageFormat.legal,
        _ => PdfPageFormat.a4,
      };

  Future<void> _generatePdf() async {
    if (_images.isEmpty) return;
    setState(() => _generating = true);
    try {
      final doc = pw.Document(title: 'Images to PDF');
      final format = _getFormat();

      for (final imgFile in _images) {
        final bytes = await imgFile.readAsBytes();
        final image = pw.MemoryImage(bytes);
        doc.addPage(
          pw.Page(
            pageFormat: format,
            margin: _fitToPage ? pw.EdgeInsets.zero : const pw.EdgeInsets.all(20),
            build: (ctx) => _fitToPage
                ? pw.Center(
                    child: pw.Image(image,
                        fit: pw.BoxFit.contain,
                        width: format.availableWidth,
                        height: format.availableHeight),
                  )
                : pw.Center(child: pw.Image(image)),
          ),
        );
      }

      final bytes = await doc.save();
      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/images_to_pdf.pdf');
      await file.writeAsBytes(bytes);

      await Share.shareXFiles(
        [XFile(file.path)],
        subject: 'PDF from DocMinty',
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
      if (mounted) setState(() => _generating = false);
    }
  }

  Future<void> _previewPdf() async {
    if (_images.isEmpty) return;
    setState(() => _generating = true);
    try {
      final doc = pw.Document();
      final format = _getFormat();
      for (final imgFile in _images) {
        final bytes = await imgFile.readAsBytes();
        final image = pw.MemoryImage(bytes);
        doc.addPage(
          pw.Page(
            pageFormat: format,
            margin: _fitToPage ? pw.EdgeInsets.zero : const pw.EdgeInsets.all(20),
            build: (ctx) => _fitToPage
                ? pw.Center(
                    child: pw.Image(image,
                        fit: pw.BoxFit.contain,
                        width: format.availableWidth,
                        height: format.availableHeight))
                : pw.Center(child: pw.Image(image)),
          ),
        );
      }
      await Printing.layoutPdf(
        onLayout: (_) async => doc.save(),
        name: 'images_to_pdf.pdf',
      );
    } finally {
      if (mounted) setState(() => _generating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('JPG / Image to PDF')),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Settings ────────────────────────────────────────────
                  AppCard(
                    padding: const EdgeInsets.all(AppSpacing.base),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Settings', style: AppTextStyles.h4),
                        const SizedBox(height: AppSpacing.sm),
                        Row(
                          children: [
                            Text('Page Size', style: AppTextStyles.body),
                            const Spacer(),
                            DropdownButton<String>(
                              value: _pageSize,
                              underline: const SizedBox(),
                              style: AppTextStyles.body
                                  .copyWith(color: AppColors.secondary),
                              items: _pageSizes
                                  .map((s) => DropdownMenuItem(
                                      value: s, child: Text(s)))
                                  .toList(),
                              onChanged: (v) =>
                                  setState(() => _pageSize = v!),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            Text('Fit to Page', style: AppTextStyles.body),
                            const Spacer(),
                            Switch(
                              value: _fitToPage,
                              onChanged: (v) =>
                                  setState(() => _fitToPage = v),
                              activeColor: AppColors.secondary,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.base),

                  // ── Image list ───────────────────────────────────────────
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Images (${_images.length})',
                        style: AppTextStyles.h4,
                      ),
                      TextButton.icon(
                        onPressed: _pickImages,
                        icon: const Icon(Icons.add_photo_alternate_rounded,
                            size: 16, color: AppColors.secondary),
                        label: const Text('Add',
                            style: TextStyle(color: AppColors.secondary)),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  if (_images.isEmpty)
                    GestureDetector(
                      onTap: _pickImages,
                      child: Container(
                        width: double.infinity,
                        height: 160,
                        decoration: BoxDecoration(
                          color: AppColors.bgCard,
                          borderRadius:
                              BorderRadius.circular(AppRadius.lg),
                          border: Border.all(
                              color: AppColors.border,
                              style: BorderStyle.solid),
                        ),
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_photo_alternate_rounded,
                                size: 40, color: AppColors.textLight),
                            SizedBox(height: 8),
                            Text('Tap to add images',
                                style: TextStyle(
                                  color: AppColors.textMuted,
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                )),
                            Text('Drag to reorder',
                                style: TextStyle(
                                  color: AppColors.textLight,
                                  fontFamily: 'Inter',
                                  fontSize: 11,
                                )),
                          ],
                        ),
                      ),
                    )
                  else
                    ReorderableListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _images.length,
                      onReorder: _reorder,
                      itemBuilder: (_, i) => _ImageTile(
                        key: ValueKey(_images[i].path),
                        file: _images[i],
                        index: i,
                        onRemove: () => _removeImage(i),
                      ),
                    ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),

          // ── Footer ────────────────────────────────────────────────────
          if (_images.isNotEmpty)
            Container(
              color: AppColors.bgCard,
              padding: const EdgeInsets.all(AppSpacing.base),
              child: SafeArea(
                top: false,
                child: Row(
                  children: [
                    Expanded(
                      child: AppButton(
                        label: 'Preview',
                        variant: AppButtonVariant.outline,
                        onPressed: _generating ? null : _previewPdf,
                        loading: _generating,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: AppButton(
                        label: 'Create & Share PDF',
                        icon: const Icon(Icons.picture_as_pdf_rounded,
                            color: Colors.white, size: 16),
                        onPressed: _generating ? null : _generatePdf,
                        loading: _generating,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ImageTile extends StatelessWidget {
  const _ImageTile({
    super.key,
    required this.file,
    required this.index,
    required this.onRemove,
  });
  final File file;
  final int index;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          const Icon(Icons.drag_handle_rounded,
              color: AppColors.textLight, size: 18),
          const SizedBox(width: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            child: Image.file(file,
                width: 52, height: 52, fit: BoxFit.cover),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Image ${index + 1}',
                    style: AppTextStyles.body
                        .copyWith(fontWeight: FontWeight.w600)),
                Text(
                  file.path.split('/').last,
                  style: AppTextStyles.caption,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded,
                color: AppColors.error, size: 18),
            onPressed: onRemove,
          ),
        ],
      ),
    );
  }
}

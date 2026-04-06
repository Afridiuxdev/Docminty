import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:pdfx/pdfx.dart' as pdfx;
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';

class SplitPdfScreen extends StatefulWidget {
  const SplitPdfScreen({super.key});

  @override
  State<SplitPdfScreen> createState() => _SplitPdfScreenState();
}

class _SplitPdfScreenState extends State<SplitPdfScreen> {
  File? _pdfFile;
  int _totalPages = 0;
  bool _loading = false;
  bool _splitting = false;
  String _splitMode = 'range'; // 'range' | 'every' | 'extract'

  final _fromCtrl = TextEditingController(text: '1');
  final _toCtrl = TextEditingController();
  final _everyCtrl = TextEditingController(text: '1');

  @override
  void dispose() {
    _fromCtrl.dispose();
    _toCtrl.dispose();
    _everyCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickPdf() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (result == null || result.files.single.path == null) return;
    final file = File(result.files.single.path!);
    setState(() {
      _pdfFile = file;
      _loading = true;
      _totalPages = 0;
    });
    try {
      final doc = await pdfx.PdfDocument.openFile(file.path);
      _totalPages = doc.pagesCount;
      _toCtrl.text = '$_totalPages';
      await doc.close();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<List<pw.Document>> _buildSplitDocs() async {
    final pdfDoc = await pdfx.PdfDocument.openFile(_pdfFile!.path);
    List<List<int>> ranges = [];

    if (_splitMode == 'range') {
      final from = (int.tryParse(_fromCtrl.text) ?? 1).clamp(1, _totalPages);
      final to =
          (int.tryParse(_toCtrl.text) ?? _totalPages).clamp(from, _totalPages);
      ranges.add(List.generate(to - from + 1, (i) => from + i));
    } else if (_splitMode == 'every') {
      final n = (int.tryParse(_everyCtrl.text) ?? 1).clamp(1, _totalPages);
      for (var start = 1; start <= _totalPages; start += n) {
        final end = (start + n - 1).clamp(1, _totalPages);
        ranges.add(List.generate(end - start + 1, (i) => start + i));
      }
    } else {
      // Extract: every page as its own PDF
      for (var i = 1; i <= _totalPages; i++) {
        ranges.add([i]);
      }
    }

    final docs = <pw.Document>[];
    for (final pageNums in ranges) {
      final doc = pw.Document();
      for (final pNum in pageNums) {
        final page = await pdfDoc.getPage(pNum);
        final img = await page.render(
          width: page.width * 2,
          height: page.height * 2,
          format: pdfx.PdfPageImageFormat.jpeg,
          backgroundColor: '#FFFFFF',
        );
        await page.close();
        if (img != null) {
          final Uint8List imgBytes = img.bytes;
          doc.addPage(
            pw.Page(
              pageFormat: PdfPageFormat(
                  page.width * PdfPageFormat.point,
                  page.height * PdfPageFormat.point),
              margin: pw.EdgeInsets.zero,
              build: (_) => pw.Center(
                child: pw.Image(pw.MemoryImage(imgBytes),
                    fit: pw.BoxFit.contain,
                    width: page.width,
                    height: page.height),
              ),
            ),
          );
        }
      }
      docs.add(doc);
    }
    await pdfDoc.close();
    return docs;
  }

  Future<void> _split() async {
    if (_pdfFile == null) return;
    setState(() => _splitting = true);
    try {
      final docs = await _buildSplitDocs();
      final dir = await getTemporaryDirectory();
      final files = <XFile>[];

      for (var i = 0; i < docs.length; i++) {
        final bytes = await docs[i].save();
        final file = File('${dir.path}/split_part_${i + 1}.pdf');
        await file.writeAsBytes(bytes);
        files.add(XFile(file.path));
      }

      await Share.shareXFiles(
        files,
        subject: 'Split PDFs from DocMinty',
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
      if (mounted) setState(() => _splitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('Split PDF')),
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
                    onTap: _loading ? null : _pickPdf,
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
                          if (_loading)
                            const CircularProgressIndicator(
                                color: AppColors.secondary)
                          else
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
                            Text('$_totalPages pages total',
                                style: AppTextStyles.caption),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  if (_pdfFile != null && !_loading) ...[
                    // ── Split mode ─────────────────────────────────────────
                    Text('Split Mode', style: AppTextStyles.h4),
                    const SizedBox(height: AppSpacing.sm),
                    _ModeChip(
                      label: 'Page Range',
                      desc: 'Extract specific pages',
                      selected: _splitMode == 'range',
                      onTap: () => setState(() => _splitMode = 'range'),
                    ),
                    const SizedBox(height: 8),
                    _ModeChip(
                      label: 'Every N Pages',
                      desc: 'Split into equal chunks',
                      selected: _splitMode == 'every',
                      onTap: () => setState(() => _splitMode = 'every'),
                    ),
                    const SizedBox(height: 8),
                    _ModeChip(
                      label: 'Each Page',
                      desc: 'One PDF per page ($_totalPages files)',
                      selected: _splitMode == 'extract',
                      onTap: () => setState(() => _splitMode = 'extract'),
                    ),
                    const SizedBox(height: AppSpacing.lg),

                    // ── Mode options ───────────────────────────────────────
                    if (_splitMode == 'range') ...[
                      AppCard(
                        padding: const EdgeInsets.all(AppSpacing.base),
                        child: Row(
                          children: [
                            Expanded(
                              child: AppTextField(
                                label: 'From page',
                                initialValue: _fromCtrl.text,
                                controller: _fromCtrl,
                                keyboardType: TextInputType.number,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: AppTextField(
                                label: 'To page',
                                initialValue: _toCtrl.text,
                                controller: _toCtrl,
                                keyboardType: TextInputType.number,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ] else if (_splitMode == 'every') ...[
                      AppCard(
                        padding: const EdgeInsets.all(AppSpacing.base),
                        child: AppTextField(
                          label: 'Pages per file',
                          controller: _everyCtrl,
                          keyboardType: TextInputType.number,
                        ),
                      ),
                    ],
                  ],
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
          if (_pdfFile != null && !_loading)
            Container(
              color: AppColors.bgCard,
              padding: const EdgeInsets.all(AppSpacing.base),
              child: SafeArea(
                top: false,
                child: AppButton(
                  label: _splitting ? 'Splitting...' : 'Split & Share',
                  icon: const Icon(Icons.call_split_rounded,
                      color: Colors.white, size: 16),
                  onPressed: _splitting ? null : _split,
                  loading: _splitting,
                  width: double.infinity,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ModeChip extends StatelessWidget {
  const _ModeChip({
    required this.label,
    required this.desc,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final String desc;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: selected ? AppColors.secondaryLight : AppColors.bgCard,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(
            color: selected ? AppColors.secondary : AppColors.border,
            width: selected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              selected
                  ? Icons.radio_button_checked_rounded
                  : Icons.radio_button_unchecked_rounded,
              color: selected ? AppColors.secondary : AppColors.textLight,
              size: 20,
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: AppTextStyles.body.copyWith(
                      fontWeight: FontWeight.w600,
                      color: selected
                          ? AppColors.secondary
                          : AppColors.textPrimary,
                    )),
                Text(desc, style: AppTextStyles.caption),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

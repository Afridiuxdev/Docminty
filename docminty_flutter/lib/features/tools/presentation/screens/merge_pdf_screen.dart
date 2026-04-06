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

class MergePdfScreen extends StatefulWidget {
  const MergePdfScreen({super.key});

  @override
  State<MergePdfScreen> createState() => _MergePdfScreenState();
}

class _MergePdfScreenState extends State<MergePdfScreen> {
  final List<_PdfEntry> _pdfs = [];
  bool _merging = false;
  String? _status;

  Future<void> _addPdfs() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
      allowMultiple: true,
    );
    if (result == null) return;
    setState(() {
      for (final f in result.files) {
        if (f.path != null) {
          _pdfs.add(_PdfEntry(file: File(f.path!), name: f.name));
        }
      }
    });
    // Count pages for each new entry
    for (var i = 0; i < _pdfs.length; i++) {
      if (_pdfs[i].pageCount == 0) {
        try {
          final doc = await pdfx.PdfDocument.openFile(_pdfs[i].file.path);
          _pdfs[i].pageCount = doc.pagesCount;
          await doc.close();
          if (mounted) setState(() {});
        } catch (_) {}
      }
    }
  }

  void _remove(int index) => setState(() => _pdfs.removeAt(index));

  void _reorder(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex--;
      final item = _pdfs.removeAt(oldIndex);
      _pdfs.insert(newIndex, item);
    });
  }

  Future<void> _merge() async {
    if (_pdfs.length < 2) return;
    setState(() {
      _merging = true;
      _status = 'Rendering pages…';
    });

    try {
      final doc = pw.Document(title: 'Merged PDF');

      for (final entry in _pdfs) {
        final pdfDoc = await pdfx.PdfDocument.openFile(entry.file.path);
        for (var p = 1; p <= pdfDoc.pagesCount; p++) {
          setState(() {
            _status =
                'Processing ${entry.name} — page $p of ${pdfDoc.pagesCount}';
          });
          final page = await pdfDoc.getPage(p);
          final img = await page.render(
            width: page.width * 2,
            height: page.height * 2,
            format: pdfx.PdfPageImageFormat.jpeg,
            backgroundColor: '#FFFFFF',
          );
          await page.close();
          if (img != null) {
            final Uint8List imgBytes = img.bytes;
            final pwImage = pw.MemoryImage(imgBytes);
            doc.addPage(
              pw.Page(
                pageFormat: PdfPageFormat(
                    page.width * PdfPageFormat.point,
                    page.height * PdfPageFormat.point),
                margin: pw.EdgeInsets.zero,
                build: (_) => pw.Center(
                  child: pw.Image(pwImage,
                      fit: pw.BoxFit.contain,
                      width: page.width,
                      height: page.height),
                ),
              ),
            );
          }
        }
        await pdfDoc.close();
      }

      setState(() => _status = 'Saving merged PDF…');
      final bytes = await doc.save();
      final dir = await getTemporaryDirectory();
      final outFile = File('${dir.path}/merged.pdf');
      await outFile.writeAsBytes(bytes);

      setState(() => _status = null);
      await Share.shareXFiles(
        [XFile(outFile.path)],
        subject: 'Merged PDF from DocMinty',
      );
    } catch (e) {
      setState(() => _status = null);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error: $e'),
              backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _merging = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final totalPages = _pdfs.fold(0, (s, e) => s + e.pageCount);

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('Merge PDF')),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Info card ─────────────────────────────────────────────
                  AppCard(
                    padding: const EdgeInsets.all(AppSpacing.base),
                    color: AppColors.infoLight,
                    borderColor: AppColors.info,
                    child: Row(
                      children: [
                        const Icon(Icons.info_rounded,
                            color: AppColors.info, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Pages are rendered at 2x for quality. Large PDFs may take a moment.',
                            style: AppTextStyles.bodySm
                                .copyWith(color: AppColors.info),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.base),

                  // ── PDF list ──────────────────────────────────────────────
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'PDFs (${_pdfs.length}) · $totalPages pages',
                        style: AppTextStyles.h4,
                      ),
                      TextButton.icon(
                        onPressed: _merging ? null : _addPdfs,
                        icon: const Icon(Icons.add_rounded,
                            size: 16, color: AppColors.secondary),
                        label: const Text('Add PDFs',
                            style: TextStyle(color: AppColors.secondary)),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  if (_pdfs.isEmpty)
                    GestureDetector(
                      onTap: _addPdfs,
                      child: Container(
                        width: double.infinity,
                        height: 160,
                        decoration: BoxDecoration(
                          color: AppColors.bgCard,
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.picture_as_pdf_rounded,
                                size: 40, color: AppColors.textLight),
                            SizedBox(height: 8),
                            Text('Tap to add PDF files',
                                style: TextStyle(
                                  color: AppColors.textMuted,
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                )),
                            Text('Select 2 or more to merge',
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
                      itemCount: _pdfs.length,
                      onReorder: _reorder,
                      itemBuilder: (_, i) => _PdfTile(
                        key: ValueKey(_pdfs[i].file.path),
                        entry: _pdfs[i],
                        index: i,
                        onRemove: _merging ? null : () => _remove(i),
                      ),
                    ),

                  if (_merging && _status != null) ...[
                    const SizedBox(height: AppSpacing.base),
                    AppCard(
                      padding: const EdgeInsets.all(AppSpacing.base),
                      child: Row(
                        children: [
                          const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: AppColors.secondary),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(_status!,
                                style: AppTextStyles.bodySm),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),

          if (_pdfs.length >= 2)
            Container(
              color: AppColors.bgCard,
              padding: const EdgeInsets.all(AppSpacing.base),
              child: SafeArea(
                top: false,
                child: AppButton(
                  label: _merging
                      ? 'Merging...'
                      : 'Merge $totalPages Pages into 1 PDF',
                  icon: const Icon(Icons.merge_type_rounded,
                      color: Colors.white, size: 16),
                  onPressed: _merging ? null : _merge,
                  loading: _merging,
                  width: double.infinity,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _PdfEntry {
  _PdfEntry({required this.file, required this.name});
  final File file;
  final String name;
  int pageCount = 0;
}

class _PdfTile extends StatelessWidget {
  const _PdfTile({
    super.key,
    required this.entry,
    required this.index,
    required this.onRemove,
  });
  final _PdfEntry entry;
  final int index;
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
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
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.errorLight,
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: const Icon(Icons.picture_as_pdf_rounded,
                color: AppColors.error, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.name,
                    style: AppTextStyles.body
                        .copyWith(fontWeight: FontWeight.w600),
                    overflow: TextOverflow.ellipsis),
                Text(
                  entry.pageCount > 0
                      ? '${entry.pageCount} pages'
                      : 'Reading…',
                  style: AppTextStyles.caption,
                ),
              ],
            ),
          ),
          if (onRemove != null)
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

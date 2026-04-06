import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';

class _CertForm {
  String recipientName = '', courseName = '', duration = '', grade = '';
  String issueDate = '', orgName = '', orgTagline = '';
  String signatory = '', signatoryDesignation = '';

  Map<String, dynamic> toJson() => {
    'recipientName': recipientName, 'courseName': courseName,
    'duration': duration, 'grade': grade, 'issueDate': issueDate,
    'orgName': orgName, 'orgTagline': orgTagline,
    'signatory': signatory, 'signatoryDesignation': signatoryDesignation,
  };

  static _CertForm fromJson(Map<String, dynamic> j) {
    final f = _CertForm();
    f.recipientName = j['recipientName'] as String? ?? '';
    f.courseName = j['courseName'] as String? ?? '';
    f.duration = j['duration'] as String? ?? '';
    f.grade = j['grade'] as String? ?? '';
    f.issueDate = j['issueDate'] as String? ?? '';
    f.orgName = j['orgName'] as String? ?? '';
    f.orgTagline = j['orgTagline'] as String? ?? '';
    f.signatory = j['signatory'] as String? ?? '';
    f.signatoryDesignation = j['signatoryDesignation'] as String? ?? '';
    return f;
  }

  _CertForm copy() {
    final r = _CertForm();
    r.recipientName = recipientName; r.courseName = courseName;
    r.duration = duration; r.grade = grade; r.issueDate = issueDate;
    r.orgName = orgName; r.orgTagline = orgTagline;
    r.signatory = signatory; r.signatoryDesignation = signatoryDesignation;
    return r;
  }
}

final _certProvider =
    StateNotifierProvider.autoDispose<_CertNotifier, _CertForm>((ref) => _CertNotifier());

class _CertNotifier extends StateNotifier<_CertForm> {
  _CertNotifier() : super(_CertForm());
  void up(_CertForm Function(_CertForm) fn) => state = fn(state);
  void load(_CertForm f) => state = f;
}

class CertificateScreen extends ConsumerStatefulWidget {
  const CertificateScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<CertificateScreen> createState() => _CertificateScreenState();
}

class _CertificateScreenState extends ConsumerState<CertificateScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Organisation', 'Recipient', 'Content', 'Verification'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          ref.read(_certProvider.notifier).load(
              _CertForm.fromJson(widget.savedDocument!.parsedFormData));
        } catch (_) {}
      });
    }
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  Future<void> _download() async {
    setState(() => _downloading = true);
    try {
      final f = ref.read(_certProvider);
      final pdf = await _buildCertPdf(f);
      await Printing.sharePdf(
          bytes: await pdf.save(),
          filename: 'Certificate_${f.recipientName}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildCertPdf(ref.read(_certProvider));
        return pdf.save();
      },
      allowPrinting: false,
      allowSharing: false,
      canChangePageFormat: false,
      canChangeOrientation: false,
      canDebug: false,
    );
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final f = ref.read(_certProvider);
    final req = SaveDocumentRequest(
      docType: 'certificate',
      title: 'Certificate - ${f.recipientName}',
      templateName: 'Classic',
      partyName: f.recipientName,
      formData: jsonEncode(f.toJson()),
    );
    final ok = widget.savedDocument != null
        ? await ref.read(documentsProvider.notifier).updateDoc(widget.savedDocument!.id, req)
        : await ref.read(documentsProvider.notifier).save(req);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Saved!' : 'Failed.'),
        backgroundColor: ok ? AppColors.success : AppColors.error,
        behavior: SnackBarBehavior.floating,
      ));
      setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: Text(widget.savedDocument != null ? 'Edit Certificate' : 'New Certificate'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
        actions: [
          IconButton(
            icon: Icon(_showPreview ? Icons.edit_rounded : Icons.remove_red_eye_rounded,
                color: AppColors.textMuted),
            tooltip: _showPreview ? 'Edit' : 'Preview PDF',
            onPressed: () => setState(() => _showPreview = !_showPreview),
          ),
          IconButton(
            icon: _saving
                ? const SizedBox(width: 18, height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.secondary))
                : const Icon(Icons.cloud_upload_rounded, color: AppColors.secondary),
            onPressed: _saving ? null : _save,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: _showPreview ? _buildPreview() : Column(children: [
        Container(
          color: AppColors.bgCard,
          child: TabBar(
            controller: _tab,
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            indicatorColor: AppColors.secondary,
            labelColor: AppColors.secondary,
            unselectedLabelColor: AppColors.textMuted,
            labelStyle: const TextStyle(fontFamily: 'Inter', fontSize: 13, fontWeight: FontWeight.w600),
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tab,
            children: const [
              _OrgTab(),
              _RecipientTab(),
              _ContentTab(),
              _VerificationTab(),
            ],
          ),
        ),
      ]),
      floatingActionButton: _showPreview
          ? FloatingActionButton.extended(
              onPressed: _downloading ? null : _download,
              backgroundColor: AppColors.secondary,
              icon: _downloading
                  ? const SizedBox(width: 18, height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Icon(Icons.download_rounded, color: Colors.white),
              label: Text(
                _downloading ? 'Generating...' : 'Download PDF',
                style: const TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.w700, color: Colors.white),
              ),
            )
          : null,
    );
  }
}

class _OrgTab extends ConsumerWidget {
  const _OrgTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_certProvider);
    final n = ref.read(_certProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Organization Details'),
        AppTextField(label: 'Organization Name *', hint: 'ABC Institute',
            initialValue: f.orgName,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.orgName = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Tagline', hint: 'Excellence in Education',
            initialValue: f.orgTagline,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.orgTagline = v; return r; })),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _RecipientTab extends ConsumerWidget {
  const _RecipientTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_certProvider);
    final n = ref.read(_certProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Recipient Details'),
        AppTextField(label: 'Recipient Name *', hint: 'Rahul Sharma',
            initialValue: f.recipientName,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.recipientName = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Course / Achievement', hint: 'Advanced Flutter Development',
            initialValue: f.courseName,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.courseName = v; return r; })),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ContentTab extends ConsumerWidget {
  const _ContentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_certProvider);
    final n = ref.read(_certProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Certificate Details'),
        AppFormRow(
          left: AppTextField(label: 'Duration', hint: '3 months',
              initialValue: f.duration,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.duration = v; return r; })),
          right: AppTextField(label: 'Grade / Score', hint: 'A+',
              initialValue: f.grade,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.grade = v; return r; })),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Issue Date', hint: 'DD/MM/YYYY',
            initialValue: f.issueDate,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.issueDate = v; return r; })),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _VerificationTab extends ConsumerWidget {
  const _VerificationTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_certProvider);
    final n = ref.read(_certProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Signatory'),
        AppTextField(label: 'Signatory Name', hint: 'Dr. A. Kumar',
            initialValue: f.signatory,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.signatory = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Designation', hint: 'Director',
            initialValue: f.signatoryDesignation,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.signatoryDesignation = v; return r; })),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildCertPdf(_CertForm f) async {
  final doc = pw.Document(title: 'Certificate');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const gold = PdfColor(0.851, 0.647, 0.125);
  const accent = PdfColor(0.051, 0.584, 0.533);

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4.landscape,
    margin: const pw.EdgeInsets.all(40),
    build: (ctx) => pw.Container(
      decoration: pw.BoxDecoration(border: pw.Border.all(color: gold, width: 3)),
      padding: const pw.EdgeInsets.all(40),
      child: pw.Column(
        mainAxisAlignment: pw.MainAxisAlignment.center,
        children: [
          pw.Text(f.orgName.isEmpty ? 'Organization Name' : f.orgName,
              style: pw.TextStyle(font: heading, fontSize: 22, color: accent)),
          if (f.orgTagline.isNotEmpty)
            pw.Text(f.orgTagline,
                style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
          pw.SizedBox(height: 20),
          pw.Divider(color: gold),
          pw.SizedBox(height: 12),
          pw.Text('Certificate of Completion',
              style: pw.TextStyle(font: heading, fontSize: 26, color: gold)),
          pw.SizedBox(height: 14),
          pw.Text('This is to certify that',
              style: pw.TextStyle(font: reg, fontSize: 13)),
          pw.SizedBox(height: 8),
          pw.Text(f.recipientName.isEmpty ? 'Recipient Name' : f.recipientName,
              style: pw.TextStyle(font: heading, fontSize: 30, color: accent)),
          pw.SizedBox(height: 8),
          pw.Text('has successfully completed',
              style: pw.TextStyle(font: reg, fontSize: 13)),
          pw.SizedBox(height: 8),
          pw.Text(f.courseName.isEmpty ? 'Course Name' : f.courseName,
              style: pw.TextStyle(font: bold, fontSize: 17)),
          pw.SizedBox(height: 6),
          if (f.duration.isNotEmpty)
            pw.Text('Duration: ${f.duration}',
                style: pw.TextStyle(font: reg, fontSize: 12)),
          if (f.grade.isNotEmpty)
            pw.Text('Grade: ${f.grade}',
                style: pw.TextStyle(font: bold, fontSize: 13, color: accent)),
          pw.SizedBox(height: 20),
          pw.Divider(color: gold),
          pw.SizedBox(height: 10),
          pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
            pw.Column(children: [
              pw.Text(f.signatory.isEmpty ? '_______________' : f.signatory,
                  style: pw.TextStyle(font: bold, fontSize: 12)),
              pw.Text(f.signatoryDesignation,
                  style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
            ]),
            pw.Column(children: [
              pw.Text('Issue Date',
                  style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
              pw.Text(f.issueDate.isEmpty ? '—' : f.issueDate,
                  style: pw.TextStyle(font: bold, fontSize: 12)),
            ]),
          ]),
        ],
      ),
    ),
  ));
  return doc;
}

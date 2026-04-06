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

class _Form {
  String orgName = '', orgAddress = '', supervisorName = '', supervisorDesignation = '';
  String internName = '', college = '', department = '';
  String startDate = '', endDate = '', issueDate = '';
  String projectWork = '', performance = '';

  Map<String, dynamic> toJson() => {
    'orgName': orgName, 'orgAddress': orgAddress,
    'supervisorName': supervisorName, 'supervisorDesignation': supervisorDesignation,
    'internName': internName, 'college': college, 'department': department,
    'startDate': startDate, 'endDate': endDate, 'issueDate': issueDate,
    'projectWork': projectWork, 'performance': performance,
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.orgName = j['orgName'] as String? ?? '';
    f.orgAddress = j['orgAddress'] as String? ?? '';
    f.supervisorName = j['supervisorName'] as String? ?? '';
    f.supervisorDesignation = j['supervisorDesignation'] as String? ?? '';
    f.internName = j['internName'] as String? ?? '';
    f.college = j['college'] as String? ?? '';
    f.department = j['department'] as String? ?? '';
    f.startDate = j['startDate'] as String? ?? '';
    f.endDate = j['endDate'] as String? ?? '';
    f.issueDate = j['issueDate'] as String? ?? '';
    f.projectWork = j['projectWork'] as String? ?? '';
    f.performance = j['performance'] as String? ?? '';
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.orgName = orgName; r.orgAddress = orgAddress;
    r.supervisorName = supervisorName; r.supervisorDesignation = supervisorDesignation;
    r.internName = internName; r.college = college; r.department = department;
    r.startDate = startDate; r.endDate = endDate; r.issueDate = issueDate;
    r.projectWork = projectWork; r.performance = performance;
    return r;
  }
}

final _internProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

class InternshipCertificateScreen extends ConsumerStatefulWidget {
  const InternshipCertificateScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<InternshipCertificateScreen> createState() => _State();
}

class _State extends ConsumerState<InternshipCertificateScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Organisation', 'Intern', 'Content', 'Verify'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try { ref.read(_internProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData)); }
        catch (_) {}
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
      final pdf = await _buildPdf(ref.read(_internProvider));
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'InternshipCertificate_${ref.read(_internProvider).internName}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_internProvider));
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
    final f = ref.read(_internProvider);
    final req = SaveDocumentRequest(
      docType: 'internship-certificate',
      title: 'Internship Certificate - ${f.internName}',
      templateName: 'Classic',
      partyName: f.internName,
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
        title: Text(widget.savedDocument != null ? 'Edit Internship Certificate' : 'New Internship Certificate'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
        actions: [
          IconButton(
            icon: Icon(_showPreview ? Icons.edit_rounded : Icons.remove_red_eye_rounded,
                color: AppColors.textMuted),
            tooltip: _showPreview ? 'Edit' : 'Preview PDF',
            onPressed: () => setState(() => _showPreview = !_showPreview),
          ),
          IconButton(
            icon: _saving ? const SizedBox(width: 18, height: 18,
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
            children: const [_OrgTab(), _InternTab(), _ContentTab(), _VerifyTab()],
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

void _set(WidgetRef ref, String k, String v) => ref.read(_internProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'orgName': r.orgName = v; case 'orgAddress': r.orgAddress = v;
    case 'supervisorName': r.supervisorName = v; case 'supervisorDesignation': r.supervisorDesignation = v;
    case 'internName': r.internName = v; case 'college': r.college = v;
    case 'department': r.department = v; case 'startDate': r.startDate = v;
    case 'endDate': r.endDate = v; case 'issueDate': r.issueDate = v;
    case 'projectWork': r.projectWork = v; case 'performance': r.performance = v;
  }
  return r;
});

class _OrgTab extends ConsumerWidget {
  const _OrgTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_internProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Organization Details'),
        AppTextField(label: 'Organization Name *', hint: 'ABC Corp Pvt Ltd',
            initialValue: f.orgName, onChanged: (v) => _set(ref, 'orgName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Office address', initialValue: f.orgAddress,
            maxLines: 2, onChanged: (v) => _set(ref, 'orgAddress', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _InternTab extends ConsumerWidget {
  const _InternTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_internProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Intern Details'),
        AppTextField(label: 'Intern Name *', hint: 'Priya Verma',
            initialValue: f.internName, onChanged: (v) => _set(ref, 'internName', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'College / Institute', hint: 'IIT Mumbai',
              initialValue: f.college, onChanged: (v) => _set(ref, 'college', v)),
          right: AppTextField(label: 'Department', hint: 'Computer Science',
              initialValue: f.department, onChanged: (v) => _set(ref, 'department', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Start Date', hint: 'DD/MM/YYYY',
              initialValue: f.startDate, onChanged: (v) => _set(ref, 'startDate', v)),
          right: AppTextField(label: 'End Date', hint: 'DD/MM/YYYY',
              initialValue: f.endDate, onChanged: (v) => _set(ref, 'endDate', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Issue Date', hint: 'DD/MM/YYYY',
            initialValue: f.issueDate, onChanged: (v) => _set(ref, 'issueDate', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ContentTab extends ConsumerWidget {
  const _ContentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_internProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Work & Performance'),
        AppTextField(label: 'Project / Work Done', hint: 'Worked on mobile app development...',
            initialValue: f.projectWork, maxLines: 3, onChanged: (v) => _set(ref, 'projectWork', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Performance / Feedback (optional)',
            hint: 'Excellent performance, proactive attitude...',
            initialValue: f.performance, maxLines: 2, onChanged: (v) => _set(ref, 'performance', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _VerifyTab extends ConsumerWidget {
  const _VerifyTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_internProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Supervisor / Signatory'),
        AppFormRow(
          left: AppTextField(label: 'Supervisor Name', hint: 'Dr. A. Kumar',
              initialValue: f.supervisorName, onChanged: (v) => _set(ref, 'supervisorName', v)),
          right: AppTextField(label: 'Designation', hint: 'Manager',
              initialValue: f.supervisorDesignation, onChanged: (v) => _set(ref, 'supervisorDesignation', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Internship Certificate');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.051, 0.584, 0.533);
  const gold = PdfColor(0.851, 0.647, 0.125);

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(40),
    build: (ctx) => pw.Container(
      decoration: pw.BoxDecoration(border: pw.Border.all(color: accent, width: 2)),
      padding: const pw.EdgeInsets.all(36),
      child: pw.Column(
        mainAxisAlignment: pw.MainAxisAlignment.center,
        children: [
          pw.Text(f.orgName.isEmpty ? 'Organization Name' : f.orgName,
              style: pw.TextStyle(font: heading, fontSize: 20, color: accent)),
          if (f.orgAddress.isNotEmpty)
            pw.Text(f.orgAddress, style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
          pw.SizedBox(height: 16),
          pw.Divider(color: gold),
          pw.SizedBox(height: 12),
          pw.Text('Internship Completion Certificate',
              style: pw.TextStyle(font: heading, fontSize: 22, color: gold)),
          pw.SizedBox(height: 16),
          pw.Text('This is to certify that', style: pw.TextStyle(font: reg, fontSize: 13)),
          pw.SizedBox(height: 6),
          pw.Text(f.internName.isEmpty ? 'Intern Name' : f.internName,
              style: pw.TextStyle(font: heading, fontSize: 28, color: accent)),
          if (f.college.isNotEmpty) ...[
            pw.SizedBox(height: 4),
            pw.Text('from ${f.college}${f.department.isNotEmpty ? ", ${f.department}" : ""}',
                style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
          ],
          pw.SizedBox(height: 10),
          pw.Text('has successfully completed internship',
              style: pw.TextStyle(font: reg, fontSize: 13)),
          pw.Text('from ${f.startDate.isEmpty ? "—" : f.startDate} to ${f.endDate.isEmpty ? "—" : f.endDate}',
              style: pw.TextStyle(font: bold, fontSize: 13)),
          if (f.projectWork.isNotEmpty) ...[
            pw.SizedBox(height: 10),
            pw.Text(f.projectWork, style: pw.TextStyle(font: reg, fontSize: 11,
                color: PdfColors.grey700), textAlign: pw.TextAlign.center),
          ],
          if (f.performance.isNotEmpty) ...[
            pw.SizedBox(height: 6),
            pw.Text(f.performance, style: pw.TextStyle(font: reg, fontSize: 11,
                color: PdfColors.grey700, fontStyle: pw.FontStyle.italic), textAlign: pw.TextAlign.center),
          ],
          pw.SizedBox(height: 24),
          pw.Divider(color: gold),
          pw.SizedBox(height: 12),
          pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
            pw.Column(children: [
              pw.Text(f.supervisorName.isEmpty ? '_______________' : f.supervisorName,
                  style: pw.TextStyle(font: bold, fontSize: 12)),
              pw.Text(f.supervisorDesignation.isEmpty ? 'Authorized Signatory' : f.supervisorDesignation,
                  style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
            ]),
            pw.Column(children: [
              pw.Text('Issue Date', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
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

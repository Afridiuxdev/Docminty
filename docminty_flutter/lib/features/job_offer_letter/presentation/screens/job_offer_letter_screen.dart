import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';

class _Form {
  String companyName = '', companyAddress = '';
  String hrName = '', hrDesignation = '';
  String candidateName = '', candidateAddress = '';
  String position = '', department = '', salary = '';
  String joiningDate = '', issueDate = '', reportingTo = '';
  String benefits = '', extraClauses = '';

  Map<String, dynamic> toJson() => {
    'companyName': companyName, 'companyAddress': companyAddress,
    'hrName': hrName, 'hrDesignation': hrDesignation,
    'candidateName': candidateName, 'candidateAddress': candidateAddress,
    'position': position, 'department': department, 'salary': salary,
    'joiningDate': joiningDate, 'issueDate': issueDate,
    'reportingTo': reportingTo, 'benefits': benefits, 'extraClauses': extraClauses,
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.companyName = j['companyName'] as String? ?? '';
    f.companyAddress = j['companyAddress'] as String? ?? '';
    f.hrName = j['hrName'] as String? ?? '';
    f.hrDesignation = j['hrDesignation'] as String? ?? '';
    f.candidateName = j['candidateName'] as String? ?? '';
    f.candidateAddress = j['candidateAddress'] as String? ?? '';
    f.position = j['position'] as String? ?? '';
    f.department = j['department'] as String? ?? '';
    f.salary = j['salary'] as String? ?? '';
    f.joiningDate = j['joiningDate'] as String? ?? '';
    f.issueDate = j['issueDate'] as String? ?? '';
    f.reportingTo = j['reportingTo'] as String? ?? '';
    f.benefits = j['benefits'] as String? ?? '';
    f.extraClauses = j['extraClauses'] as String? ?? '';
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.companyName = companyName; r.companyAddress = companyAddress;
    r.hrName = hrName; r.hrDesignation = hrDesignation;
    r.candidateName = candidateName; r.candidateAddress = candidateAddress;
    r.position = position; r.department = department; r.salary = salary;
    r.joiningDate = joiningDate; r.issueDate = issueDate;
    r.reportingTo = reportingTo; r.benefits = benefits; r.extraClauses = extraClauses;
    return r;
  }
}

final _offerProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

class JobOfferLetterScreen extends ConsumerStatefulWidget {
  const JobOfferLetterScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<JobOfferLetterScreen> createState() => _State();
}

class _State extends ConsumerState<JobOfferLetterScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Company', 'Candidate', 'Terms', 'CTC'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          ref.read(_offerProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData));
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
      final f = ref.read(_offerProvider);
      final pdf = await _buildPdf(f);
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'OfferLetter_${f.candidateName}.pdf');
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
        final pdf = await _buildPdf(ref.read(_offerProvider));
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
    final f = ref.read(_offerProvider);
    final amt = double.tryParse(f.salary.replaceAll(',', ''));
    final req = SaveDocumentRequest(
      docType: 'job-offer-letter',
      title: 'Offer Letter - ${f.candidateName}',
      templateName: 'Classic',
      partyName: f.candidateName,
      amount: amt,
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
        title: Text(widget.savedDocument != null ? 'Edit Offer Letter' : 'New Offer Letter'),
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
            children: const [_CompanyTab(), _CandidateTab(), _TermsTab(), _CtcTab()],
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

void _set(WidgetRef ref, String k, String v) => ref.read(_offerProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'companyName': r.companyName = v;
    case 'companyAddress': r.companyAddress = v;
    case 'hrName': r.hrName = v;
    case 'hrDesignation': r.hrDesignation = v;
    case 'candidateName': r.candidateName = v;
    case 'candidateAddress': r.candidateAddress = v;
    case 'position': r.position = v;
    case 'department': r.department = v;
    case 'salary': r.salary = v;
    case 'joiningDate': r.joiningDate = v;
    case 'issueDate': r.issueDate = v;
    case 'reportingTo': r.reportingTo = v;
    case 'benefits': r.benefits = v;
    case 'extraClauses': r.extraClauses = v;
  }
  return r;
});

class _CompanyTab extends ConsumerWidget {
  const _CompanyTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_offerProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Company Details'),
        AppTextField(label: 'Company Name *', hint: 'ABC Corp Pvt Ltd',
            initialValue: f.companyName, onChanged: (v) => _set(ref, 'companyName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Company address', initialValue: f.companyAddress,
            maxLines: 2, onChanged: (v) => _set(ref, 'companyAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Authorized By', hint: 'Priya Sharma',
              initialValue: f.hrName, onChanged: (v) => _set(ref, 'hrName', v)),
          right: AppTextField(label: 'Designation', hint: 'HR Manager',
              initialValue: f.hrDesignation, onChanged: (v) => _set(ref, 'hrDesignation', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _CandidateTab extends ConsumerWidget {
  const _CandidateTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_offerProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Candidate Details'),
        AppTextField(label: 'Candidate Name *', hint: 'Rahul Sharma',
            initialValue: f.candidateName, onChanged: (v) => _set(ref, 'candidateName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Candidate Address', hint: 'Candidate address',
            initialValue: f.candidateAddress, maxLines: 2, onChanged: (v) => _set(ref, 'candidateAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Position *', hint: 'Software Engineer',
              initialValue: f.position, onChanged: (v) => _set(ref, 'position', v)),
          right: AppTextField(label: 'Department', hint: 'Engineering',
              initialValue: f.department, onChanged: (v) => _set(ref, 'department', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Reporting To', hint: 'Team Lead / Manager name',
            initialValue: f.reportingTo, onChanged: (v) => _set(ref, 'reportingTo', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _TermsTab extends ConsumerWidget {
  const _TermsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_offerProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Offer Terms'),
        AppFormRow(
          left: AppTextField(label: 'Joining Date', hint: 'DD/MM/YYYY',
              initialValue: f.joiningDate, onChanged: (v) => _set(ref, 'joiningDate', v)),
          right: AppTextField(label: 'Issue Date', hint: 'DD/MM/YYYY',
              initialValue: f.issueDate, onChanged: (v) => _set(ref, 'issueDate', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Benefits (optional)', hint: 'Health insurance, PF, etc.',
            initialValue: f.benefits, maxLines: 2, onChanged: (v) => _set(ref, 'benefits', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Additional Clauses (optional)',
            hint: 'Notice period, confidentiality, etc.',
            initialValue: f.extraClauses, maxLines: 3, onChanged: (v) => _set(ref, 'extraClauses', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _CtcTab extends ConsumerWidget {
  const _CtcTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_offerProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Compensation'),
        AppTextField(label: 'CTC / Salary (₹/year)', hint: '6,00,000',
            initialValue: f.salary,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) => _set(ref, 'salary', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Offer Letter');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.051, 0.584, 0.533);
  final fmt = NumberFormat('#,##,##0.00', 'en_IN');
  final salary = double.tryParse(f.salary.replaceAll(',', '')) ?? 0;

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(48),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Text(f.companyName.isEmpty ? 'Company Name' : f.companyName,
          style: pw.TextStyle(font: heading, fontSize: 18, color: accent)),
      if (f.companyAddress.isNotEmpty)
        pw.Text(f.companyAddress, style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
      pw.SizedBox(height: 6),
      pw.Text('Date: ${f.issueDate.isEmpty ? "—" : f.issueDate}',
          style: pw.TextStyle(font: reg, fontSize: 11)),
      pw.SizedBox(height: 16),
      pw.Text(f.candidateName.isEmpty ? 'Candidate Name' : f.candidateName,
          style: pw.TextStyle(font: bold, fontSize: 12)),
      if (f.candidateAddress.isNotEmpty)
        pw.Text(f.candidateAddress, style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
      pw.SizedBox(height: 20),
      pw.Center(child: pw.Text('OFFER OF EMPLOYMENT',
          style: pw.TextStyle(font: heading, fontSize: 16))),
      pw.SizedBox(height: 16),
      pw.Text('Dear ${f.candidateName.isEmpty ? "Candidate" : f.candidateName},',
          style: pw.TextStyle(font: reg, fontSize: 12)),
      pw.SizedBox(height: 8),
      pw.RichText(text: pw.TextSpan(
        style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2),
        children: [
          const pw.TextSpan(text: 'We are pleased to offer you the position of '),
          pw.TextSpan(text: f.position.isEmpty ? 'Position' : f.position,
              style: pw.TextStyle(font: bold)),
          if (f.department.isNotEmpty)
            pw.TextSpan(text: ' in the ${f.department} department'),
          const pw.TextSpan(text: ' at '),
          pw.TextSpan(text: f.companyName.isEmpty ? 'our company' : f.companyName,
              style: pw.TextStyle(font: bold)),
          const pw.TextSpan(text: '.'),
        ],
      )),
      pw.SizedBox(height: 12),
      pw.Table(
        border: pw.TableBorder.all(color: PdfColors.grey300),
        children: [
          _tRow('Annual CTC', '₹${fmt.format(salary)}', reg, bold),
          _tRow('Joining Date', f.joiningDate.isEmpty ? '—' : f.joiningDate, reg, bold),
          if (f.reportingTo.isNotEmpty) _tRow('Reporting To', f.reportingTo, reg, bold),
        ],
      ),
      if (f.benefits.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text('Benefits:', style: pw.TextStyle(font: bold, fontSize: 11)),
        pw.Text(f.benefits, style: pw.TextStyle(font: reg, fontSize: 11)),
      ],
      if (f.extraClauses.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text('Additional Terms:', style: pw.TextStyle(font: bold, fontSize: 11)),
        pw.Text(f.extraClauses, style: pw.TextStyle(font: reg, fontSize: 11)),
      ],
      pw.Spacer(),
      pw.Text('Kindly sign and return a copy of this letter as acceptance.',
          style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey700)),
      pw.SizedBox(height: 24),
      pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('For ${f.companyName}', style: pw.TextStyle(font: bold, fontSize: 11)),
          pw.SizedBox(height: 24),
          pw.Text(f.hrName.isEmpty ? '_______________' : f.hrName,
              style: pw.TextStyle(font: bold, fontSize: 12)),
          pw.Text(f.hrDesignation.isEmpty ? 'Authorized Signatory' : f.hrDesignation,
              style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('Candidate Acceptance', style: pw.TextStyle(font: bold, fontSize: 11)),
          pw.SizedBox(height: 24),
          pw.Text('_______________', style: pw.TextStyle(font: reg, fontSize: 12)),
          pw.Text('Signature & Date', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
      ]),
    ]),
  ));
  return doc;
}

pw.TableRow _tRow(String label, String value, pw.Font reg, pw.Font bold) =>
    pw.TableRow(children: [
      pw.Padding(padding: const pw.EdgeInsets.all(6),
          child: pw.Text(label, style: pw.TextStyle(font: bold, fontSize: 10))),
      pw.Padding(padding: const pw.EdgeInsets.all(6),
          child: pw.Text(value, style: pw.TextStyle(font: reg, fontSize: 10))),
    ]);

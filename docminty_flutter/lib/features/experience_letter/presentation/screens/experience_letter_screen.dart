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
  String companyName = '', companyAddress = '', hrName = '', hrDesignation = '';
  String employeeName = '', designation = '', department = '';
  String joiningDate = '', lastDate = '', issueDate = '';
  String responsibilities = '', extraNote = '';

  Map<String, dynamic> toJson() => {
    'companyName': companyName, 'companyAddress': companyAddress,
    'hrName': hrName, 'hrDesignation': hrDesignation,
    'employeeName': employeeName, 'designation': designation,
    'department': department, 'joiningDate': joiningDate,
    'lastDate': lastDate, 'issueDate': issueDate,
    'responsibilities': responsibilities, 'extraNote': extraNote,
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.companyName = j['companyName'] as String? ?? '';
    f.companyAddress = j['companyAddress'] as String? ?? '';
    f.hrName = j['hrName'] as String? ?? '';
    f.hrDesignation = j['hrDesignation'] as String? ?? '';
    f.employeeName = j['employeeName'] as String? ?? '';
    f.designation = j['designation'] as String? ?? '';
    f.department = j['department'] as String? ?? '';
    f.joiningDate = j['joiningDate'] as String? ?? '';
    f.lastDate = j['lastDate'] as String? ?? '';
    f.issueDate = j['issueDate'] as String? ?? '';
    f.responsibilities = j['responsibilities'] as String? ?? '';
    f.extraNote = j['extraNote'] as String? ?? '';
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.companyName = companyName; r.companyAddress = companyAddress;
    r.hrName = hrName; r.hrDesignation = hrDesignation;
    r.employeeName = employeeName; r.designation = designation;
    r.department = department; r.joiningDate = joiningDate;
    r.lastDate = lastDate; r.issueDate = issueDate;
    r.responsibilities = responsibilities; r.extraNote = extraNote;
    return r;
  }
}

final _expProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

class ExperienceLetterScreen extends ConsumerStatefulWidget {
  const ExperienceLetterScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<ExperienceLetterScreen> createState() => _ELState();
}

class _ELState extends ConsumerState<ExperienceLetterScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Company', 'Employee', 'Content'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          ref.read(_expProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData));
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
      final f = ref.read(_expProvider);
      final pdf = await _buildPdf(f);
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'ExperienceLetter_${f.employeeName}.pdf');
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
        final pdf = await _buildPdf(ref.read(_expProvider));
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
    final f = ref.read(_expProvider);
    final req = SaveDocumentRequest(
      docType: 'experience-letter',
      title: 'Experience Letter - ${f.employeeName}',
      templateName: 'Classic',
      partyName: f.employeeName,
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
        title: Text(widget.savedDocument != null ? 'Edit Experience Letter' : 'New Experience Letter'),
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
            children: const [_CompanyTab(), _EmployeeTab(), _ContentTab()],
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

class _CompanyTab extends ConsumerWidget {
  const _CompanyTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_expProvider);
    final n = ref.read(_expProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Company Details'),
        AppTextField(label: 'Company Name *', hint: 'ABC Corp Pvt Ltd',
            initialValue: f.companyName,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.companyName = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Office address', initialValue: f.companyAddress,
            maxLines: 2, onChanged: (v) => n.up((s) { final r = s.copy(); r.companyAddress = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'HR Name', hint: 'Priya Sharma',
              initialValue: f.hrName,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.hrName = v; return r; })),
          right: AppTextField(label: 'HR Designation', hint: 'HR Manager',
              initialValue: f.hrDesignation,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.hrDesignation = v; return r; })),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _EmployeeTab extends ConsumerWidget {
  const _EmployeeTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_expProvider);
    final n = ref.read(_expProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Employee Details'),
        AppTextField(label: 'Employee Name *', hint: 'Rahul Sharma',
            initialValue: f.employeeName,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.employeeName = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Designation', hint: 'Software Engineer',
              initialValue: f.designation,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.designation = v; return r; })),
          right: AppTextField(label: 'Department', hint: 'Engineering',
              initialValue: f.department,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.department = v; return r; })),
        ),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Joining Date', hint: 'DD/MM/YYYY',
              initialValue: f.joiningDate,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.joiningDate = v; return r; })),
          right: AppTextField(label: 'Last Working Day', hint: 'DD/MM/YYYY',
              initialValue: f.lastDate,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.lastDate = v; return r; })),
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

class _ContentTab extends ConsumerWidget {
  const _ContentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_expProvider);
    final n = ref.read(_expProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Letter Content'),
        AppTextField(label: 'Key Responsibilities (optional)', hint: 'Worked on...',
            initialValue: f.responsibilities, maxLines: 4,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.responsibilities = v; return r; })),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Extra Note (optional)', hint: 'We wish them all the best...',
            initialValue: f.extraNote, maxLines: 2,
            onChanged: (v) => n.up((s) { final r = s.copy(); r.extraNote = v; return r; })),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Experience Letter');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.051, 0.584, 0.533);

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(48),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Text(f.companyName.isEmpty ? 'Company Name' : f.companyName,
          style: pw.TextStyle(font: heading, fontSize: 18, color: accent)),
      if (f.companyAddress.isNotEmpty)
        pw.Text(f.companyAddress, style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
      pw.SizedBox(height: 24),
      pw.Text('Date: ${f.issueDate.isEmpty ? "—" : f.issueDate}',
          style: pw.TextStyle(font: reg, fontSize: 11)),
      pw.SizedBox(height: 20),
      pw.Center(child: pw.Text('EXPERIENCE CERTIFICATE',
          style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColors.black))),
      pw.SizedBox(height: 20),
      pw.RichText(text: pw.TextSpan(
        style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2),
        children: [
          const pw.TextSpan(text: 'This is to certify that '),
          pw.TextSpan(text: f.employeeName.isEmpty ? 'Employee Name' : f.employeeName,
              style: pw.TextStyle(font: bold)),
          const pw.TextSpan(text: ' was employed with us as '),
          pw.TextSpan(text: f.designation.isEmpty ? 'Designation' : f.designation,
              style: pw.TextStyle(font: bold)),
          if (f.department.isNotEmpty)
            pw.TextSpan(text: ' in the ${f.department} department'),
          pw.TextSpan(text: ' from ${f.joiningDate.isEmpty ? "—" : f.joiningDate} to ${f.lastDate.isEmpty ? "—" : f.lastDate}.'),
        ],
      )),
      if (f.responsibilities.isNotEmpty) ...[
        pw.SizedBox(height: 14),
        pw.Text('During the tenure, ${f.employeeName} was responsible for:',
            style: pw.TextStyle(font: reg, fontSize: 12)),
        pw.SizedBox(height: 6),
        pw.Text(f.responsibilities, style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey700)),
      ],
      pw.SizedBox(height: 14),
      pw.Text(
        '${f.employeeName.isEmpty ? "The employee" : f.employeeName} has been a dedicated and hardworking individual. We wish them success in all future endeavors.',
        style: pw.TextStyle(font: reg, fontSize: 12),
      ),
      if (f.extraNote.isNotEmpty) ...[
        pw.SizedBox(height: 8),
        pw.Text(f.extraNote, style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey700)),
      ],
      pw.Spacer(),
      pw.Text('Yours sincerely,', style: pw.TextStyle(font: reg, fontSize: 12)),
      pw.SizedBox(height: 32),
      pw.Text(f.hrName.isEmpty ? '_______________' : f.hrName,
          style: pw.TextStyle(font: bold, fontSize: 12)),
      pw.Text(f.hrDesignation.isEmpty ? 'Authorized Signatory' : f.hrDesignation,
          style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
      pw.Text(f.companyName, style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
    ]),
  ));
  return doc;
}

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
  String employeeName = '', designation = '', department = '';
  String managerName = '', managerDesignation = '';
  String companyName = '', issueDate = '', lastWorkingDay = '';
  String reason = '', gratitudeNote = '';

  Map<String, dynamic> toJson() => {
    'employeeName': employeeName, 'designation': designation,
    'department': department, 'managerName': managerName,
    'managerDesignation': managerDesignation, 'companyName': companyName,
    'issueDate': issueDate, 'lastWorkingDay': lastWorkingDay,
    'reason': reason, 'gratitudeNote': gratitudeNote,
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.employeeName = j['employeeName'] as String? ?? '';
    f.designation = j['designation'] as String? ?? '';
    f.department = j['department'] as String? ?? '';
    f.managerName = j['managerName'] as String? ?? '';
    f.managerDesignation = j['managerDesignation'] as String? ?? '';
    f.companyName = j['companyName'] as String? ?? '';
    f.issueDate = j['issueDate'] as String? ?? '';
    f.lastWorkingDay = j['lastWorkingDay'] as String? ?? '';
    f.reason = j['reason'] as String? ?? '';
    f.gratitudeNote = j['gratitudeNote'] as String? ?? '';
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.employeeName = employeeName; r.designation = designation;
    r.department = department; r.managerName = managerName;
    r.managerDesignation = managerDesignation; r.companyName = companyName;
    r.issueDate = issueDate; r.lastWorkingDay = lastWorkingDay;
    r.reason = reason; r.gratitudeNote = gratitudeNote;
    return r;
  }
}

final _resProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

class ResignationLetterScreen extends ConsumerStatefulWidget {
  const ResignationLetterScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<ResignationLetterScreen> createState() => _State();
}

class _State extends ConsumerState<ResignationLetterScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Employee', 'Manager', 'Details', 'Content'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try { ref.read(_resProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData)); }
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
      final pdf = await _buildPdf(ref.read(_resProvider));
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'ResignationLetter_${ref.read(_resProvider).employeeName}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_resProvider));
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
    final f = ref.read(_resProvider);
    final req = SaveDocumentRequest(
      docType: 'resignation-letter',
      title: 'Resignation Letter - ${f.employeeName}',
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
        title: Text(widget.savedDocument != null ? 'Edit Resignation Letter' : 'New Resignation Letter'),
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
            children: const [_EmployeeTab(), _ManagerTab(), _DetailsTab(), _ContentTab()],
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

void _set(WidgetRef ref, String k, String v) => ref.read(_resProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'employeeName': r.employeeName = v;
    case 'designation': r.designation = v;
    case 'department': r.department = v;
    case 'managerName': r.managerName = v;
    case 'managerDesignation': r.managerDesignation = v;
    case 'companyName': r.companyName = v;
    case 'issueDate': r.issueDate = v;
    case 'lastWorkingDay': r.lastWorkingDay = v;
    case 'reason': r.reason = v;
    case 'gratitudeNote': r.gratitudeNote = v;
  }
  return r;
});

class _EmployeeTab extends ConsumerWidget {
  const _EmployeeTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_resProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Your Details'),
        AppTextField(label: 'Your Name *', hint: 'Rahul Sharma',
            initialValue: f.employeeName, onChanged: (v) => _set(ref, 'employeeName', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Designation', hint: 'Software Engineer',
              initialValue: f.designation, onChanged: (v) => _set(ref, 'designation', v)),
          right: AppTextField(label: 'Department', hint: 'Engineering',
              initialValue: f.department, onChanged: (v) => _set(ref, 'department', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ManagerTab extends ConsumerWidget {
  const _ManagerTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_resProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Addressed To'),
        AppTextField(label: 'Manager Name', hint: 'Priya Sharma',
            initialValue: f.managerName, onChanged: (v) => _set(ref, 'managerName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Manager Designation', hint: 'Engineering Manager',
            initialValue: f.managerDesignation, onChanged: (v) => _set(ref, 'managerDesignation', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Company Name *', hint: 'ABC Corp Pvt Ltd',
            initialValue: f.companyName, onChanged: (v) => _set(ref, 'companyName', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _DetailsTab extends ConsumerWidget {
  const _DetailsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_resProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Letter Details'),
        AppFormRow(
          left: AppTextField(label: 'Date', hint: 'DD/MM/YYYY',
              initialValue: f.issueDate, onChanged: (v) => _set(ref, 'issueDate', v)),
          right: AppTextField(label: 'Last Working Day', hint: 'DD/MM/YYYY',
              initialValue: f.lastWorkingDay, onChanged: (v) => _set(ref, 'lastWorkingDay', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ContentTab extends ConsumerWidget {
  const _ContentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_resProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Letter Content'),
        AppTextField(label: 'Reason for Resignation', hint: 'Personal reasons, better opportunity...',
            initialValue: f.reason, maxLines: 3, onChanged: (v) => _set(ref, 'reason', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Gratitude Note (optional)',
            hint: 'I am grateful for the opportunities...',
            initialValue: f.gratitudeNote, maxLines: 2, onChanged: (v) => _set(ref, 'gratitudeNote', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Resignation Letter');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(48),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Text('Date: ${f.issueDate.isEmpty ? "—" : f.issueDate}',
          style: pw.TextStyle(font: reg, fontSize: 11)),
      pw.SizedBox(height: 16),
      pw.Text(f.managerName.isEmpty ? 'Manager Name' : f.managerName,
          style: pw.TextStyle(font: bold, fontSize: 12)),
      if (f.managerDesignation.isNotEmpty)
        pw.Text(f.managerDesignation, style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
      pw.Text(f.companyName.isEmpty ? 'Company Name' : f.companyName,
          style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
      pw.SizedBox(height: 20),
      pw.Center(child: pw.Text('LETTER OF RESIGNATION',
          style: pw.TextStyle(font: heading, fontSize: 15))),
      pw.SizedBox(height: 16),
      pw.Text('Dear ${f.managerName.isEmpty ? "Sir/Madam" : f.managerName},',
          style: pw.TextStyle(font: reg, fontSize: 12)),
      pw.SizedBox(height: 10),
      pw.RichText(text: pw.TextSpan(
        style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2),
        children: [
          const pw.TextSpan(text: 'I, '),
          pw.TextSpan(text: f.employeeName.isEmpty ? 'Employee Name' : f.employeeName,
              style: pw.TextStyle(font: bold)),
          if (f.designation.isNotEmpty)
            pw.TextSpan(text: ', ${f.designation}'),
          if (f.department.isNotEmpty)
            pw.TextSpan(text: ' – ${f.department}'),
          const pw.TextSpan(text: ', hereby resign from my position effective '),
          pw.TextSpan(text: f.lastWorkingDay.isEmpty ? '—' : f.lastWorkingDay,
              style: pw.TextStyle(font: bold)),
          const pw.TextSpan(text: '.'),
        ],
      )),
      if (f.reason.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text(f.reason, style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2)),
      ],
      pw.SizedBox(height: 10),
      if (f.gratitudeNote.isNotEmpty)
        pw.Text(f.gratitudeNote, style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2))
      else
        pw.Text(
          'I am grateful for the opportunities provided to me and the experience I have gained during my tenure. I will ensure a smooth transition before my last working day.',
          style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2),
        ),
      pw.SizedBox(height: 30),
      pw.Text('Yours sincerely,', style: pw.TextStyle(font: reg, fontSize: 12)),
      pw.SizedBox(height: 32),
      pw.Text(f.employeeName.isEmpty ? '_______________' : f.employeeName,
          style: pw.TextStyle(font: bold, fontSize: 12)),
      if (f.designation.isNotEmpty)
        pw.Text(f.designation, style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey600)),
    ]),
  ));
  return doc;
}

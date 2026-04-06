import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/indian_states.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';
import '../../data/models/salary_slip_form.dart';

final _salaryProvider =
    StateNotifierProvider.autoDispose<_SalaryNotifier, SalarySlipForm>(
        (ref) => _SalaryNotifier());

class _SalaryNotifier extends StateNotifier<SalarySlipForm> {
  _SalaryNotifier() : super(SalarySlipForm());
  void up(SalarySlipForm Function(SalarySlipForm) fn) => state = fn(state);
  void load(SalarySlipForm f) => state = f;
}

class SalarySlipScreen extends ConsumerStatefulWidget {
  const SalarySlipScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<SalarySlipScreen> createState() => _SalarySlipScreenState();
}

class _SalarySlipScreenState extends ConsumerState<SalarySlipScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false, _showPreview = false;
  static const _tabs = ['Company', 'Employee', 'Earnings', 'Deductions'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          ref.read(_salaryProvider.notifier)
              .load(SalarySlipForm.fromJson(widget.savedDocument!.parsedFormData));
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
      final f = ref.read(_salaryProvider);
      final pdf = await _buildPdf(f);
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'SalarySlip_${f.employeeName}_${f.month}${f.year}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final f = ref.read(_salaryProvider);
    final req = SaveDocumentRequest(
      docType: 'salary-slip',
      title: 'Salary Slip - ${f.employeeName} ${f.month} ${f.year}',
      templateName: 'Classic',
      partyName: f.employeeName,
      amount: f.netPay,
      formData: f.toJsonString(),
    );
    final ok = widget.savedDocument != null
        ? await ref.read(documentsProvider.notifier).updateDoc(widget.savedDocument!.id, req)
        : await ref.read(documentsProvider.notifier).save(req);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Saved!' : 'Failed to save.'),
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
        title: Text(widget.savedDocument != null ? 'Edit Salary Slip' : 'New Salary Slip'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
        actions: [
          IconButton(
            icon: Icon(_showPreview ? Icons.edit_rounded : Icons.remove_red_eye_rounded,
                color: AppColors.textMuted),
            onPressed: () => setState(() => _showPreview = !_showPreview),
            tooltip: _showPreview ? 'Edit' : 'Preview PDF',
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
      body: _showPreview ? _buildPreview() : Column(
        children: [
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
              children: [
                _CompanyTab(key: const ValueKey('sc')),
                _EmployeeTab(key: const ValueKey('se')),
                _EarningsTab(key: const ValueKey('sea')),
                _DeductionsTab(key: const ValueKey('sd'), onDownload: _download, downloading: _downloading),
              ],
            ),
          ),
        ],
      ),
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

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_salaryProvider));
        return pdf.save();
      },
      allowPrinting: false,
      allowSharing: false,
      canChangePageFormat: false,
      canChangeOrientation: false,
      canDebug: false,
    );
  }
}

// ─── Company Tab ──────────────────────────────────────────────────────────────
class _CompanyTab extends ConsumerWidget {
  const _CompanyTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(_salaryProvider.notifier);
    final f = ref.watch(_salaryProvider);
    return _sc([
      const AppFormLabel('Company Details'),
      AppTextField(label: 'Company Name *', hint: 'ABC Corp Pvt Ltd',
          initialValue: f.companyName,
          onChanged: (v) => n.up((s) => _cp(s, companyName: v))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'Address', hint: 'Office address', initialValue: f.companyAddress,
          maxLines: 2, onChanged: (v) => n.up((s) => _cp(s, companyAddress: v))),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'City', hint: 'Mumbai', initialValue: f.companyCity,
            onChanged: (v) => n.up((s) => _cp(s, companyCity: v))),
        right: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('State', style: AppTextStyles.label),
          const SizedBox(height: 4),
          DropdownButtonFormField<String>(
            value: IndianStates.all.any((s) => s['code'] == f.companyState) ? f.companyState : null,
            decoration: _ddDeco(),
            isExpanded: true,
            hint: const Text('State', style: TextStyle(fontFamily: 'Inter', fontSize: 13)),
            items: IndianStates.all.map((s) => DropdownMenuItem(
              value: s['code'],
              child: Text(s['name'] ?? '', style: const TextStyle(fontFamily: 'Inter', fontSize: 13)),
            )).toList(),
            onChanged: (v) { if (v != null) n.up((s) => _cp(s, companyState: v)); },
          ),
        ]),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Phone', hint: '+91 98765 43210',
            initialValue: f.companyPhone, keyboardType: TextInputType.phone,
            onChanged: (v) => n.up((s) => _cp(s, companyPhone: v))),
        right: AppTextField(label: 'Email', hint: 'hr@company.com', initialValue: f.companyEmail,
            keyboardType: TextInputType.emailAddress,
            onChanged: (v) => n.up((s) => _cp(s, companyEmail: v))),
      ),
      const SizedBox(height: 80),
    ]);
  }
}

// ─── Employee Tab ─────────────────────────────────────────────────────────────
class _EmployeeTab extends ConsumerWidget {
  const _EmployeeTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(_salaryProvider.notifier);
    final f = ref.watch(_salaryProvider);
    final months = ['January','February','March','April','May','June',
        'July','August','September','October','November','December'];
    return _sc([
      const AppFormLabel('Employee Info'),
      AppTextField(label: 'Employee Name *', hint: 'Rahul Sharma',
          initialValue: f.employeeName,
          onChanged: (v) => n.up((s) => _cp(s, employeeName: v))),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Employee ID', hint: 'EMP-001',
            initialValue: f.employeeId,
            onChanged: (v) => n.up((s) => _cp(s, employeeId: v))),
        right: AppTextField(label: 'Department', hint: 'Engineering',
            initialValue: f.department,
            onChanged: (v) => n.up((s) => _cp(s, department: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Designation', hint: 'Software Engineer',
            initialValue: f.designation,
            onChanged: (v) => n.up((s) => _cp(s, designation: v))),
        right: AppTextField(label: 'Joining Date', hint: 'DD/MM/YYYY',
            initialValue: f.joiningDate,
            onChanged: (v) => n.up((s) => _cp(s, joiningDate: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'PAN Number', hint: 'ABCDE1234F',
            initialValue: f.panNumber, textCapitalization: TextCapitalization.characters,
            onChanged: (v) => n.up((s) => _cp(s, panNumber: v.toUpperCase()))),
        right: AppTextField(label: 'PF Number', hint: 'PF/KA/001/001',
            initialValue: f.pfNumber,
            onChanged: (v) => n.up((s) => _cp(s, pfNumber: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      const AppFormLabel('Pay Period'),
      AppFormRow(
        left: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Month', style: AppTextStyles.label),
          const SizedBox(height: 4),
          DropdownButtonFormField<String>(
            value: months.contains(f.month) ? f.month : null,
            decoration: _ddDeco(),
            isExpanded: true,
            hint: const Text('Month', style: TextStyle(fontFamily: 'Inter', fontSize: 13)),
            items: months.map((m) => DropdownMenuItem(value: m,
                child: Text(m, style: const TextStyle(fontFamily: 'Inter', fontSize: 13)))).toList(),
            onChanged: (v) { if (v != null) n.up((s) => _cp(s, month: v)); },
          ),
        ]),
        right: AppTextField(label: 'Year', hint: '2026', initialValue: f.year,
            keyboardType: TextInputType.number,
            onChanged: (v) => n.up((s) => _cp(s, year: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Working Days', hint: '26', initialValue: f.workingDays,
            keyboardType: TextInputType.number,
            onChanged: (v) => n.up((s) => _cp(s, workingDays: v))),
        right: AppTextField(label: 'Paid Days', hint: '26', initialValue: f.paidDays,
            keyboardType: TextInputType.number,
            onChanged: (v) => n.up((s) => _cp(s, paidDays: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      const AppFormLabel('Bank Details'),
      AppTextField(label: 'Bank Name', hint: 'HDFC Bank', initialValue: f.bankName,
          onChanged: (v) => n.up((s) => _cp(s, bankName: v))),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Account Number', hint: '1234567890',
            initialValue: f.accountNumber,
            onChanged: (v) => n.up((s) => _cp(s, accountNumber: v))),
        right: AppTextField(label: 'IFSC Code', hint: 'HDFC0001234',
            initialValue: f.ifscCode, textCapitalization: TextCapitalization.characters,
            onChanged: (v) => n.up((s) => _cp(s, ifscCode: v.toUpperCase()))),
      ),
      const SizedBox(height: 80),
    ]);
  }
}

// ─── Earnings Tab ─────────────────────────────────────────────────────────────
class _EarningsTab extends ConsumerWidget {
  const _EarningsTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(_salaryProvider.notifier);
    final f = ref.watch(_salaryProvider);
    return _sc([
      const AppFormLabel('Earnings (₹/month)'),
      _earningField('Basic Salary *', f.basic, (v) => n.up((s) => _cp(s, basic: v))),
      _earningField('House Rent Allowance (HRA)', f.hra, (v) => n.up((s) => _cp(s, hra: v))),
      _earningField('Dearness Allowance (DA)', f.da, (v) => n.up((s) => _cp(s, da: v))),
      _earningField('Conveyance Allowance', f.conveyance, (v) => n.up((s) => _cp(s, conveyance: v))),
      _earningField('Medical Allowance', f.medical, (v) => n.up((s) => _cp(s, medical: v))),
      _earningField('Other Allowances', f.otherAllowances, (v) => n.up((s) => _cp(s, otherAllowances: v))),
      const SizedBox(height: 12),
      AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        color: AppColors.secondaryLight,
        borderColor: AppColors.secondary,
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Gross Earnings', style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w700)),
          Text('₹${f.grossEarnings.toStringAsFixed(2)}',
              style: AppTextStyles.h4.copyWith(color: AppColors.secondary)),
        ]),
      ),
      const SizedBox(height: 80),
    ]);
  }

  Widget _earningField(String label, String value, ValueChanged<String> onChanged) =>
      Padding(
        padding: const EdgeInsets.only(bottom: AppSpacing.base),
        child: AppTextField(
            label: label, hint: '0.00', initialValue: value,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: onChanged),
      );
}

// ─── Deductions Tab ───────────────────────────────────────────────────────────
class _DeductionsTab extends ConsumerWidget {
  const _DeductionsTab({super.key, required this.onDownload, required this.downloading});
  final VoidCallback onDownload;
  final bool downloading;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(_salaryProvider.notifier);
    final f = ref.watch(_salaryProvider);
    final fmt = NumberFormat('#,##,##0.00', 'en_IN');
    return _sc([
      const AppFormLabel('Deductions (₹/month)'),
      AppTextField(label: 'Income Tax (TDS)', hint: '0.00', initialValue: f.incomeTax,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          onChanged: (v) => n.up((s) => _cp(s, incomeTax: v))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'Other Deductions', hint: '0.00', initialValue: f.otherDeductions,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          onChanged: (v) => n.up((s) => _cp(s, otherDeductions: v))),
      const SizedBox(height: AppSpacing.lg),
      const AppFormLabel('Summary'),
      AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(children: [
          _row('Gross Earnings', '₹${fmt.format(f.grossEarnings)}', AppColors.textPrimary),
          _row('Total Deductions', '₹${fmt.format(f.totalDeductions)}', AppColors.error),
          const Divider(),
          _row('Net Pay', '₹${fmt.format(f.netPay)}', AppColors.success, bold: true),
        ]),
      ),
      const SizedBox(height: AppSpacing.base),
      AppButton(
        label: downloading ? 'Generating...' : 'Download PDF',
        icon: const Icon(Icons.download_rounded, color: Colors.white, size: 16),
        onPressed: downloading ? null : onDownload,
        loading: downloading,
        width: double.infinity,
      ),
      const SizedBox(height: 80),
    ]);
  }

  Widget _row(String label, String value, Color color, {bool bold = false}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: AppTextStyles.body),
      Text(value, style: AppTextStyles.body.copyWith(
          color: color, fontWeight: bold ? FontWeight.w800 : FontWeight.w600)),
    ]),
  );
}

Widget _sc(List<Widget> children) => SingleChildScrollView(
    padding: const EdgeInsets.all(AppSpacing.base),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children));

InputDecoration _ddDeco() => InputDecoration(
  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(AppRadius.md),
    borderSide: const BorderSide(color: AppColors.border),
  ),
  enabledBorder: OutlineInputBorder(
    borderRadius: BorderRadius.circular(AppRadius.md),
    borderSide: const BorderSide(color: AppColors.border),
  ),
);

SalarySlipForm _cp(SalarySlipForm s, {
  String? companyName, String? companyAddress, String? companyCity,
  String? companyState, String? companyPhone, String? companyEmail, String? employeeName,
  String? employeeId, String? designation, String? department,
  String? panNumber, String? pfNumber, String? bankName,
  String? accountNumber, String? ifscCode, String? joiningDate,
  String? month, String? year, String? paymentDate,
  String? basic, String? hra, String? da, String? conveyance,
  String? medical, String? otherAllowances, String? incomeTax,
  String? otherDeductions, String? workingDays, String? paidDays,
}) {
  final r = SalarySlipForm();
  r.companyName = companyName ?? s.companyName;
  r.companyAddress = companyAddress ?? s.companyAddress;
  r.companyCity = companyCity ?? s.companyCity;
  r.companyState = companyState ?? s.companyState;
  r.companyPhone = companyPhone ?? s.companyPhone;
  r.companyEmail = companyEmail ?? s.companyEmail;
  r.employeeName = employeeName ?? s.employeeName;
  r.employeeId = employeeId ?? s.employeeId;
  r.designation = designation ?? s.designation;
  r.department = department ?? s.department;
  r.panNumber = panNumber ?? s.panNumber;
  r.pfNumber = pfNumber ?? s.pfNumber;
  r.bankName = bankName ?? s.bankName;
  r.accountNumber = accountNumber ?? s.accountNumber;
  r.ifscCode = ifscCode ?? s.ifscCode;
  r.joiningDate = joiningDate ?? s.joiningDate;
  r.month = month ?? s.month;
  r.year = year ?? s.year;
  r.paymentDate = paymentDate ?? s.paymentDate;
  r.basic = basic ?? s.basic;
  r.hra = hra ?? s.hra;
  r.da = da ?? s.da;
  r.conveyance = conveyance ?? s.conveyance;
  r.medical = medical ?? s.medical;
  r.otherAllowances = otherAllowances ?? s.otherAllowances;
  r.incomeTax = incomeTax ?? s.incomeTax;
  r.otherDeductions = otherDeductions ?? s.otherDeductions;
  r.workingDays = workingDays ?? s.workingDays;
  r.paidDays = paidDays ?? s.paidDays;
  return r;
}

Future<pw.Document> _buildPdf(SalarySlipForm f) async {
  final doc = pw.Document(title: 'Salary Slip', author: 'DocMinty');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.051, 0.584, 0.533);
  final fmt = NumberFormat('#,##,##0.00', 'en_IN');

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(36),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Container(
        color: accent,
        padding: const pw.EdgeInsets.all(16),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text(f.companyName.isEmpty ? 'Company Name' : f.companyName,
                style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColors.white)),
            if (f.companyAddress.isNotEmpty)
              pw.Text([f.companyAddress, f.companyCity, f.companyState].where((v) => v.isNotEmpty).join(', '),
                  style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.white)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('SALARY SLIP', style: pw.TextStyle(font: heading, fontSize: 18, color: PdfColors.white)),
            pw.Text('${f.month} ${f.year}', style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.white)),
          ]),
        ]),
      ),
      pw.SizedBox(height: 16),
      pw.Table(
        border: pw.TableBorder.all(color: PdfColors.grey200),
        children: [
          _tableRow(['Employee Name', f.employeeName, 'Employee ID', f.employeeId], reg, bold),
          _tableRow(['Designation', f.designation, 'Department', f.department], reg, bold),
          _tableRow(['PAN Number', f.panNumber, 'PF Number', f.pfNumber], reg, bold),
          _tableRow(['Joining Date', f.joiningDate, 'Payment Date', f.paymentDate], reg, bold),
          _tableRow(['Working Days', f.workingDays, 'Paid Days', f.paidDays], reg, bold),
        ],
      ),
      pw.SizedBox(height: 16),
      pw.Row(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
        pw.Expanded(child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Container(color: const PdfColor(0.941, 0.996, 0.969), padding: const pw.EdgeInsets.all(8),
              child: pw.Text('EARNINGS', style: pw.TextStyle(font: bold, fontSize: 10, color: accent))),
          _payRow('Basic Salary', f.basic, reg, bold, fmt),
          _payRow('HRA', f.hra, reg, bold, fmt),
          _payRow('Dearness Allowance', f.da, reg, bold, fmt),
          _payRow('Conveyance', f.conveyance, reg, bold, fmt),
          _payRow('Medical', f.medical, reg, bold, fmt),
          _payRow('Other Allowances', f.otherAllowances, reg, bold, fmt),
          pw.Divider(),
          _payRow('Gross Earnings', f.grossEarnings.toStringAsFixed(2), reg, bold, fmt, isTotal: true),
        ])),
        pw.SizedBox(width: 16),
        pw.Expanded(child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Container(color: const PdfColor(1, 0.945, 0.945), padding: const pw.EdgeInsets.all(8),
              child: pw.Text('DEDUCTIONS', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.red))),
          _payRow('Income Tax (TDS)', f.incomeTax, reg, bold, fmt),
          _payRow('Other Deductions', f.otherDeductions, reg, bold, fmt),
          pw.Divider(),
          _payRow('Total Deductions', f.totalDeductions.toStringAsFixed(2), reg, bold, fmt, isTotal: true),
        ])),
      ]),
      pw.SizedBox(height: 12),
      pw.Container(
        color: accent,
        padding: const pw.EdgeInsets.all(12),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('NET PAY', style: pw.TextStyle(font: heading, fontSize: 14, color: PdfColors.white)),
          pw.Text('₹${fmt.format(f.netPay)}',
              style: pw.TextStyle(font: heading, fontSize: 18, color: PdfColors.white)),
        ]),
      ),
      if (f.bankName.isNotEmpty) ...[
        pw.SizedBox(height: 8),
        pw.Text('Bank: ${f.bankName}  |  A/C: ${f.accountNumber}  |  IFSC: ${f.ifscCode}',
            style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.grey600)),
      ],
      pw.Spacer(),
      pw.Text('This is a computer-generated payslip and does not require a signature.',
          style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.grey400)),
    ]),
  ));
  return doc;
}

pw.TableRow _tableRow(List<String> cells, pw.Font reg, pw.Font bold) {
  return pw.TableRow(children: cells.asMap().entries.map((e) => pw.Padding(
    padding: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    child: pw.Text(e.value,
        style: pw.TextStyle(font: e.key.isEven ? bold : reg, fontSize: 9,
            color: e.key.isEven ? PdfColors.grey600 : PdfColors.black)),
  )).toList());
}

pw.Widget _payRow(String label, String value, pw.Font reg, pw.Font bold,
    NumberFormat fmt, {bool isTotal = false}) {
  final amt = double.tryParse(value.replaceAll(',', '')) ?? 0;
  return pw.Padding(
    padding: const pw.EdgeInsets.symmetric(horizontal: 4, vertical: 3),
    child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
      pw.Text(label, style: pw.TextStyle(font: isTotal ? bold : reg, fontSize: 9)),
      pw.Text('₹${fmt.format(amt)}',
          style: pw.TextStyle(font: isTotal ? bold : reg, fontSize: 9)),
    ]),
  );
}

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';

class _Form {
  String voucherNumber = 'PV-2026-001', voucherDate = '';
  String companyName = '', companyAddress = '';
  String paidTo = '', paidToAddress = '', purpose = '';
  String amount = '', paymentMode = 'NEFT', bankName = '', chequeNumber = '';
  String accountHead = 'Office Expenses', narration = '';
  String preparedBy = '', approvedBy = '', notes = '';

  static const paymentModes = ['Cash', 'NEFT', 'RTGS', 'Cheque', 'UPI', 'Bank Transfer'];
  static const accountHeads = [
    'Office Expenses', 'Travel & Conveyance', 'Salary & Wages',
    'Rent', 'Utilities', 'Vendor Payment', 'Contractor Payment',
    'Advance', 'Miscellaneous',
  ];

  Map<String, dynamic> toJson() => {
    'voucherNumber': voucherNumber, 'voucherDate': voucherDate,
    'companyName': companyName, 'companyAddress': companyAddress,
    'paidTo': paidTo, 'paidToAddress': paidToAddress, 'purpose': purpose,
    'amount': amount, 'paymentMode': paymentMode, 'bankName': bankName,
    'chequeNumber': chequeNumber, 'accountHead': accountHead,
    'narration': narration, 'preparedBy': preparedBy,
    'approvedBy': approvedBy, 'notes': notes,
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.voucherNumber = j['voucherNumber'] as String? ?? 'PV-2026-001';
    f.voucherDate = j['voucherDate'] as String? ?? '';
    f.companyName = j['companyName'] as String? ?? '';
    f.companyAddress = j['companyAddress'] as String? ?? '';
    f.paidTo = j['paidTo'] as String? ?? '';
    f.paidToAddress = j['paidToAddress'] as String? ?? '';
    f.purpose = j['purpose'] as String? ?? '';
    f.amount = j['amount'] as String? ?? '';
    f.paymentMode = j['paymentMode'] as String? ?? 'NEFT';
    f.bankName = j['bankName'] as String? ?? '';
    f.chequeNumber = j['chequeNumber'] as String? ?? '';
    f.accountHead = j['accountHead'] as String? ?? 'Office Expenses';
    f.narration = j['narration'] as String? ?? '';
    f.preparedBy = j['preparedBy'] as String? ?? '';
    f.approvedBy = j['approvedBy'] as String? ?? '';
    f.notes = j['notes'] as String? ?? '';
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.voucherNumber = voucherNumber; r.voucherDate = voucherDate;
    r.companyName = companyName; r.companyAddress = companyAddress;
    r.paidTo = paidTo; r.paidToAddress = paidToAddress; r.purpose = purpose;
    r.amount = amount; r.paymentMode = paymentMode; r.bankName = bankName;
    r.chequeNumber = chequeNumber; r.accountHead = accountHead;
    r.narration = narration; r.preparedBy = preparedBy;
    r.approvedBy = approvedBy; r.notes = notes;
    return r;
  }
}

final _pvProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

void _set(WidgetRef ref, String k, String v) => ref.read(_pvProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'voucherNumber': r.voucherNumber = v;
    case 'voucherDate': r.voucherDate = v;
    case 'companyName': r.companyName = v;
    case 'companyAddress': r.companyAddress = v;
    case 'paidTo': r.paidTo = v;
    case 'paidToAddress': r.paidToAddress = v;
    case 'purpose': r.purpose = v;
    case 'amount': r.amount = v;
    case 'paymentMode': r.paymentMode = v;
    case 'bankName': r.bankName = v;
    case 'chequeNumber': r.chequeNumber = v;
    case 'accountHead': r.accountHead = v;
    case 'narration': r.narration = v;
    case 'preparedBy': r.preparedBy = v;
    case 'approvedBy': r.approvedBy = v;
    case 'notes': r.notes = v;
  }
  return r;
});

class PaymentVoucherScreen extends ConsumerStatefulWidget {
  const PaymentVoucherScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<PaymentVoucherScreen> createState() => _State();
}

class _State extends ConsumerState<PaymentVoucherScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Company', 'Payment', 'Settings'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try { ref.read(_pvProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData)); }
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
      final pdf = await _buildPdf(ref.read(_pvProvider));
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'PaymentVoucher_${ref.read(_pvProvider).voucherNumber}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_pvProvider));
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
    final f = ref.read(_pvProvider);
    final amt = double.tryParse(f.amount.replaceAll(',', ''));
    final req = SaveDocumentRequest(
      docType: 'payment-voucher',
      title: 'Payment Voucher ${f.voucherNumber}',
      templateName: 'Classic',
      referenceNumber: f.voucherNumber,
      partyName: f.paidTo,
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
        title: Text(widget.savedDocument != null ? 'Edit Payment Voucher' : 'New Payment Voucher'),
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
            children: const [_CompanyTab(), _PaymentTab(), _SettingsTab()],
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
    final f = ref.watch(_pvProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Company Details'),
        AppTextField(label: 'Company Name *', hint: 'ABC Corp Pvt Ltd',
            initialValue: f.companyName, onChanged: (v) => _set(ref, 'companyName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', initialValue: f.companyAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'companyAddress', v)),
        const SizedBox(height: AppSpacing.lg),
        const AppFormLabel('Voucher Info'),
        AppFormRow(
          left: AppTextField(label: 'Voucher Number', hint: 'PV-2026-001',
              initialValue: f.voucherNumber, onChanged: (v) => _set(ref, 'voucherNumber', v)),
          right: AppTextField(label: 'Date', hint: 'DD/MM/YYYY',
              initialValue: f.voucherDate, onChanged: (v) => _set(ref, 'voucherDate', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _PaymentTab extends ConsumerWidget {
  const _PaymentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_pvProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Payment Details'),
        AppTextField(label: 'Paid To *', hint: 'Recipient name / company',
            initialValue: f.paidTo, onChanged: (v) => _set(ref, 'paidTo', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Recipient Address', initialValue: f.paidToAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'paidToAddress', v)),
        const SizedBox(height: AppSpacing.base),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Account Head', style: AppTextStyles.label),
          const SizedBox(height: 4),
          DropdownButtonFormField<String>(
            value: _Form.accountHeads.contains(f.accountHead) ? f.accountHead : _Form.accountHeads.first,
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md),
                  borderSide: const BorderSide(color: AppColors.border)),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md),
                  borderSide: const BorderSide(color: AppColors.border)),
            ),
            isExpanded: true,
            items: _Form.accountHeads.map((h) => DropdownMenuItem(
              value: h,
              child: Text(h, style: const TextStyle(fontFamily: 'Inter', fontSize: 13)),
            )).toList(),
            onChanged: (v) { if (v != null) _set(ref, 'accountHead', v); },
          ),
        ]),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Purpose *', hint: 'Payment for services rendered...',
            initialValue: f.purpose, maxLines: 2, onChanged: (v) => _set(ref, 'purpose', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Amount (₹) *', hint: '10,000',
            initialValue: f.amount,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) => _set(ref, 'amount', v)),
        const SizedBox(height: AppSpacing.base),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Payment Mode', style: AppTextStyles.label),
          const SizedBox(height: 6),
          Wrap(spacing: 8, runSpacing: 8,
              children: _Form.paymentModes.map((m) {
                final sel = f.paymentMode == m;
                return GestureDetector(
                  onTap: () => _set(ref, 'paymentMode', m),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: sel ? AppColors.secondary : AppColors.bgCard,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      border: Border.all(color: sel ? AppColors.secondary : AppColors.border),
                    ),
                    child: Text(m, style: TextStyle(fontFamily: 'Inter', fontSize: 12,
                        fontWeight: FontWeight.w600, color: sel ? Colors.white : AppColors.textMuted)),
                  ),
                );
              }).toList()),
        ]),
        if (f.paymentMode == 'Cheque') ...[
          const SizedBox(height: AppSpacing.base),
          AppFormRow(
            left: AppTextField(label: 'Bank Name', initialValue: f.bankName,
                onChanged: (v) => _set(ref, 'bankName', v)),
            right: AppTextField(label: 'Cheque Number', initialValue: f.chequeNumber,
                onChanged: (v) => _set(ref, 'chequeNumber', v)),
          ),
        ] else if (f.paymentMode == 'NEFT' || f.paymentMode == 'RTGS' || f.paymentMode == 'Bank Transfer') ...[
          const SizedBox(height: AppSpacing.base),
          AppTextField(label: 'Bank / Account Details (optional)', initialValue: f.bankName,
              onChanged: (v) => _set(ref, 'bankName', v)),
        ],
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _SettingsTab extends ConsumerWidget {
  const _SettingsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_pvProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Authorisation'),
        AppFormRow(
          left: AppTextField(label: 'Prepared By', hint: 'Name',
              initialValue: f.preparedBy, onChanged: (v) => _set(ref, 'preparedBy', v)),
          right: AppTextField(label: 'Approved By', hint: 'Name',
              initialValue: f.approvedBy, onChanged: (v) => _set(ref, 'approvedBy', v)),
        ),
        const SizedBox(height: AppSpacing.lg),
        const AppFormLabel('Additional'),
        AppTextField(label: 'Narration', hint: 'Detailed description (optional)',
            initialValue: f.narration, maxLines: 2, onChanged: (v) => _set(ref, 'narration', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Notes', initialValue: f.notes, maxLines: 2,
            onChanged: (v) => _set(ref, 'notes', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Payment Voucher');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.957, 0.620, 0.043); // amber
  final fmt = NumberFormat('#,##,##0.00', 'en_IN');
  final amt = double.tryParse(f.amount.replaceAll(',', '')) ?? 0;

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(40),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Container(
        color: accent,
        padding: const pw.EdgeInsets.all(16),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text(f.companyName.isEmpty ? 'Company Name' : f.companyName,
                style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColors.white)),
            if (f.companyAddress.isNotEmpty)
              pw.Text(f.companyAddress, style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.white)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('PAYMENT VOUCHER', style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColors.white)),
            pw.Text('# ${f.voucherNumber}', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.white)),
          ]),
        ]),
      ),
      pw.SizedBox(height: 20),
      pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('Paid To', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
          pw.Text(f.paidTo.isEmpty ? '—' : f.paidTo, style: pw.TextStyle(font: bold, fontSize: 13)),
          if (f.paidToAddress.isNotEmpty)
            pw.Text(f.paidToAddress, style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
          pw.Text('Date: ${f.voucherDate.isEmpty ? "—" : f.voucherDate}',
              style: pw.TextStyle(font: reg, fontSize: 11)),
          pw.Text('Mode: ${f.paymentMode}', style: pw.TextStyle(font: reg, fontSize: 11)),
        ]),
      ]),
      pw.SizedBox(height: 20),
      pw.Container(
        color: const PdfColor(1, 0.973, 0.878),
        padding: const pw.EdgeInsets.all(16),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('Amount Paid', style: pw.TextStyle(font: bold, fontSize: 13)),
          pw.Text('₹${fmt.format(amt)}', style: pw.TextStyle(font: heading, fontSize: 22, color: accent)),
        ]),
      ),
      pw.SizedBox(height: 16),
      pw.Text('Account Head: ${f.accountHead}', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey700)),
      pw.SizedBox(height: 6),
      pw.Text('Purpose:', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
      pw.Text(f.purpose.isEmpty ? '—' : f.purpose, style: pw.TextStyle(font: reg, fontSize: 11)),
      if (f.narration.isNotEmpty) ...[
        pw.SizedBox(height: 6),
        pw.Text('Narration: ${f.narration}', style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey700)),
      ],
      if (f.bankName.isNotEmpty || f.chequeNumber.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        if (f.bankName.isNotEmpty)
          pw.Text('Bank: ${f.bankName}', style: pw.TextStyle(font: reg, fontSize: 11)),
        if (f.chequeNumber.isNotEmpty)
          pw.Text('Cheque No: ${f.chequeNumber}', style: pw.TextStyle(font: reg, fontSize: 11)),
      ],
      if (f.notes.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text('Notes: ${f.notes}', style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey700)),
      ],
      pw.Spacer(),
      pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
        pw.Column(children: [
          pw.Text(f.preparedBy.isEmpty ? '_______________' : f.preparedBy,
              style: pw.TextStyle(font: bold, fontSize: 12)),
          pw.Text('Prepared By', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
        pw.Column(children: [
          pw.Text(f.approvedBy.isEmpty ? '_______________' : f.approvedBy,
              style: pw.TextStyle(font: bold, fontSize: 12)),
          pw.Text('Approved By', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
        pw.Column(children: [
          pw.Text('_______________', style: pw.TextStyle(font: reg, fontSize: 12)),
          pw.Text('Receiver Signature', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
      ]),
    ]),
  ));
  return doc;
}

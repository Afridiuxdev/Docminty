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
  String receiptNumber = 'RENT-2026-001', receiptDate = '';
  String landlordName = '', landlordAddress = '', landlordPan = '';
  String tenantName = '', tenantAddress = '';
  String propertyAddress = '';
  String rentAmount = '', paymentMode = 'Bank Transfer';
  String rentPeriodFrom = '', rentPeriodTo = '';
  String notes = '';

  static const paymentModes = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'NEFT'];

  Map<String, dynamic> toJson() => {
    'receiptNumber': receiptNumber, 'receiptDate': receiptDate,
    'landlordName': landlordName, 'landlordAddress': landlordAddress, 'landlordPan': landlordPan,
    'tenantName': tenantName, 'tenantAddress': tenantAddress,
    'propertyAddress': propertyAddress, 'rentAmount': rentAmount,
    'paymentMode': paymentMode, 'rentPeriodFrom': rentPeriodFrom,
    'rentPeriodTo': rentPeriodTo, 'notes': notes,
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.receiptNumber = j['receiptNumber'] as String? ?? 'RENT-2026-001';
    f.receiptDate = j['receiptDate'] as String? ?? '';
    f.landlordName = j['landlordName'] as String? ?? '';
    f.landlordAddress = j['landlordAddress'] as String? ?? '';
    f.landlordPan = j['landlordPan'] as String? ?? '';
    f.tenantName = j['tenantName'] as String? ?? '';
    f.tenantAddress = j['tenantAddress'] as String? ?? '';
    f.propertyAddress = j['propertyAddress'] as String? ?? '';
    f.rentAmount = j['rentAmount'] as String? ?? '';
    f.paymentMode = j['paymentMode'] as String? ?? 'Bank Transfer';
    f.rentPeriodFrom = j['rentPeriodFrom'] as String? ?? '';
    f.rentPeriodTo = j['rentPeriodTo'] as String? ?? '';
    f.notes = j['notes'] as String? ?? '';
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.receiptNumber = receiptNumber; r.receiptDate = receiptDate;
    r.landlordName = landlordName; r.landlordAddress = landlordAddress; r.landlordPan = landlordPan;
    r.tenantName = tenantName; r.tenantAddress = tenantAddress;
    r.propertyAddress = propertyAddress; r.rentAmount = rentAmount;
    r.paymentMode = paymentMode; r.rentPeriodFrom = rentPeriodFrom;
    r.rentPeriodTo = rentPeriodTo; r.notes = notes;
    return r;
  }
}

final _rrProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

class RentReceiptScreen extends ConsumerStatefulWidget {
  const RentReceiptScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<RentReceiptScreen> createState() => _State();
}

class _State extends ConsumerState<RentReceiptScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Landlord', 'Tenant', 'Payment'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try { ref.read(_rrProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData)); }
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
      final pdf = await _buildPdf(ref.read(_rrProvider));
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'RentReceipt_${ref.read(_rrProvider).receiptNumber}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_rrProvider));
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
    final f = ref.read(_rrProvider);
    final amt = double.tryParse(f.rentAmount.replaceAll(',', ''));
    final req = SaveDocumentRequest(
      docType: 'rent-receipt',
      title: 'Rent Receipt ${f.receiptNumber}',
      templateName: 'Classic',
      referenceNumber: f.receiptNumber,
      partyName: f.tenantName,
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
        title: Text(widget.savedDocument != null ? 'Edit Rent Receipt' : 'New Rent Receipt'),
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
            children: const [_LandlordTab(), _TenantTab(), _PaymentTab()],
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

void _set(WidgetRef ref, String k, String v) => ref.read(_rrProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'receiptNumber': r.receiptNumber = v; case 'receiptDate': r.receiptDate = v;
    case 'landlordName': r.landlordName = v; case 'landlordAddress': r.landlordAddress = v;
    case 'landlordPan': r.landlordPan = v; case 'tenantName': r.tenantName = v;
    case 'tenantAddress': r.tenantAddress = v; case 'propertyAddress': r.propertyAddress = v;
    case 'rentAmount': r.rentAmount = v; case 'paymentMode': r.paymentMode = v;
    case 'rentPeriodFrom': r.rentPeriodFrom = v; case 'rentPeriodTo': r.rentPeriodTo = v;
    case 'notes': r.notes = v;
  }
  return r;
});

class _LandlordTab extends ConsumerWidget {
  const _LandlordTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_rrProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Landlord Details'),
        AppTextField(label: 'Landlord Name *', hint: 'Ramesh Kumar',
            initialValue: f.landlordName, onChanged: (v) => _set(ref, 'landlordName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Landlord Address', initialValue: f.landlordAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'landlordAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'PAN Number', hint: 'ABCDE1234F',
            initialValue: f.landlordPan, textCapitalization: TextCapitalization.characters,
            onChanged: (v) => _set(ref, 'landlordPan', v.toUpperCase())),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _TenantTab extends ConsumerWidget {
  const _TenantTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_rrProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Tenant Details'),
        AppTextField(label: 'Tenant Name *', hint: 'Priya Sharma',
            initialValue: f.tenantName, onChanged: (v) => _set(ref, 'tenantName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Tenant Address', initialValue: f.tenantAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'tenantAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Property Address *', hint: 'Flat 101, Building A, Mumbai',
            initialValue: f.propertyAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'propertyAddress', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _PaymentTab extends ConsumerWidget {
  const _PaymentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_rrProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Payment Details'),
        AppFormRow(
          left: AppTextField(label: 'Receipt Number', hint: 'RENT-2026-001',
              initialValue: f.receiptNumber, onChanged: (v) => _set(ref, 'receiptNumber', v)),
          right: AppTextField(label: 'Date', hint: 'DD/MM/YYYY',
              initialValue: f.receiptDate, onChanged: (v) => _set(ref, 'receiptDate', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Rent Amount (₹) *', hint: '15,000',
            initialValue: f.rentAmount,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) => _set(ref, 'rentAmount', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Period From', hint: 'DD/MM/YYYY',
              initialValue: f.rentPeriodFrom, onChanged: (v) => _set(ref, 'rentPeriodFrom', v)),
          right: AppTextField(label: 'Period To', hint: 'DD/MM/YYYY',
              initialValue: f.rentPeriodTo, onChanged: (v) => _set(ref, 'rentPeriodTo', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Payment Mode', style: AppTextStyles.label),
          const SizedBox(height: 6),
          Wrap(spacing: 8, runSpacing: 6, children: _Form.paymentModes.map((m) {
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
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Notes', initialValue: f.notes, maxLines: 2,
            onChanged: (v) => _set(ref, 'notes', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Rent Receipt');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.231, 0.51, 0.965);
  final fmt = NumberFormat('#,##,##0.00', 'en_IN');
  final amt = double.tryParse(f.rentAmount.replaceAll(',', '')) ?? 0;

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(40),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Container(
        color: accent,
        padding: const pw.EdgeInsets.all(16),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('RENT RECEIPT', style: pw.TextStyle(font: heading, fontSize: 22, color: PdfColors.white)),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('# ${f.receiptNumber}', style: pw.TextStyle(font: bold, fontSize: 11, color: PdfColors.white)),
            pw.Text('Date: ${f.receiptDate.isEmpty ? "—" : f.receiptDate}',
                style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.white)),
          ]),
        ]),
      ),
      pw.SizedBox(height: 20),
      pw.RichText(text: pw.TextSpan(
        style: pw.TextStyle(font: reg, fontSize: 12, lineSpacing: 2),
        children: [
          const pw.TextSpan(text: 'Received from '),
          pw.TextSpan(text: f.tenantName.isEmpty ? 'Tenant Name' : f.tenantName,
              style: pw.TextStyle(font: bold)),
          const pw.TextSpan(text: ' a sum of '),
          pw.TextSpan(text: '₹${fmt.format(amt)}', style: pw.TextStyle(font: bold)),
          const pw.TextSpan(text: ' towards rent of property at '),
          pw.TextSpan(text: f.propertyAddress.isEmpty ? 'Property Address' : f.propertyAddress,
              style: pw.TextStyle(font: bold)),
          if (f.rentPeriodFrom.isNotEmpty || f.rentPeriodTo.isNotEmpty)
            pw.TextSpan(text: ' for the period ${f.rentPeriodFrom} to ${f.rentPeriodTo}'),
          const pw.TextSpan(text: '.'),
        ],
      )),
      pw.SizedBox(height: 16),
      pw.Container(
        color: const PdfColor(0.918, 0.941, 1),
        padding: const pw.EdgeInsets.all(14),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('Rent Amount', style: pw.TextStyle(font: bold, fontSize: 13)),
          pw.Text('₹${fmt.format(amt)}', style: pw.TextStyle(font: heading, fontSize: 22, color: accent)),
        ]),
      ),
      pw.SizedBox(height: 14),
      pw.Table(border: pw.TableBorder.all(color: PdfColors.grey200), children: [
        _r('Payment Mode', f.paymentMode, reg, bold),
        _r('Paid By', f.tenantName.isEmpty ? '—' : f.tenantName, reg, bold),
        if (f.landlordPan.isNotEmpty) _r('Landlord PAN', f.landlordPan, reg, bold),
      ]),
      if (f.notes.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text('Notes: ${f.notes}', style: pw.TextStyle(font: reg, fontSize: 11, color: PdfColors.grey700)),
      ],
      pw.Spacer(),
      pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text(f.landlordName.isEmpty ? '_______________' : f.landlordName,
              style: pw.TextStyle(font: bold, fontSize: 12)),
          pw.Text('Landlord Signature', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
          if (f.landlordAddress.isNotEmpty)
            pw.Text(f.landlordAddress, style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.grey500)),
        ]),
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('_______________', style: pw.TextStyle(font: reg, fontSize: 12)),
          pw.Text('Tenant Signature', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        ]),
      ]),
    ]),
  ));
  return doc;
}

pw.TableRow _r(String label, String value, pw.Font reg, pw.Font bold) => pw.TableRow(children: [
  pw.Padding(padding: const pw.EdgeInsets.all(6),
      child: pw.Text(label, style: pw.TextStyle(font: bold, fontSize: 10))),
  pw.Padding(padding: const pw.EdgeInsets.all(6),
      child: pw.Text(value, style: pw.TextStyle(font: reg, fontSize: 10))),
]);

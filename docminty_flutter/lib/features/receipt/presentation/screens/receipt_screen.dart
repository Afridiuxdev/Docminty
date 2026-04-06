import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';
import '../../data/models/receipt_form.dart';

final _receiptProvider = StateNotifierProvider.autoDispose<_Notifier, ReceiptForm>(
  (ref) => _Notifier(),
);

class _Notifier extends StateNotifier<ReceiptForm> {
  _Notifier() : super(ReceiptForm());
  void up(ReceiptForm Function(ReceiptForm f) fn) => state = fn(state);
  void load(ReceiptForm f) => state = f;
}

class ReceiptScreen extends ConsumerStatefulWidget {
  const ReceiptScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<ReceiptScreen> createState() => _ReceiptScreenState();
}

class _ReceiptScreenState extends ConsumerState<ReceiptScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false;
  bool _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Your Details', 'Payment', 'Settings'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          ref.read(_receiptProvider.notifier)
              .load(ReceiptForm.fromJson(widget.savedDocument!.parsedFormData));
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
      final f = ref.read(_receiptProvider);
      final pdf = await _buildPdf(f);
      await Printing.sharePdf(
          bytes: await pdf.save(), filename: 'Receipt_${f.receiptNumber}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('PDF error: $e'), backgroundColor: AppColors.error));
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_receiptProvider));
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
    final f = ref.read(_receiptProvider);
    final amt = double.tryParse(f.amount.replaceAll(',', '')) ?? 0;
    final req = SaveDocumentRequest(
      docType: 'receipt',
      title: 'Receipt ${f.receiptNumber}',
      templateName: 'Classic',
      referenceNumber: f.receiptNumber,
      partyName: f.receivedFrom,
      amount: amt,
      formData: f.toJsonString(),
    );
    final ok = widget.savedDocument != null
        ? await ref.read(documentsProvider.notifier).updateDoc(widget.savedDocument!.id, req)
        : await ref.read(documentsProvider.notifier).save(req);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Receipt saved!' : 'Failed to save.'),
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
        title: Text(widget.savedDocument != null ? 'Edit Receipt' : 'New Receipt'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
        actions: [
          IconButton(
            icon: Icon(
              _showPreview ? Icons.edit_rounded : Icons.remove_red_eye_rounded,
              color: AppColors.textMuted,
            ),
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
              _DetailsTab(),
              _PaymentTab(),
              _SettingsTab(),
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

class _DetailsTab extends ConsumerWidget {
  const _DetailsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_receiptProvider);
    final n = ref.read(_receiptProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Your Business Details'),
        AppTextField(label: 'Business Name *', hint: 'Your Company',
            initialValue: f.fromName,
            onChanged: (v) => n.up((s) => _cp(s, fromName: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Street address',
            initialValue: f.fromAddress, maxLines: 2,
            onChanged: (v) => n.up((s) => _cp(s, fromAddress: v))),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'City', hint: 'Mumbai',
              initialValue: f.fromCity,
              onChanged: (v) => n.up((s) => _cp(s, fromCity: v))),
          right: AppTextField(label: 'Phone', hint: '+91 98765 43210',
              initialValue: f.fromPhone, keyboardType: TextInputType.phone,
              onChanged: (v) => n.up((s) => _cp(s, fromPhone: v))),
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
    final f = ref.watch(_receiptProvider);
    final n = ref.read(_receiptProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Receipt Details'),
        AppFormRow(
          left: AppTextField(label: 'Receipt Number', hint: 'REC-2026-001',
              initialValue: f.receiptNumber,
              onChanged: (v) => n.up((s) => _cp(s, receiptNumber: v))),
          right: AppTextField(label: 'Date', hint: 'DD/MM/YYYY',
              initialValue: f.receiptDate,
              onChanged: (v) => n.up((s) => _cp(s, receiptDate: v))),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Received From *', hint: 'Payer name',
            initialValue: f.receivedFrom,
            onChanged: (v) => n.up((s) => _cp(s, receivedFrom: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Payer Address', hint: 'Optional',
            initialValue: f.receivedFromAddress,
            onChanged: (v) => n.up((s) => _cp(s, receivedFromAddress: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Amount (₹) *', hint: '10,000',
            initialValue: f.amount,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) => n.up((s) => _cp(s, amount: v))),
        const SizedBox(height: AppSpacing.base),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Payment Mode', style: AppTextStyles.label),
          const SizedBox(height: 6),
          Wrap(spacing: 8, runSpacing: 8, children: ReceiptForm.paymentModes.map((m) {
            final sel = f.paymentMode == m;
            return GestureDetector(
              onTap: () => n.up((s) => _cp(s, paymentMode: m)),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: sel ? AppColors.secondary : AppColors.bgCard,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  border: Border.all(color: sel ? AppColors.secondary : AppColors.border),
                ),
                child: Text(m, style: TextStyle(
                    fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w600,
                    color: sel ? Colors.white : AppColors.textMuted)),
              ),
            );
          }).toList()),
        ]),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Purpose / Description', hint: 'Payment for...',
            initialValue: f.purpose, maxLines: 2,
            onChanged: (v) => n.up((s) => _cp(s, purpose: v))),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _SettingsTab extends ConsumerWidget {
  const _SettingsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_receiptProvider);
    final n = ref.read(_receiptProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Additional Info'),
        AppTextField(label: 'Notes', hint: 'Additional notes',
            initialValue: f.notes, maxLines: 3,
            onChanged: (v) => n.up((s) => _cp(s, notes: v))),
        const SizedBox(height: 80),
      ]),
    );
  }
}

ReceiptForm _cp(ReceiptForm s, {
  String? receiptNumber, String? receiptDate, String? fromName,
  String? fromAddress, String? fromCity, String? fromState,
  String? fromPhone, String? fromEmail, String? receivedFrom,
  String? receivedFromAddress, String? amount, String? paymentMode,
  String? purpose, String? notes,
}) {
  final r = ReceiptForm();
  r.receiptNumber = receiptNumber ?? s.receiptNumber;
  r.receiptDate = receiptDate ?? s.receiptDate;
  r.fromName = fromName ?? s.fromName;
  r.fromAddress = fromAddress ?? s.fromAddress;
  r.fromCity = fromCity ?? s.fromCity;
  r.fromState = fromState ?? s.fromState;
  r.fromPhone = fromPhone ?? s.fromPhone;
  r.fromEmail = fromEmail ?? s.fromEmail;
  r.receivedFrom = receivedFrom ?? s.receivedFrom;
  r.receivedFromAddress = receivedFromAddress ?? s.receivedFromAddress;
  r.amount = amount ?? s.amount;
  r.paymentMode = paymentMode ?? s.paymentMode;
  r.purpose = purpose ?? s.purpose;
  r.notes = notes ?? s.notes;
  return r;
}

Future<pw.Document> _buildPdf(ReceiptForm f) async {
  final doc = pw.Document(title: 'Receipt ${f.receiptNumber}', author: 'DocMinty');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.051, 0.584, 0.533);
  final fmt = NumberFormat('#,##,##0.00', 'en_IN');
  final amt = double.tryParse(f.amount.replaceAll(',', '')) ?? 0;

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(40),
    build: (ctx) => pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Container(
          color: accent,
          padding: const pw.EdgeInsets.all(20),
          child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
            pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
              pw.Text(f.fromName.isEmpty ? 'Your Business' : f.fromName,
                  style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColors.white)),
              if (f.fromAddress.isNotEmpty)
                pw.Text(f.fromAddress, style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.white)),
            ]),
            pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
              pw.Text('RECEIPT', style: pw.TextStyle(font: heading, fontSize: 22, color: PdfColors.white)),
              pw.Text('# ${f.receiptNumber}', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.white)),
            ]),
          ]),
        ),
        pw.SizedBox(height: 20),
        pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text('Received From', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
            pw.SizedBox(height: 4),
            pw.Text(f.receivedFrom.isEmpty ? '—' : f.receivedFrom,
                style: pw.TextStyle(font: bold, fontSize: 12)),
            if (f.receivedFromAddress.isNotEmpty)
              pw.Text(f.receivedFromAddress, style: pw.TextStyle(font: reg, fontSize: 10)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('Date: ${f.receiptDate.isEmpty ? "—" : f.receiptDate}',
                style: pw.TextStyle(font: reg, fontSize: 11)),
            pw.Text('Mode: ${f.paymentMode}', style: pw.TextStyle(font: reg, fontSize: 11)),
          ]),
        ]),
        pw.SizedBox(height: 24),
        pw.Container(
          color: const PdfColor(0.941, 0.996, 0.969),
          padding: const pw.EdgeInsets.all(20),
          child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
            pw.Text('Amount Received', style: pw.TextStyle(font: bold, fontSize: 14)),
            pw.Text('₹${fmt.format(amt)}',
                style: pw.TextStyle(font: heading, fontSize: 22, color: accent)),
          ]),
        ),
        pw.SizedBox(height: 16),
        if (f.purpose.isNotEmpty) ...[
          pw.Text('Purpose', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
          pw.SizedBox(height: 4),
          pw.Text(f.purpose, style: pw.TextStyle(font: reg, fontSize: 11)),
          pw.SizedBox(height: 12),
        ],
        if (f.notes.isNotEmpty) ...[
          pw.Text('Notes', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
          pw.SizedBox(height: 4),
          pw.Text(f.notes, style: pw.TextStyle(font: reg, fontSize: 11)),
        ],
        pw.Spacer(),
        pw.Divider(),
        pw.Text('This is a computer-generated receipt.',
            style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.grey500)),
      ],
    ),
  ));
  return doc;
}

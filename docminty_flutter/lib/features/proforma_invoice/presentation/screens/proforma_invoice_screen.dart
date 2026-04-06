import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';
import '../../../quotation/data/models/quotation_form.dart';
import '../../../quotation/presentation/providers/quotation_provider.dart';
import '../../../quotation/pdf/quotation_pdf_generator.dart';

// Proforma Invoice reuses Quotation form/provider but with different labels & doc type.
// We create a separate provider to avoid conflict.
final _piProvider = StateNotifierProvider.autoDispose<QuotationFormNotifier, QuotationForm>(
  (ref) => QuotationFormNotifier(),
);

class ProformaInvoiceScreen extends ConsumerStatefulWidget {
  const ProformaInvoiceScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<ProformaInvoiceScreen> createState() => _State();
}

class _State extends ConsumerState<ProformaInvoiceScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false, _showPreview = false;
  static const _tabs = ['Your Details', 'Client', 'Items', 'Settings'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          ref.read(_piProvider.notifier).load(
              QuotationForm.fromJson(widget.savedDocument!.parsedFormData));
        } catch (_) {}
      });
    }
  }

  @override
  void dispose() { _tab.dispose(); super.dispose(); }

  Future<void> _download() async {
    setState(() => _downloading = true);
    try {
      final form = ref.read(_piProvider);
      await QuotationPdfGenerator.generateAndShare(form);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final f = ref.read(_piProvider);
    final req = SaveDocumentRequest(
      docType: 'proforma-invoice',
      title: 'Proforma Invoice ${f.quoteNumber}',
      templateName: f.templateName,
      referenceNumber: f.quoteNumber,
      partyName: f.toName,
      amount: f.grandTotal,
      formData: f.toJsonString(),
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
        title: Text(widget.savedDocument != null ? 'Edit Proforma Invoice' : 'New Proforma Invoice'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
        actions: [
          IconButton(
            icon: Icon(_showPreview ? Icons.edit_rounded : Icons.remove_red_eye_rounded,
                color: AppColors.textMuted),
            onPressed: () => setState(() => _showPreview = !_showPreview),
            tooltip: _showPreview ? 'Edit' : 'Preview PDF',
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
            children: [
              _PIFromTab(provider: _piProvider),
              _PIToTab(provider: _piProvider),
              _PIItemsTab(provider: _piProvider),
              _PISettingsTab(provider: _piProvider),
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

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async => QuotationPdfGenerator.buildBytes(ref.read(_piProvider)),
      allowPrinting: false,
      allowSharing: false,
      canChangePageFormat: false,
      canChangeOrientation: false,
      canDebug: false,
    );
  }
}

// Helper copy function
QuotationForm _cpQ(QuotationForm f, {
  String? quoteNumber, String? quoteDate, String? validUntil,
  String? fromName, String? fromGstin, String? fromAddress, String? fromCity,
  String? fromState, String? fromPhone, String? fromEmail,
  String? toName, String? toGstin, String? toAddress, String? toCity,
  String? toState, String? toPhone, String? toEmail,
  TaxType? taxType, List<InvoiceItem>? items, String? notes, String? terms,
  bool? showHsn, bool? showDiscount,
  String? advancePercent, String? bankName, String? bankAccountNumber,
  String? bankIfsc, String? bankAccountName,
}) => QuotationForm(
  quoteNumber: quoteNumber ?? f.quoteNumber,
  quoteDate: quoteDate ?? f.quoteDate,
  validUntil: validUntil ?? f.validUntil,
  fromName: fromName ?? f.fromName,
  fromGstin: fromGstin ?? f.fromGstin,
  fromAddress: fromAddress ?? f.fromAddress,
  fromCity: fromCity ?? f.fromCity,
  fromState: fromState ?? f.fromState,
  fromPhone: fromPhone ?? f.fromPhone,
  fromEmail: fromEmail ?? f.fromEmail,
  toName: toName ?? f.toName,
  toGstin: toGstin ?? f.toGstin,
  toAddress: toAddress ?? f.toAddress,
  toCity: toCity ?? f.toCity,
  toState: toState ?? f.toState,
  toPhone: toPhone ?? f.toPhone,
  toEmail: toEmail ?? f.toEmail,
  taxType: taxType ?? f.taxType,
  items: items ?? List<InvoiceItem>.from(f.items),
  notes: notes ?? f.notes,
  terms: terms ?? f.terms,
  showHsn: showHsn ?? f.showHsn,
  showDiscount: showDiscount ?? f.showDiscount,
  templateColor: f.templateColor,
  templateName: f.templateName,
  advancePercent: advancePercent ?? f.advancePercent,
  bankName: bankName ?? f.bankName,
  bankAccountNumber: bankAccountNumber ?? f.bankAccountNumber,
  bankIfsc: bankIfsc ?? f.bankIfsc,
  bankAccountName: bankAccountName ?? f.bankAccountName,
);

class _PIFromTab extends ConsumerWidget {
  const _PIFromTab({required this.provider});
  final AutoDisposeStateNotifierProvider<QuotationFormNotifier, QuotationForm> provider;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(provider.notifier);
    final f = ref.watch(provider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Your Business Details'),
        AppTextField(label: 'Business Name *', hint: 'Your Company',
            initialValue: f.fromName,
            onChanged: (v) => n.update((s) => _cpQ(s, fromName: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'GSTIN', hint: '22AAAAA0000A1Z5',
            initialValue: f.fromGstin, textCapitalization: TextCapitalization.characters,
            onChanged: (v) => n.update((s) => _cpQ(s, fromGstin: v.toUpperCase()))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Street address', initialValue: f.fromAddress,
            maxLines: 2, onChanged: (v) => n.update((s) => _cpQ(s, fromAddress: v))),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'City', hint: 'Mumbai', initialValue: f.fromCity,
              onChanged: (v) => n.update((s) => _cpQ(s, fromCity: v))),
          right: AppTextField(label: 'Phone', hint: '+91 98765 43210',
              initialValue: f.fromPhone, keyboardType: TextInputType.phone,
              onChanged: (v) => n.update((s) => _cpQ(s, fromPhone: v))),
        ),
        const SizedBox(height: AppSpacing.base),
        const AppFormLabel('Invoice Reference'),
        AppFormRow(
          left: AppTextField(label: 'Proforma No.', hint: 'PI-2026-001',
              initialValue: f.quoteNumber,
              onChanged: (v) => n.update((s) => _cpQ(s, quoteNumber: v))),
          right: AppTextField(label: 'Date', hint: 'DD/MM/YYYY',
              initialValue: f.quoteDate,
              onChanged: (v) => n.update((s) => _cpQ(s, quoteDate: v))),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Valid Until', hint: 'DD/MM/YYYY',
            initialValue: f.validUntil,
            onChanged: (v) => n.update((s) => _cpQ(s, validUntil: v))),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _PIToTab extends ConsumerWidget {
  const _PIToTab({required this.provider});
  final AutoDisposeStateNotifierProvider<QuotationFormNotifier, QuotationForm> provider;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(provider.notifier);
    final f = ref.watch(provider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Client Details'),
        AppTextField(label: 'Client Name *', hint: 'ABC Pvt Ltd',
            initialValue: f.toName, onChanged: (v) => n.update((s) => _cpQ(s, toName: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'GSTIN', hint: '22AAAAA0000A1Z5',
            initialValue: f.toGstin, textCapitalization: TextCapitalization.characters,
            onChanged: (v) => n.update((s) => _cpQ(s, toGstin: v.toUpperCase()))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', initialValue: f.toAddress, maxLines: 2,
            onChanged: (v) => n.update((s) => _cpQ(s, toAddress: v))),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'City', initialValue: f.toCity,
              onChanged: (v) => n.update((s) => _cpQ(s, toCity: v))),
          right: AppTextField(label: 'Phone', initialValue: f.toPhone,
              keyboardType: TextInputType.phone,
              onChanged: (v) => n.update((s) => _cpQ(s, toPhone: v))),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _PIItemsTab extends ConsumerWidget {
  const _PIItemsTab({required this.provider});
  final AutoDisposeStateNotifierProvider<QuotationFormNotifier, QuotationForm> provider;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(provider.notifier);
    final f = ref.watch(provider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        ...f.items.asMap().entries.map((e) {
          final i = e.key; final item = e.value;
          return AppCard(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text('Item ${i + 1}', style: AppTextStyles.label),
                if (f.items.length > 1)
                  IconButton(
                    icon: const Icon(Icons.delete_outline_rounded, color: AppColors.error, size: 18),
                    onPressed: () => n.removeItem(i),
                    padding: EdgeInsets.zero, constraints: const BoxConstraints(),
                  ),
              ]),
              const SizedBox(height: 8),
              AppTextField(label: 'Description *', hint: 'Product or service',
                  initialValue: item.description,
                  onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(description: v, hsn: x.hsn, qty: x.qty, rate: x.rate, discount: x.discount, gstRate: x.gstRate))),
              const SizedBox(height: 8),
              AppFormRow(
                left: AppTextField(label: 'Qty', hint: '1', initialValue: item.qty,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(description: x.description, hsn: x.hsn, qty: v, rate: x.rate, discount: x.discount, gstRate: x.gstRate))),
                right: AppTextField(label: 'Rate (₹)', hint: '0.00', initialValue: item.rate,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(description: x.description, hsn: x.hsn, qty: x.qty, rate: v, discount: x.discount, gstRate: x.gstRate))),
              ),
            ]),
          );
        }),
        AppButton(label: '+ Add Item', variant: AppButtonVariant.outline,
            onPressed: n.addItem, width: double.infinity),
        const SizedBox(height: 12),
        AppCard(padding: const EdgeInsets.all(AppSpacing.base), child: Column(children: [
          _trow('Subtotal', '₹${f.subtotal.toStringAsFixed(2)}'),
          if (f.taxType == TaxType.cgstSgst) ...[
            _trow('CGST', '₹${f.cgst.toStringAsFixed(2)}'),
            _trow('SGST', '₹${f.sgst.toStringAsFixed(2)}'),
          ] else if (f.taxType == TaxType.igst)
            _trow('IGST', '₹${f.igst.toStringAsFixed(2)}'),
          const Divider(),
          _trow('Grand Total', '₹${f.grandTotal.toStringAsFixed(2)}', bold: true),
        ])),
        const SizedBox(height: 80),
      ]),
    );
  }
  Widget _trow(String l, String v, {bool bold = false}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(l, style: bold ? AppTextStyles.body.copyWith(fontWeight: FontWeight.w700) : AppTextStyles.body),
      Text(v, style: bold
          ? AppTextStyles.body.copyWith(fontWeight: FontWeight.w800, color: AppColors.secondary)
          : AppTextStyles.body),
    ]),
  );
}

class _PISettingsTab extends ConsumerWidget {
  const _PISettingsTab({required this.provider});
  final AutoDisposeStateNotifierProvider<QuotationFormNotifier, QuotationForm> provider;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(provider.notifier);
    final f = ref.watch(provider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Advance'),
        AppTextField(label: 'Advance Required (%)', hint: 'e.g. 50',
            initialValue: f.advancePercent,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) => n.update((s) => _cpQ(s, advancePercent: v))),
        const SizedBox(height: AppSpacing.base),
        const AppFormLabel('Tax Type'),
        Row(children: TaxType.values.map((t) {
          final label = switch (t) {
            TaxType.cgstSgst => 'CGST+SGST',
            TaxType.igst => 'IGST',
            TaxType.none => 'No GST',
          };
          final sel = f.taxType == t;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => n.update((s) => _cpQ(s, taxType: t)),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: sel ? AppColors.secondary : AppColors.bgCard,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  border: Border.all(color: sel ? AppColors.secondary : AppColors.border),
                ),
                child: Text(label, style: TextStyle(fontFamily: 'Inter', fontSize: 12,
                    fontWeight: FontWeight.w600, color: sel ? Colors.white : AppColors.textMuted)),
              ),
            ),
          );
        }).toList()),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Notes', hint: 'Additional notes',
            initialValue: f.notes, maxLines: 3,
            onChanged: (v) => n.update((s) => _cpQ(s, notes: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Terms & Conditions', hint: 'Your terms',
            initialValue: f.terms, maxLines: 3,
            onChanged: (v) => n.update((s) => _cpQ(s, terms: v))),
        const SizedBox(height: AppSpacing.base),
        const AppFormLabel('Bank Details (for payment)'),
        AppTextField(label: 'Bank Name', hint: 'HDFC Bank',
            initialValue: f.bankName,
            onChanged: (v) => n.update((s) => _cpQ(s, bankName: v))),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Account Name', hint: 'Your Business Name',
            initialValue: f.bankAccountName,
            onChanged: (v) => n.update((s) => _cpQ(s, bankAccountName: v))),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Account Number', hint: '1234567890',
              initialValue: f.bankAccountNumber,
              onChanged: (v) => n.update((s) => _cpQ(s, bankAccountNumber: v))),
          right: AppTextField(label: 'IFSC Code', hint: 'HDFC0001234',
              initialValue: f.bankIfsc, textCapitalization: TextCapitalization.characters,
              onChanged: (v) => n.update((s) => _cpQ(s, bankIfsc: v.toUpperCase()))),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

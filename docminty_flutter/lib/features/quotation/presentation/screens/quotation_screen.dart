import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/indian_states.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';
import '../../../invoice/data/models/invoice_form.dart';
import '../../data/models/quotation_form.dart';
import '../providers/quotation_provider.dart';
import '../../pdf/quotation_pdf_generator.dart';

class QuotationScreen extends ConsumerStatefulWidget {
  const QuotationScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;

  @override
  ConsumerState<QuotationScreen> createState() => _QuotationScreenState();
}

class _QuotationScreenState extends ConsumerState<QuotationScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _saving = false;
  bool _downloading = false;

  static const _tabs = ['Your Details', 'Client', 'Items', 'Settings'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          final form = QuotationForm.fromJson(widget.savedDocument!.parsedFormData);
          ref.read(quotationFormProvider.notifier).load(form);
        } catch (_) {}
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _downloadPdf() async {
    setState(() => _downloading = true);
    try {
      await QuotationPdfGenerator.generateAndShare(ref.read(quotationFormProvider));
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('PDF error: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  Future<void> _saveDocument() async {
    setState(() => _saving = true);
    final form = ref.read(quotationFormProvider);
    final req = SaveDocumentRequest(
      docType: 'quotation',
      title: 'Quotation ${form.quoteNumber}',
      templateName: form.templateName,
      referenceNumber: form.quoteNumber,
      partyName: form.toName,
      amount: form.grandTotal,
      formData: form.toJsonString(),
    );
    final bool ok;
    if (widget.savedDocument != null) {
      ok = await ref.read(documentsProvider.notifier).updateDoc(widget.savedDocument!.id, req);
    } else {
      ok = await ref.read(documentsProvider.notifier).save(req);
    }
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Quotation saved!' : 'Failed to save.'),
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
        title: Text(widget.savedDocument != null ? 'Edit Quotation' : 'New Quotation'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: _saving
                ? const SizedBox(
                    width: 18, height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.secondary))
                : const Icon(Icons.cloud_upload_rounded, color: AppColors.secondary),
            tooltip: 'Save',
            onPressed: _saving ? null : _saveDocument,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          Container(
            color: AppColors.bgCard,
            child: TabBar(
              controller: _tabController,
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
              controller: _tabController,
              children: [
                _YourDetailsTab(key: const ValueKey('qfrom')),
                _ClientTab(key: const ValueKey('qto')),
                _ItemsTab(key: const ValueKey('qitems')),
                _SettingsTab(key: const ValueKey('qsettings')),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _downloading ? null : _downloadPdf,
        backgroundColor: AppColors.secondary,
        icon: _downloading
            ? const SizedBox(width: 18, height: 18,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
            : const Icon(Icons.download_rounded, color: Colors.white),
        label: Text(
          _downloading ? 'Generating...' : 'Download PDF',
          style: const TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.w700, color: Colors.white),
        ),
      ),
    );
  }
}

// ─── Your Details ─────────────────────────────────────────────────────────────
class _YourDetailsTab extends ConsumerWidget {
  const _YourDetailsTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(quotationFormProvider.notifier);
    final f = ref.watch(quotationFormProvider);
    return _scroll([
      const AppFormLabel('Your Business Details'),
      AppTextField(label: 'Business Name *', hint: 'Your Company Name',
          initialValue: f.fromName, onChanged: (v) => n.update((s) => _cp(s, fromName: v))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'GSTIN', hint: '22AAAAA0000A1Z5',
          initialValue: f.fromGstin, textCapitalization: TextCapitalization.characters,
          onChanged: (v) => n.update((s) => _cp(s, fromGstin: v.toUpperCase()))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'Address', hint: 'Street address', initialValue: f.fromAddress,
          maxLines: 2, onChanged: (v) => n.update((s) => _cp(s, fromAddress: v))),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'City', hint: 'Mumbai', initialValue: f.fromCity,
            onChanged: (v) => n.update((s) => _cp(s, fromCity: v))),
        right: _StateDropdown(value: f.fromState,
            onChanged: (v) => n.update((s) => _cp(s, fromState: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Phone', hint: '+91 98765 43210',
            initialValue: f.fromPhone, keyboardType: TextInputType.phone,
            onChanged: (v) => n.update((s) => _cp(s, fromPhone: v))),
        right: AppTextField(label: 'Email', hint: 'you@company.com',
            initialValue: f.fromEmail, keyboardType: TextInputType.emailAddress,
            onChanged: (v) => n.update((s) => _cp(s, fromEmail: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      const AppFormLabel('Quote Details'),
      AppFormRow(
        left: AppTextField(label: 'Quote Number', hint: 'QUO-2026-001',
            initialValue: f.quoteNumber,
            onChanged: (v) => n.update((s) => _cp(s, quoteNumber: v))),
        right: AppTextField(label: 'Quote Date', hint: 'DD/MM/YYYY',
            initialValue: f.quoteDate,
            onChanged: (v) => n.update((s) => _cp(s, quoteDate: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'Valid Until', hint: 'DD/MM/YYYY',
          initialValue: f.validUntil,
          onChanged: (v) => n.update((s) => _cp(s, validUntil: v))),
      const SizedBox(height: 80),
    ]);
  }
}

// ─── Client ───────────────────────────────────────────────────────────────────
class _ClientTab extends ConsumerWidget {
  const _ClientTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(quotationFormProvider.notifier);
    final f = ref.watch(quotationFormProvider);
    return _scroll([
      const AppFormLabel('Client Details'),
      AppTextField(label: 'Client Name *', hint: 'ABC Pvt Ltd',
          initialValue: f.toName, onChanged: (v) => n.update((s) => _cp(s, toName: v))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'GSTIN', hint: '22AAAAA0000A1Z5',
          initialValue: f.toGstin, textCapitalization: TextCapitalization.characters,
          onChanged: (v) => n.update((s) => _cp(s, toGstin: v.toUpperCase()))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'Address', hint: 'Street address', initialValue: f.toAddress,
          maxLines: 2, onChanged: (v) => n.update((s) => _cp(s, toAddress: v))),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'City', hint: 'Delhi', initialValue: f.toCity,
            onChanged: (v) => n.update((s) => _cp(s, toCity: v))),
        right: _StateDropdown(value: f.toState,
            onChanged: (v) => n.update((s) => _cp(s, toState: v))),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(label: 'Phone', hint: '+91 98765 43210',
            initialValue: f.toPhone, keyboardType: TextInputType.phone,
            onChanged: (v) => n.update((s) => _cp(s, toPhone: v))),
        right: AppTextField(label: 'Email', hint: 'client@company.com',
            initialValue: f.toEmail, keyboardType: TextInputType.emailAddress,
            onChanged: (v) => n.update((s) => _cp(s, toEmail: v))),
      ),
      const SizedBox(height: 80),
    ]);
  }
}

// ─── Items ────────────────────────────────────────────────────────────────────
class _ItemsTab extends ConsumerWidget {
  const _ItemsTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(quotationFormProvider.notifier);
    final f = ref.watch(quotationFormProvider);
    return _scroll([
      ...f.items.asMap().entries.map((e) {
        final i = e.key;
        final item = e.value;
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
                onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(
                    description: v, hsn: x.hsn, qty: x.qty, rate: x.rate,
                    discount: x.discount, gstRate: x.gstRate))),
            const SizedBox(height: 8),
            AppFormRow(
              left: AppTextField(label: 'Qty', hint: '1', initialValue: item.qty,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(
                      description: x.description, hsn: x.hsn, qty: v, rate: x.rate,
                      discount: x.discount, gstRate: x.gstRate))),
              right: AppTextField(label: 'Rate (₹)', hint: '0.00', initialValue: item.rate,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(
                      description: x.description, hsn: x.hsn, qty: x.qty, rate: v,
                      discount: x.discount, gstRate: x.gstRate))),
            ),
            const SizedBox(height: 8),
            AppFormRow(
              left: AppTextField(label: 'GST %', hint: '18', initialValue: item.gstRate,
                  keyboardType: TextInputType.number,
                  onChanged: (v) => n.updateItem(i, (x) => InvoiceItem(
                      description: x.description, hsn: x.hsn, qty: x.qty, rate: x.rate,
                      discount: x.discount, gstRate: v))),
              right: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.secondaryLight,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Amount', style: AppTextStyles.caption),
                  Text('₹${item.totalAmount.toStringAsFixed(2)}',
                      style: AppTextStyles.body.copyWith(
                          fontWeight: FontWeight.w700, color: AppColors.secondary)),
                ]),
              ),
            ),
          ]),
        );
      }),
      AppButton(
        label: '+ Add Item',
        variant: AppButtonVariant.outline,
        onPressed: n.addItem,
        width: double.infinity,
      ),
      const SizedBox(height: 16),
      AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(children: [
          _totalRow('Subtotal', '₹${f.subtotal.toStringAsFixed(2)}'),
          if (f.taxType == TaxType.cgstSgst) ...[
            _totalRow('CGST', '₹${f.cgst.toStringAsFixed(2)}'),
            _totalRow('SGST', '₹${f.sgst.toStringAsFixed(2)}'),
          ] else if (f.taxType == TaxType.igst)
            _totalRow('IGST', '₹${f.igst.toStringAsFixed(2)}'),
          const Divider(),
          _totalRow('Grand Total', '₹${f.grandTotal.toStringAsFixed(2)}', bold: true),
        ]),
      ),
      const SizedBox(height: 80),
    ]);
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
class _SettingsTab extends ConsumerWidget {
  const _SettingsTab({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(quotationFormProvider.notifier);
    final f = ref.watch(quotationFormProvider);
    return _scroll([
      const AppFormLabel('Tax Settings'),
      _TaxTypeRow(
        value: f.taxType,
        onChanged: (v) => n.update((s) => _cp(s, taxType: v)),
      ),
      const SizedBox(height: AppSpacing.base),
      const AppFormLabel('Display Options'),
      SwitchListTile(
        title: const Text('Show HSN Code', style: TextStyle(fontFamily: 'Inter', fontSize: 14)),
        value: f.showHsn,
        onChanged: (v) => n.update((s) => _cp(s, showHsn: v)),
        activeColor: AppColors.secondary,
        contentPadding: EdgeInsets.zero,
      ),
      SwitchListTile(
        title: const Text('Show Discount', style: TextStyle(fontFamily: 'Inter', fontSize: 14)),
        value: f.showDiscount,
        onChanged: (v) => n.update((s) => _cp(s, showDiscount: v)),
        activeColor: AppColors.secondary,
        contentPadding: EdgeInsets.zero,
      ),
      const SizedBox(height: AppSpacing.base),
      const AppFormLabel('Notes'),
      AppTextField(label: 'Notes', hint: 'Any additional information',
          initialValue: f.notes, maxLines: 3,
          onChanged: (v) => n.update((s) => _cp(s, notes: v))),
      const SizedBox(height: AppSpacing.base),
      AppTextField(label: 'Terms & Conditions', hint: 'Your terms',
          initialValue: f.terms, maxLines: 3,
          onChanged: (v) => n.update((s) => _cp(s, terms: v))),
      const SizedBox(height: 80),
    ]);
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
Widget _scroll(List<Widget> children) => SingleChildScrollView(
    padding: const EdgeInsets.all(AppSpacing.base),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children));

Widget _totalRow(String label, String value, {bool bold = false}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: bold ? AppTextStyles.body.copyWith(fontWeight: FontWeight.w700) : AppTextStyles.body),
      Text(value, style: bold
          ? AppTextStyles.body.copyWith(fontWeight: FontWeight.w800, color: AppColors.secondary)
          : AppTextStyles.body),
    ]));

class _StateDropdown extends ConsumerWidget {
  const _StateDropdown({required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final states = IndianStates.all;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('State', style: AppTextStyles.label),
      const SizedBox(height: 4),
      DropdownButtonFormField<String>(
        value: states.any((s) => s['code'] == value) ? value : null,
        decoration: InputDecoration(
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            borderSide: const BorderSide(color: AppColors.border),
          ),
        ),
        isExpanded: true,
        items: states
            .map((s) => DropdownMenuItem(value: s['code'], child: Text(s['name'] ?? '', style: const TextStyle(fontFamily: 'Inter', fontSize: 13))))
            .toList(),
        onChanged: (v) { if (v != null) onChanged(v); },
      ),
    ]);
  }
}

class _TaxTypeRow extends StatelessWidget {
  const _TaxTypeRow({required this.value, required this.onChanged});
  final TaxType value;
  final ValueChanged<TaxType> onChanged;
  @override
  Widget build(BuildContext context) => Row(children: [
    _chip('CGST + SGST', TaxType.cgstSgst, value, onChanged),
    const SizedBox(width: 8),
    _chip('IGST', TaxType.igst, value, onChanged),
    const SizedBox(width: 8),
    _chip('No GST', TaxType.none, value, onChanged),
  ]);
  Widget _chip(String label, TaxType type, TaxType current, ValueChanged<TaxType> cb) {
    final sel = type == current;
    return GestureDetector(
      onTap: () => cb(type),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: sel ? AppColors.secondary : AppColors.bgCard,
          borderRadius: BorderRadius.circular(AppRadius.full),
          border: Border.all(color: sel ? AppColors.secondary : AppColors.border),
        ),
        child: Text(label, style: TextStyle(
            fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w600,
            color: sel ? Colors.white : AppColors.textMuted)),
      ),
    );
  }
}

// Immutable copy helper for QuotationForm
QuotationForm _cp(QuotationForm f, {
  String? quoteNumber, String? quoteDate, String? validUntil,
  String? fromName, String? fromGstin, String? fromAddress,
  String? fromCity, String? fromState, String? fromPhone, String? fromEmail,
  String? toName, String? toGstin, String? toAddress,
  String? toCity, String? toState, String? toPhone, String? toEmail,
  TaxType? taxType, List<InvoiceItem>? items, String? notes, String? terms,
  bool? showHsn, bool? showDiscount, String? templateColor, String? templateName,
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
  templateColor: templateColor ?? f.templateColor,
  templateName: templateName ?? f.templateName,
);

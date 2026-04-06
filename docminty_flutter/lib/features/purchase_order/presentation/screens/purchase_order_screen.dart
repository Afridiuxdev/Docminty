import 'dart:convert';
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

class _Item {
  String description = '', qty = '1', unit = '', rate = '0', amount = '0';
  Map<String, dynamic> toJson() =>
      {'description': description, 'qty': qty, 'unit': unit, 'rate': rate};
  static _Item fromJson(Map<String, dynamic> j) {
    final i = _Item();
    i.description = j['description'] as String? ?? '';
    i.qty = j['qty'] as String? ?? '1';
    i.unit = j['unit'] as String? ?? '';
    i.rate = j['rate'] as String? ?? '0';
    return i;
  }
  double get total => (double.tryParse(qty) ?? 0) * (double.tryParse(rate) ?? 0);
  _Item copy() { final r = _Item(); r.description = description; r.qty = qty; r.unit = unit; r.rate = rate; return r; }
}

class _Form {
  String poNumber = 'PO-2026-001', poDate = '', deliveryDate = '';
  String fromName = '', fromAddress = '', fromGstin = '', fromPhone = '', fromEmail = '';
  String vendorName = '', vendorAddress = '', vendorGstin = '';
  String deliveryAddress = '', paymentTerms = '', shippingTerms = '';
  String terms = '', notes = '';
  bool showHSN = false;
  List<_Item> items = [_Item()];

  double get grandTotal => items.fold(0, (s, i) => s + i.total);

  Map<String, dynamic> toJson() => {
    'poNumber': poNumber, 'poDate': poDate, 'deliveryDate': deliveryDate,
    'fromName': fromName, 'fromAddress': fromAddress, 'fromGstin': fromGstin,
    'fromPhone': fromPhone, 'fromEmail': fromEmail,
    'vendorName': vendorName, 'vendorAddress': vendorAddress, 'vendorGstin': vendorGstin,
    'deliveryAddress': deliveryAddress, 'paymentTerms': paymentTerms,
    'shippingTerms': shippingTerms, 'showHSN': showHSN,
    'terms': terms, 'notes': notes,
    'items': items.map((i) => i.toJson()).toList(),
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.poNumber = j['poNumber'] as String? ?? 'PO-2026-001';
    f.poDate = j['poDate'] as String? ?? '';
    f.deliveryDate = j['deliveryDate'] as String? ?? '';
    f.fromName = j['fromName'] as String? ?? '';
    f.fromAddress = j['fromAddress'] as String? ?? '';
    f.fromGstin = j['fromGstin'] as String? ?? '';
    f.fromPhone = j['fromPhone'] as String? ?? '';
    f.fromEmail = j['fromEmail'] as String? ?? '';
    f.vendorName = j['vendorName'] as String? ?? '';
    f.vendorAddress = j['vendorAddress'] as String? ?? '';
    f.vendorGstin = j['vendorGstin'] as String? ?? '';
    f.deliveryAddress = j['deliveryAddress'] as String? ?? '';
    f.paymentTerms = j['paymentTerms'] as String? ?? '';
    f.shippingTerms = j['shippingTerms'] as String? ?? '';
    f.showHSN = j['showHSN'] as bool? ?? false;
    f.terms = j['terms'] as String? ?? '';
    f.notes = j['notes'] as String? ?? '';
    if (j['items'] != null) {
      f.items = (j['items'] as List).map((i) => _Item.fromJson(i as Map<String, dynamic>)).toList();
    }
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.poNumber = poNumber; r.poDate = poDate; r.deliveryDate = deliveryDate;
    r.fromName = fromName; r.fromAddress = fromAddress; r.fromGstin = fromGstin;
    r.fromPhone = fromPhone; r.fromEmail = fromEmail;
    r.vendorName = vendorName; r.vendorAddress = vendorAddress; r.vendorGstin = vendorGstin;
    r.deliveryAddress = deliveryAddress; r.paymentTerms = paymentTerms;
    r.shippingTerms = shippingTerms; r.showHSN = showHSN;
    r.terms = terms; r.notes = notes;
    r.items = items.map((i) => i.copy()).toList();
    return r;
  }
}

final _poProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

void _set(WidgetRef ref, String k, String v) => ref.read(_poProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'poNumber': r.poNumber = v;
    case 'poDate': r.poDate = v;
    case 'deliveryDate': r.deliveryDate = v;
    case 'fromName': r.fromName = v;
    case 'fromAddress': r.fromAddress = v;
    case 'fromGstin': r.fromGstin = v;
    case 'fromPhone': r.fromPhone = v;
    case 'fromEmail': r.fromEmail = v;
    case 'vendorName': r.vendorName = v;
    case 'vendorAddress': r.vendorAddress = v;
    case 'vendorGstin': r.vendorGstin = v;
    case 'deliveryAddress': r.deliveryAddress = v;
    case 'paymentTerms': r.paymentTerms = v;
    case 'shippingTerms': r.shippingTerms = v;
    case 'terms': r.terms = v;
    case 'notes': r.notes = v;
  }
  return r;
});

class PurchaseOrderScreen extends ConsumerStatefulWidget {
  const PurchaseOrderScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<PurchaseOrderScreen> createState() => _State();
}

class _State extends ConsumerState<PurchaseOrderScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Your Details', 'Vendor', 'Items', 'Settings'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try { ref.read(_poProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData)); }
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
      final pdf = await _buildPdf(ref.read(_poProvider));
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'PO_${ref.read(_poProvider).poNumber}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_poProvider));
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
    final f = ref.read(_poProvider);
    final req = SaveDocumentRequest(
      docType: 'purchase-order',
      title: 'PO ${f.poNumber}',
      templateName: 'Classic',
      referenceNumber: f.poNumber,
      partyName: f.vendorName,
      amount: f.grandTotal,
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
        title: Text(widget.savedDocument != null ? 'Edit Purchase Order' : 'New Purchase Order'),
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
            children: const [_YourDetailsTab(), _VendorTab(), _ItemsTab(), _SettingsTab()],
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

class _YourDetailsTab extends ConsumerWidget {
  const _YourDetailsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_poProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Your Details'),
        AppTextField(label: 'Company Name *', hint: 'Your Company',
            initialValue: f.fromName, onChanged: (v) => _set(ref, 'fromName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Office address', initialValue: f.fromAddress,
            maxLines: 2, onChanged: (v) => _set(ref, 'fromAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'GSTIN', hint: '22AAAAA0000A1Z5',
              initialValue: f.fromGstin, textCapitalization: TextCapitalization.characters,
              onChanged: (v) => _set(ref, 'fromGstin', v.toUpperCase())),
          right: AppTextField(label: 'Phone', hint: '+91 98765 43210',
              initialValue: f.fromPhone, keyboardType: TextInputType.phone,
              onChanged: (v) => _set(ref, 'fromPhone', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _VendorTab extends ConsumerWidget {
  const _VendorTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_poProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Vendor / Supplier'),
        AppTextField(label: 'Vendor Name *', hint: 'Supplier Co.',
            initialValue: f.vendorName, onChanged: (v) => _set(ref, 'vendorName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', hint: 'Vendor address', initialValue: f.vendorAddress,
            maxLines: 2, onChanged: (v) => _set(ref, 'vendorAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Vendor GSTIN', hint: '22AAAAA0000A1Z5',
            initialValue: f.vendorGstin, textCapitalization: TextCapitalization.characters,
            onChanged: (v) => _set(ref, 'vendorGstin', v.toUpperCase())),
        const SizedBox(height: AppSpacing.lg),
        const AppFormLabel('PO Details'),
        AppFormRow(
          left: AppTextField(label: 'PO Number', hint: 'PO-2026-001',
              initialValue: f.poNumber, onChanged: (v) => _set(ref, 'poNumber', v)),
          right: AppTextField(label: 'PO Date', hint: 'DD/MM/YYYY',
              initialValue: f.poDate, onChanged: (v) => _set(ref, 'poDate', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Delivery Date', hint: 'DD/MM/YYYY',
              initialValue: f.deliveryDate, onChanged: (v) => _set(ref, 'deliveryDate', v)),
          right: AppTextField(label: 'Delivery Address', hint: 'Ship to address',
              initialValue: f.deliveryAddress, onChanged: (v) => _set(ref, 'deliveryAddress', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ItemsTab extends ConsumerWidget {
  const _ItemsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_poProvider);
    final n = ref.read(_poProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Items'),
        ...f.items.asMap().entries.map((e) {
          final i = e.key;
          final item = e.value;
          return AppCard(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text('Item ${i + 1}', style: AppTextStyles.label),
                if (f.items.length > 1)
                  IconButton(
                    icon: const Icon(Icons.delete_outline_rounded, color: AppColors.error, size: 18),
                    padding: EdgeInsets.zero, constraints: const BoxConstraints(),
                    onPressed: () => n.up((s) { final r = s.copy(); r.items.removeAt(i); return r; }),
                  ),
              ]),
              const SizedBox(height: 6),
              AppTextField(label: 'Description', hint: 'Item description',
                  initialValue: item.description,
                  onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].description = v; return r; })),
              const SizedBox(height: 6),
              AppFormRow(
                left: AppTextField(label: 'Qty', hint: '1', initialValue: item.qty,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].qty = v; return r; })),
                right: AppTextField(label: 'Unit', hint: 'pcs / kg / box',
                    initialValue: item.unit,
                    onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].unit = v; return r; })),
              ),
              const SizedBox(height: 6),
              AppTextField(label: 'Rate (₹)', hint: '0.00', initialValue: item.rate,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].rate = v; return r; })),
            ]),
          );
        }),
        AppButton(
          label: '+ Add Item',
          variant: AppButtonVariant.outline,
          onPressed: () => n.up((s) { final r = s.copy(); r.items.add(_Item()); return r; }),
          width: double.infinity,
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _SettingsTab extends ConsumerWidget {
  const _SettingsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_poProvider);
    final n = ref.read(_poProvider.notifier);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Settings'),
        AppCard(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 10),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Show HSN Code', style: AppTextStyles.body),
            Switch(
              value: f.showHSN,
              activeColor: AppColors.secondary,
              onChanged: (v) => n.up((s) { final r = s.copy(); r.showHSN = v; return r; }),
            ),
          ]),
        ),
        const SizedBox(height: AppSpacing.lg),
        const AppFormLabel('Terms & Notes'),
        AppTextField(label: 'Payment Terms', hint: 'e.g. Net 30, 50% advance',
            initialValue: f.paymentTerms, maxLines: 2,
            onChanged: (v) => _set(ref, 'paymentTerms', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Shipping Terms', hint: 'e.g. FOB, CIF, ex-warehouse',
            initialValue: f.shippingTerms, maxLines: 2,
            onChanged: (v) => _set(ref, 'shippingTerms', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Terms & Conditions', hint: 'Other terms',
            initialValue: f.terms, maxLines: 2,
            onChanged: (v) => _set(ref, 'terms', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Notes', hint: 'Additional notes',
            initialValue: f.notes, maxLines: 2,
            onChanged: (v) => _set(ref, 'notes', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Purchase Order');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.231, 0.51, 0.965); // blue
  final fmt = NumberFormat('#,##,##0.00', 'en_IN');

  doc.addPage(pw.MultiPage(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(36),
    build: (ctx) => [
      pw.Container(
        color: accent,
        padding: const pw.EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text(f.fromName.isEmpty ? 'Company Name' : f.fromName,
                style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColors.white)),
            if (f.fromGstin.isNotEmpty)
              pw.Text('GSTIN: ${f.fromGstin}', style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.white)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('PURCHASE ORDER', style: pw.TextStyle(font: heading, fontSize: 18, color: PdfColors.white)),
            pw.Text('# ${f.poNumber}', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.white)),
          ]),
        ]),
      ),
      pw.SizedBox(height: 16),
      pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('Vendor', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
          pw.Text(f.vendorName.isEmpty ? '—' : f.vendorName, style: pw.TextStyle(font: bold, fontSize: 12)),
          if (f.vendorAddress.isNotEmpty)
            pw.Text(f.vendorAddress, style: pw.TextStyle(font: reg, fontSize: 10)),
          if (f.vendorGstin.isNotEmpty)
            pw.Text('GSTIN: ${f.vendorGstin}', style: pw.TextStyle(font: reg, fontSize: 10)),
        ]),
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
          pw.Text('PO Date: ${f.poDate.isEmpty ? "—" : f.poDate}', style: pw.TextStyle(font: reg, fontSize: 11)),
          pw.Text('Delivery: ${f.deliveryDate.isEmpty ? "—" : f.deliveryDate}', style: pw.TextStyle(font: reg, fontSize: 11)),
        ]),
      ]),
      pw.SizedBox(height: 16),
      if (f.deliveryAddress.isNotEmpty) ...[
        pw.Text('Ship To:', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
        pw.Text(f.deliveryAddress, style: pw.TextStyle(font: reg, fontSize: 10)),
        pw.SizedBox(height: 10),
      ],
      pw.Table(
        border: pw.TableBorder.all(color: PdfColors.grey300),
        children: [
          pw.TableRow(
            decoration: pw.BoxDecoration(color: accent),
            children: [
              if (f.showHSN) 'HSN',
              '#', 'Description', 'Unit', 'Qty', 'Rate', 'Amount',
            ].map((h) => pw.Padding(padding: const pw.EdgeInsets.all(6),
                child: pw.Text(h, style: pw.TextStyle(font: bold, fontSize: 9, color: PdfColors.white)))).toList(),
          ),
          ...f.items.asMap().entries.map((e) {
            final item = e.value;
            return pw.TableRow(
              decoration: pw.BoxDecoration(color: e.key.isEven ? PdfColors.white : PdfColors.grey50),
              children: [
                if (f.showHSN) '',
                '${e.key + 1}', item.description, item.unit, item.qty,
                '₹${fmt.format(double.tryParse(item.rate) ?? 0)}',
                '₹${fmt.format(item.total)}',
              ].map((c) => pw.Padding(padding: const pw.EdgeInsets.all(5),
                  child: pw.Text(c, style: pw.TextStyle(font: reg, fontSize: 9)))).toList(),
            );
          }),
        ],
      ),
      pw.SizedBox(height: 8),
      pw.Align(alignment: pw.Alignment.centerRight,
          child: pw.Text('Grand Total: ₹${fmt.format(f.grandTotal)}',
              style: pw.TextStyle(font: bold, fontSize: 13))),
      if (f.paymentTerms.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text('Payment Terms:', style: pw.TextStyle(font: bold, fontSize: 10)),
        pw.Text(f.paymentTerms, style: pw.TextStyle(font: reg, fontSize: 10)),
      ],
      if (f.shippingTerms.isNotEmpty) ...[
        pw.SizedBox(height: 8),
        pw.Text('Shipping Terms:', style: pw.TextStyle(font: bold, fontSize: 10)),
        pw.Text(f.shippingTerms, style: pw.TextStyle(font: reg, fontSize: 10)),
      ],
      if (f.terms.isNotEmpty) ...[
        pw.SizedBox(height: 8),
        pw.Text('Terms & Conditions:', style: pw.TextStyle(font: bold, fontSize: 10)),
        pw.Text(f.terms, style: pw.TextStyle(font: reg, fontSize: 10)),
      ],
      if (f.notes.isNotEmpty) ...[
        pw.SizedBox(height: 8),
        pw.Text('Notes:', style: pw.TextStyle(font: bold, fontSize: 10)),
        pw.Text(f.notes, style: pw.TextStyle(font: reg, fontSize: 10)),
      ],
    ],
  ));
  return doc;
}

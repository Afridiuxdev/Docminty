import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';

class _PackItem {
  String description = '', qty = '1', unit = 'pcs', weight = '';
  Map<String, dynamic> toJson() =>
      {'description': description, 'qty': qty, 'unit': unit, 'weight': weight};
  static _PackItem fromJson(Map<String, dynamic> j) {
    final i = _PackItem();
    i.description = j['description'] as String? ?? '';
    i.qty = j['qty'] as String? ?? '1';
    i.unit = j['unit'] as String? ?? 'pcs';
    i.weight = j['weight'] as String? ?? '';
    return i;
  }
  _PackItem copy() { final r = _PackItem(); r.description = description; r.qty = qty; r.unit = unit; r.weight = weight; return r; }
}

class _Form {
  String shipmentNumber = 'SHIP-2026-001', shipDate = '';
  String fromName = '', fromAddress = '', fromCity = '', fromPhone = '';
  String toName = '', toAddress = '', toCity = '', toPhone = '';
  String carrier = '', trackingNumber = '', notes = '';
  List<_PackItem> items = [_PackItem()];

  Map<String, dynamic> toJson() => {
    'shipmentNumber': shipmentNumber, 'shipDate': shipDate,
    'fromName': fromName, 'fromAddress': fromAddress, 'fromCity': fromCity, 'fromPhone': fromPhone,
    'toName': toName, 'toAddress': toAddress, 'toCity': toCity, 'toPhone': toPhone,
    'carrier': carrier, 'trackingNumber': trackingNumber, 'notes': notes,
    'items': items.map((i) => i.toJson()).toList(),
  };

  static _Form fromJson(Map<String, dynamic> j) {
    final f = _Form();
    f.shipmentNumber = j['shipmentNumber'] as String? ?? 'SHIP-2026-001';
    f.shipDate = j['shipDate'] as String? ?? '';
    f.fromName = j['fromName'] as String? ?? '';
    f.fromAddress = j['fromAddress'] as String? ?? '';
    f.fromCity = j['fromCity'] as String? ?? '';
    f.fromPhone = j['fromPhone'] as String? ?? '';
    f.toName = j['toName'] as String? ?? '';
    f.toAddress = j['toAddress'] as String? ?? '';
    f.toCity = j['toCity'] as String? ?? '';
    f.toPhone = j['toPhone'] as String? ?? '';
    f.carrier = j['carrier'] as String? ?? '';
    f.trackingNumber = j['trackingNumber'] as String? ?? '';
    f.notes = j['notes'] as String? ?? '';
    if (j['items'] != null) {
      f.items = (j['items'] as List).map((i) => _PackItem.fromJson(i as Map<String, dynamic>)).toList();
    }
    return f;
  }

  _Form copy() {
    final r = _Form();
    r.shipmentNumber = shipmentNumber; r.shipDate = shipDate;
    r.fromName = fromName; r.fromAddress = fromAddress; r.fromCity = fromCity; r.fromPhone = fromPhone;
    r.toName = toName; r.toAddress = toAddress; r.toCity = toCity; r.toPhone = toPhone;
    r.carrier = carrier; r.trackingNumber = trackingNumber; r.notes = notes;
    r.items = items.map((i) => i.copy()).toList();
    return r;
  }
}

final _psProvider = StateNotifierProvider.autoDispose<_N, _Form>((ref) => _N());
class _N extends StateNotifier<_Form> {
  _N() : super(_Form());
  void up(_Form Function(_Form) fn) => state = fn(state);
  void load(_Form f) => state = f;
}

void _set(WidgetRef ref, String k, String v) => ref.read(_psProvider.notifier).up((s) {
  final r = s.copy();
  switch (k) {
    case 'shipmentNumber': r.shipmentNumber = v;
    case 'shipDate': r.shipDate = v;
    case 'fromName': r.fromName = v;
    case 'fromAddress': r.fromAddress = v;
    case 'fromCity': r.fromCity = v;
    case 'fromPhone': r.fromPhone = v;
    case 'toName': r.toName = v;
    case 'toAddress': r.toAddress = v;
    case 'toCity': r.toCity = v;
    case 'toPhone': r.toPhone = v;
    case 'carrier': r.carrier = v;
    case 'trackingNumber': r.trackingNumber = v;
    case 'notes': r.notes = v;
  }
  return r;
});

class PackingSlipScreen extends ConsumerStatefulWidget {
  const PackingSlipScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;
  @override
  ConsumerState<PackingSlipScreen> createState() => _State();
}

class _State extends ConsumerState<PackingSlipScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  bool _saving = false, _downloading = false;
  bool _showPreview = false;
  static const _tabs = ['Sender', 'Ship To', 'Shipment', 'Items'];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _tabs.length, vsync: this);
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try { ref.read(_psProvider.notifier).load(_Form.fromJson(widget.savedDocument!.parsedFormData)); }
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
      final pdf = await _buildPdf(ref.read(_psProvider));
      await Printing.sharePdf(bytes: await pdf.save(),
          filename: 'PackingSlip_${ref.read(_psProvider).shipmentNumber}.pdf');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
    } finally { if (mounted) setState(() => _downloading = false); }
  }

  Widget _buildPreview() {
    return PdfPreview(
      build: (_) async {
        final pdf = await _buildPdf(ref.read(_psProvider));
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
    final f = ref.read(_psProvider);
    final req = SaveDocumentRequest(
      docType: 'packing-slip',
      title: 'Packing Slip ${f.shipmentNumber}',
      templateName: 'Classic',
      referenceNumber: f.shipmentNumber,
      partyName: f.toName,
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
        title: Text(widget.savedDocument != null ? 'Edit Packing Slip' : 'New Packing Slip'),
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
            children: const [_SenderTab(), _ShipToTab(), _ShipmentTab(), _ItemsTab()],
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

class _SenderTab extends ConsumerWidget {
  const _SenderTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_psProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Ship From'),
        AppTextField(label: 'Name / Company *', hint: 'Your Company',
            initialValue: f.fromName, onChanged: (v) => _set(ref, 'fromName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', initialValue: f.fromAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'fromAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'City', initialValue: f.fromCity,
              onChanged: (v) => _set(ref, 'fromCity', v)),
          right: AppTextField(label: 'Phone', initialValue: f.fromPhone,
              keyboardType: TextInputType.phone,
              onChanged: (v) => _set(ref, 'fromPhone', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ShipToTab extends ConsumerWidget {
  const _ShipToTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_psProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Ship To'),
        AppTextField(label: 'Recipient Name / Company *', hint: 'Client Name',
            initialValue: f.toName, onChanged: (v) => _set(ref, 'toName', v)),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Address', initialValue: f.toAddress, maxLines: 2,
            onChanged: (v) => _set(ref, 'toAddress', v)),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'City', initialValue: f.toCity,
              onChanged: (v) => _set(ref, 'toCity', v)),
          right: AppTextField(label: 'Phone', initialValue: f.toPhone,
              keyboardType: TextInputType.phone,
              onChanged: (v) => _set(ref, 'toPhone', v)),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ShipmentTab extends ConsumerWidget {
  const _ShipmentTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_psProvider);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const AppFormLabel('Shipment Details'),
        AppFormRow(
          left: AppTextField(label: 'Shipment Number', hint: 'SHIP-2026-001',
              initialValue: f.shipmentNumber, onChanged: (v) => _set(ref, 'shipmentNumber', v)),
          right: AppTextField(label: 'Ship Date', hint: 'DD/MM/YYYY',
              initialValue: f.shipDate, onChanged: (v) => _set(ref, 'shipDate', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppFormRow(
          left: AppTextField(label: 'Carrier', hint: 'Delhivery / DTDC',
              initialValue: f.carrier, onChanged: (v) => _set(ref, 'carrier', v)),
          right: AppTextField(label: 'Tracking Number', hint: 'AWB number',
              initialValue: f.trackingNumber, onChanged: (v) => _set(ref, 'trackingNumber', v)),
        ),
        const SizedBox(height: AppSpacing.base),
        AppTextField(label: 'Notes', hint: 'Handle with care, fragile...',
            initialValue: f.notes, maxLines: 2, onChanged: (v) => _set(ref, 'notes', v)),
        const SizedBox(height: 80),
      ]),
    );
  }
}

class _ItemsTab extends ConsumerWidget {
  const _ItemsTab();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final f = ref.watch(_psProvider);
    final n = ref.read(_psProvider.notifier);
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
              AppTextField(label: 'Description', hint: 'Product name',
                  initialValue: item.description,
                  onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].description = v; return r; })),
              const SizedBox(height: 6),
              Row(children: [
                Expanded(child: AppTextField(label: 'Qty', hint: '1', initialValue: item.qty,
                    keyboardType: TextInputType.number,
                    onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].qty = v; return r; }))),
                const SizedBox(width: 8),
                Expanded(child: AppTextField(label: 'Unit', hint: 'pcs', initialValue: item.unit,
                    onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].unit = v; return r; }))),
                const SizedBox(width: 8),
                Expanded(child: AppTextField(label: 'Weight', hint: '0.5 kg', initialValue: item.weight,
                    onChanged: (v) => n.up((s) { final r = s.copy(); r.items[i].weight = v; return r; }))),
              ]),
            ]),
          );
        }),
        AppButton(
          label: '+ Add Item',
          variant: AppButtonVariant.outline,
          onPressed: () => n.up((s) { final r = s.copy(); r.items.add(_PackItem()); return r; }),
          width: double.infinity,
        ),
        const SizedBox(height: 80),
      ]),
    );
  }
}

Future<pw.Document> _buildPdf(_Form f) async {
  final doc = pw.Document(title: 'Packing Slip');
  final reg = await PdfGoogleFonts.interRegular();
  final bold = await PdfGoogleFonts.interBold();
  final heading = await PdfGoogleFonts.spaceGroteskBold();
  const accent = PdfColor(0.063, 0.725, 0.506); // green

  doc.addPage(pw.Page(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.all(36),
    build: (ctx) => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
      pw.Container(
        color: accent,
        padding: const pw.EdgeInsets.all(14),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('PACKING SLIP', style: pw.TextStyle(font: heading, fontSize: 20, color: PdfColors.white)),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('# ${f.shipmentNumber}', style: pw.TextStyle(font: bold, fontSize: 11, color: PdfColors.white)),
            pw.Text('Date: ${f.shipDate.isEmpty ? "—" : f.shipDate}',
                style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.white)),
          ]),
        ]),
      ),
      pw.SizedBox(height: 14),
      pw.Row(children: [
        pw.Expanded(child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('FROM', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
          pw.Text(f.fromName.isEmpty ? '—' : f.fromName, style: pw.TextStyle(font: bold, fontSize: 12)),
          if (f.fromAddress.isNotEmpty)
            pw.Text(f.fromAddress, style: pw.TextStyle(font: reg, fontSize: 10)),
          if (f.fromCity.isNotEmpty)
            pw.Text(f.fromCity, style: pw.TextStyle(font: reg, fontSize: 10)),
          if (f.fromPhone.isNotEmpty)
            pw.Text('Tel: ${f.fromPhone}', style: pw.TextStyle(font: reg, fontSize: 10)),
        ])),
        pw.SizedBox(width: 20),
        pw.Expanded(child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Text('TO', style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.grey600)),
          pw.Text(f.toName.isEmpty ? '—' : f.toName, style: pw.TextStyle(font: bold, fontSize: 12)),
          if (f.toAddress.isNotEmpty)
            pw.Text(f.toAddress, style: pw.TextStyle(font: reg, fontSize: 10)),
          if (f.toCity.isNotEmpty)
            pw.Text(f.toCity, style: pw.TextStyle(font: reg, fontSize: 10)),
          if (f.toPhone.isNotEmpty)
            pw.Text('Tel: ${f.toPhone}', style: pw.TextStyle(font: reg, fontSize: 10)),
        ])),
      ]),
      if (f.carrier.isNotEmpty || f.trackingNumber.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Row(children: [
          if (f.carrier.isNotEmpty)
            pw.Text('Carrier: ${f.carrier}  ', style: pw.TextStyle(font: reg, fontSize: 11)),
          if (f.trackingNumber.isNotEmpty)
            pw.Text('Tracking: ${f.trackingNumber}', style: pw.TextStyle(font: reg, fontSize: 11)),
        ]),
      ],
      pw.SizedBox(height: 16),
      pw.Table(
        border: pw.TableBorder.all(color: PdfColors.grey300),
        children: [
          pw.TableRow(
            decoration: pw.BoxDecoration(color: accent),
            children: ['#', 'Description', 'Qty', 'Unit', 'Weight'].map((h) =>
                pw.Padding(padding: const pw.EdgeInsets.all(6),
                    child: pw.Text(h, style: pw.TextStyle(font: bold, fontSize: 9, color: PdfColors.white)))).toList(),
          ),
          ...f.items.asMap().entries.map((e) {
            final item = e.value;
            return pw.TableRow(
              decoration: pw.BoxDecoration(color: e.key.isEven ? PdfColors.white : PdfColors.grey50),
              children: ['${e.key + 1}', item.description, item.qty, item.unit, item.weight].map((c) =>
                  pw.Padding(padding: const pw.EdgeInsets.all(5),
                      child: pw.Text(c, style: pw.TextStyle(font: reg, fontSize: 9)))).toList(),
            );
          }),
        ],
      ),
      if (f.notes.isNotEmpty) ...[
        pw.SizedBox(height: 10),
        pw.Text('Notes: ${f.notes}', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey700)),
      ],
      pw.Spacer(),
      pw.Divider(),
      pw.Text('This is a computer-generated packing slip.',
          style: pw.TextStyle(font: reg, fontSize: 9, color: PdfColors.grey400)),
    ]),
  ));
  return doc;
}

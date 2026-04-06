import 'dart:typed_data';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../data/models/quotation_form.dart';

class QuotationPdfGenerator {
  static Future<void> generateAndShare(QuotationForm form) async {
    final pdf = await _build(form);
    await Printing.sharePdf(
      bytes: await pdf.save(),
      filename: 'Quotation_${form.quoteNumber}.pdf',
    );
  }

  static Future<Uint8List> buildBytes(QuotationForm form) async {
    final pdf = await _build(form);
    return pdf.save();
  }

  static Future<pw.Document> _build(QuotationForm form) async {
    final doc = pw.Document(title: 'Quotation ${form.quoteNumber}', author: 'DocMinty');
    final fontRegular = await PdfGoogleFonts.interRegular();
    final fontBold = await PdfGoogleFonts.interBold();
    final fontHeading = await PdfGoogleFonts.spaceGroteskBold();
    final accent = _hex(form.templateColor);
    final fmt = NumberFormat('#,##,##0.00', 'en_IN');

    doc.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (ctx) => [
          // Header
          pw.Container(
            color: accent,
            padding: const pw.EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
                  pw.Text(form.fromName.isEmpty ? 'Your Business' : form.fromName,
                      style: pw.TextStyle(font: fontHeading, fontSize: 16, color: PdfColors.white)),
                  if (form.fromGstin.isNotEmpty)
                    pw.Text('GSTIN: ${form.fromGstin}',
                        style: pw.TextStyle(font: fontRegular, fontSize: 9, color: PdfColors.white)),
                ]),
                pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
                  pw.Text('QUOTATION',
                      style: pw.TextStyle(font: fontHeading, fontSize: 20, color: PdfColors.white)),
                  pw.Text('# ${form.quoteNumber}',
                      style: pw.TextStyle(font: fontRegular, fontSize: 10, color: PdfColors.white)),
                ]),
              ],
            ),
          ),
          pw.SizedBox(height: 16),
          // Meta row
          pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
            pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
              _label('Bill To', fontBold),
              pw.SizedBox(height: 4),
              pw.Text(form.toName.isEmpty ? '—' : form.toName,
                  style: pw.TextStyle(font: fontBold, fontSize: 11)),
              if (form.toAddress.isNotEmpty)
                pw.Text(form.toAddress, style: pw.TextStyle(font: fontRegular, fontSize: 10)),
              if (form.toCity.isNotEmpty || form.toState.isNotEmpty)
                pw.Text('${form.toCity} ${form.toState}',
                    style: pw.TextStyle(font: fontRegular, fontSize: 10)),
              if (form.toGstin.isNotEmpty)
                pw.Text('GSTIN: ${form.toGstin}',
                    style: pw.TextStyle(font: fontRegular, fontSize: 10)),
            ]),
            pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
              _metaRow('Date', form.quoteDate.isEmpty ? '—' : form.quoteDate, fontRegular, fontBold),
              _metaRow('Valid Until', form.validUntil.isEmpty ? '—' : form.validUntil, fontRegular, fontBold),
            ]),
          ]),
          pw.SizedBox(height: 16),
          // Items table
          _itemsTable(form, fontRegular, fontBold, accent, fmt),
          pw.SizedBox(height: 12),
          // Totals
          pw.Align(
            alignment: pw.Alignment.centerRight,
            child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
              _totalRow('Subtotal', '₹${fmt.format(form.subtotal)}', fontRegular),
              if (form.taxType == TaxType.cgstSgst) ...[
                _totalRow('CGST', '₹${fmt.format(form.cgst)}', fontRegular),
                _totalRow('SGST', '₹${fmt.format(form.sgst)}', fontRegular),
              ] else if (form.taxType == TaxType.igst)
                _totalRow('IGST', '₹${fmt.format(form.igst)}', fontRegular),
              pw.Divider(),
              _totalRow('Total', '₹${fmt.format(form.grandTotal)}', fontBold, size: 14),
            ]),
          ),
          if (form.notes.isNotEmpty) ...[
            pw.SizedBox(height: 12),
            _label('Notes', fontBold),
            pw.Text(form.notes, style: pw.TextStyle(font: fontRegular, fontSize: 10)),
          ],
          if (form.terms.isNotEmpty) ...[
            pw.SizedBox(height: 8),
            _label('Terms & Conditions', fontBold),
            pw.Text(form.terms, style: pw.TextStyle(font: fontRegular, fontSize: 10)),
          ],
        ],
      ),
    );
    return doc;
  }

  static pw.Widget _itemsTable(
      QuotationForm form, pw.Font reg, pw.Font bold, PdfColor accent, NumberFormat fmt) {
    final cols = [
      '#', 'Description',
      if (form.showHsn) 'HSN',
      'Qty', 'Rate',
      if (form.showDiscount) 'Disc%',
      'GST%', 'Amount',
    ];
    return pw.Table(
      border: pw.TableBorder.all(color: PdfColors.grey300),
      columnWidths: {
        0: const pw.FixedColumnWidth(24),
        1: const pw.FlexColumnWidth(),
      },
      children: [
        pw.TableRow(
          decoration: pw.BoxDecoration(color: accent),
          children: cols
              .map((h) => _cell(h, bold, color: PdfColors.white, isHeader: true))
              .toList(),
        ),
        ...form.items.asMap().entries.map((e) {
          final i = e.key;
          final item = e.value;
          final cells = [
            '${i + 1}', item.description,
            if (form.showHsn) item.hsn,
            item.qty, '₹${fmt.format(item.rateNum)}',
            if (form.showDiscount) '${item.discount}%',
            '${item.gstRate}%', '₹${fmt.format(item.totalAmount)}',
          ];
          return pw.TableRow(
            decoration: pw.BoxDecoration(
                color: i.isEven ? PdfColors.white : PdfColors.grey50),
            children: cells.map((c) => _cell(c, reg)).toList(),
          );
        }),
      ],
    );
  }

  static pw.Widget _cell(String text, pw.Font font,
      {PdfColor? color, bool isHeader = false}) =>
      pw.Padding(
        padding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 4),
        child: pw.Text(text,
            style: pw.TextStyle(
                font: font,
                fontSize: isHeader ? 9 : 9,
                color: color ?? PdfColors.black)),
      );

  static pw.Widget _label(String text, pw.Font font) =>
      pw.Text(text,
          style: pw.TextStyle(font: font, fontSize: 10, color: PdfColors.grey700));

  static pw.Widget _metaRow(String label, String value, pw.Font reg, pw.Font bold) =>
      pw.Row(children: [
        pw.Text('$label: ', style: pw.TextStyle(font: reg, fontSize: 10, color: PdfColors.grey600)),
        pw.Text(value, style: pw.TextStyle(font: bold, fontSize: 10)),
      ]);

  static pw.Widget _totalRow(String label, String value, pw.Font font, {double size = 10}) =>
      pw.Padding(
        padding: const pw.EdgeInsets.symmetric(vertical: 2),
        child: pw.Row(children: [
          pw.SizedBox(width: 120,
              child: pw.Text(label, style: pw.TextStyle(font: font, fontSize: size))),
          pw.SizedBox(width: 80,
              child: pw.Text(value,
                  textAlign: pw.TextAlign.right,
                  style: pw.TextStyle(font: font, fontSize: size))),
        ]),
      );

  static PdfColor _hex(String hex) {
    final h = hex.replaceAll('#', '');
    final r = int.parse(h.substring(0, 2), radix: 16) / 255;
    final g = int.parse(h.substring(2, 4), radix: 16) / 255;
    final b = int.parse(h.substring(4, 6), radix: 16) / 255;
    return PdfColor(r, g, b);
  }
}

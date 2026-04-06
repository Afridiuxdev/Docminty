import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../core/utils/indian_states.dart';
import '../data/models/invoice_form.dart';

/// Generates an Invoice PDF in the selected template style,
/// matching the web React-PDF templates.
class InvoicePdfGenerator {
  static Future<void> generateAndShare(InvoiceForm form) async {
    final bytes = await buildBytes(form);
    await Printing.sharePdf(
      bytes: bytes,
      filename: 'Invoice_${form.invoiceNumber}.pdf',
    );
  }

  static Future<Uint8List> buildBytes(InvoiceForm form) async {
    final doc = pw.Document(title: 'Invoice ${form.invoiceNumber}', author: 'DocMinty');
    final regular = await PdfGoogleFonts.interRegular();
    final bold    = await PdfGoogleFonts.interBold();
    final heading = await PdfGoogleFonts.spaceGroteskBold();
    final accent  = _hex(form.templateColor);

    switch (form.templateName) {
      case 'Minimal':
        _buildMinimal(doc, form, regular, bold, heading, accent);
      case 'Modern':
        _buildModern(doc, form, regular, bold, heading, accent);
      case 'Corporate':
        _buildCorporate(doc, form, regular, bold, heading, accent);
      case 'Elegant':
        _buildElegant(doc, form, regular, bold, heading, accent);
      default:
        _buildClassic(doc, form, regular, bold, heading, accent);
    }

    return doc.save();
  }

  // ─── CLASSIC ──────────────────────────────────────────────────────────────
  // White bg, border-bottom accent header, "INVOICE" in accent top-right

  static void _buildClassic(
    pw.Document doc, InvoiceForm form,
    pw.Font regular, pw.Font bold, pw.Font heading, PdfColor accent,
  ) {
    doc.addPage(pw.MultiPage(
      pageFormat: PdfPageFormat.a4,
      margin: const pw.EdgeInsets.all(36),
      build: (ctx) => [
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
              pw.Text(form.fromName.isEmpty ? 'Your Business' : form.fromName,
                  style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColor.fromHex('#111827'))),
              if (form.fromGstin.isNotEmpty) pw.Text('GSTIN: ${form.fromGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
              if (form.fromAddress.isNotEmpty) pw.Text(form.fromAddress, style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
              if (form.fromCity.isNotEmpty) pw.Text('${form.fromCity}, ${_state(form.fromState)}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
              if (form.fromPhone.isNotEmpty) pw.Text(form.fromPhone, style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
            ]),
            pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
              pw.Text('INVOICE', style: pw.TextStyle(font: heading, fontSize: 24, color: accent, letterSpacing: 1)),
              pw.Text('#${form.invoiceNumber}', style: pw.TextStyle(font: regular, fontSize: 9, color: PdfColors.grey600)),
              if (form.invoiceDate.isNotEmpty) pw.Text('Date: ${form.invoiceDate}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey400)),
              if (form.dueDate.isNotEmpty) pw.Text('Due: ${form.dueDate}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey400)),
            ]),
          ],
        ),
        pw.SizedBox(height: 10),
        pw.Divider(color: accent, borderStyle: pw.BorderStyle.solid, thickness: 2),
        pw.SizedBox(height: 14),
        pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            _pLabel('Bill To', regular),
            pw.SizedBox(height: 2),
            pw.Text(form.toName.isEmpty ? 'Client' : form.toName, style: pw.TextStyle(font: bold, fontSize: 12, color: PdfColor.fromHex('#111827'))),
            if (form.toGstin.isNotEmpty) pw.Text('GSTIN: ${form.toGstin}', style: pw.TextStyle(font: regular, fontSize: 8)),
            if (form.toAddress.isNotEmpty) pw.Text(form.toAddress, style: pw.TextStyle(font: regular, fontSize: 8)),
            if (form.toCity.isNotEmpty) pw.Text('${form.toCity}, ${_state(form.toState)}', style: pw.TextStyle(font: regular, fontSize: 8)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            _pLabel('Tax Type', regular),
            pw.Text(_taxLabel(form.taxType), style: pw.TextStyle(font: bold, fontSize: 10)),
          ]),
        ]),
        pw.SizedBox(height: 14),
        pw.Divider(),
        pw.SizedBox(height: 6),
        _itemsTable(form, regular, bold, PdfColor.fromHex('#F0F4F3'), accent: accent),
        pw.SizedBox(height: 14),
        pw.Align(
          alignment: pw.Alignment.centerRight,
          child: pw.SizedBox(width: 210, child: _classicTotals(form, regular, bold, accent)),
        ),
        ..._notesTerms(form, regular, bold),
        pw.SizedBox(height: 20),
        _footer(regular),
      ],
    ));
  }

  // ─── MINIMAL ──────────────────────────────────────────────────────────────
  // Clean white, accent divider, accent-colored table header labels

  static void _buildMinimal(
    pw.Document doc, InvoiceForm form,
    pw.Font regular, pw.Font bold, pw.Font heading, PdfColor accent,
  ) {
    doc.addPage(pw.MultiPage(
      pageFormat: PdfPageFormat.a4,
      margin: const pw.EdgeInsets.symmetric(horizontal: 48, vertical: 40),
      build: (ctx) => [
        pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text(form.fromName.isEmpty ? 'Your Business' : form.fromName,
                style: pw.TextStyle(font: heading, fontSize: 14, color: PdfColor.fromHex('#111827'))),
            if (form.fromGstin.isNotEmpty) pw.Text('GSTIN: ${form.fromGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey400)),
            if (form.fromCity.isNotEmpty) pw.Text('${form.fromCity}, ${_state(form.fromState)}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey400)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            pw.Text('Invoice', style: pw.TextStyle(font: heading, fontSize: 22, color: accent)),
            pw.Text('#${form.invoiceNumber}', style: pw.TextStyle(font: regular, fontSize: 9, color: PdfColors.grey400)),
            if (form.invoiceDate.isNotEmpty) pw.Text('Date: ${form.invoiceDate}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey400)),
          ]),
        ]),
        pw.SizedBox(height: 14),
        pw.Divider(color: accent, thickness: 1.5),
        pw.SizedBox(height: 14),
        pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            _pLabel('Bill To', regular, color: PdfColors.grey400),
            pw.SizedBox(height: 2),
            pw.Text(form.toName.isEmpty ? 'Client' : form.toName, style: pw.TextStyle(font: bold, fontSize: 12)),
            if (form.toGstin.isNotEmpty) pw.Text('GSTIN: ${form.toGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey400)),
          ]),
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
            _pLabel('Tax Type', regular, color: PdfColors.grey400),
            pw.Text(_taxLabel(form.taxType), style: pw.TextStyle(font: regular, fontSize: 9)),
          ]),
        ]),
        pw.SizedBox(height: 14),
        _minimalItemsTable(form, regular, bold, accent),
        pw.SizedBox(height: 12),
        pw.Align(
          alignment: pw.Alignment.centerRight,
          child: pw.SizedBox(width: 180, child: _minimalTotals(form, regular, bold, accent)),
        ),
        pw.SizedBox(height: 20),
        pw.Divider(color: PdfColors.grey300),
        _footer(regular),
      ],
    ));
  }

  // ─── MODERN ───────────────────────────────────────────────────────────────
  // Left sidebar accent color, main content right

  static void _buildModern(
    pw.Document doc, InvoiceForm form,
    pw.Font regular, pw.Font bold, pw.Font heading, PdfColor accent,
  ) {
    doc.addPage(pw.Page(
      pageFormat: PdfPageFormat.a4,
      build: (ctx) => pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.stretch,
        children: [
          // Sidebar
          pw.Container(
            width: 130,
            color: accent,
            padding: const pw.EdgeInsets.all(16),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text('INVOICE', style: pw.TextStyle(font: heading, fontSize: 18, color: PdfColors.white)),
                pw.SizedBox(height: 4),
                pw.Text('#${form.invoiceNumber}', style: pw.TextStyle(font: regular, fontSize: 9, color: PdfColors.white70)),
                if (form.invoiceDate.isNotEmpty) pw.Text('Date: ${form.invoiceDate}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.white60)),
                if (form.dueDate.isNotEmpty) pw.Text('Due: ${form.dueDate}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.white60)),
                pw.SizedBox(height: 20),
                pw.Text('BILL TO', style: pw.TextStyle(font: bold, fontSize: 7, color: PdfColors.white54, letterSpacing: 1)),
                pw.SizedBox(height: 4),
                pw.Text(form.toName.isEmpty ? 'Client' : form.toName, style: pw.TextStyle(font: bold, fontSize: 10, color: PdfColors.white)),
                if (form.toGstin.isNotEmpty) pw.Text('GSTIN: ${form.toGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.white70)),
                if (form.toCity.isNotEmpty) pw.Text(_state(form.toState), style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.white70)),
                pw.SizedBox(height: 16),
                pw.Text('TAX TYPE', style: pw.TextStyle(font: bold, fontSize: 7, color: PdfColors.white54, letterSpacing: 1)),
                pw.SizedBox(height: 4),
                pw.Text(_taxLabel(form.taxType), style: pw.TextStyle(font: regular, fontSize: 9, color: PdfColors.white)),
              ],
            ),
          ),
          // Main
          pw.Expanded(
            child: pw.Padding(
              padding: const pw.EdgeInsets.all(24),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Text(form.fromName.isEmpty ? 'Your Business' : form.fromName,
                      style: pw.TextStyle(font: heading, fontSize: 14, color: PdfColor.fromHex('#111827'))),
                  if (form.fromGstin.isNotEmpty) pw.Text('GSTIN: ${form.fromGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
                  if (form.fromAddress.isNotEmpty) pw.Text(form.fromAddress, style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
                  if (form.fromCity.isNotEmpty) pw.Text('${form.fromCity}, ${_state(form.fromState)}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
                  pw.SizedBox(height: 16),
                  _modernItemsTable(form, regular, bold, accent),
                  pw.SizedBox(height: 10),
                  pw.Align(
                    alignment: pw.Alignment.centerRight,
                    child: pw.SizedBox(width: 200, child: _classicTotals(form, regular, bold, accent)),
                  ),
                  pw.Spacer(),
                  pw.Divider(color: PdfColors.grey300),
                  _footer(regular),
                ],
              ),
            ),
          ),
        ],
      ),
    ));
  }

  // ─── CORPORATE ────────────────────────────────────────────────────────────
  // Top/bottom accent strips, centered header

  static void _buildCorporate(
    pw.Document doc, InvoiceForm form,
    pw.Font regular, pw.Font bold, pw.Font heading, PdfColor accent,
  ) {
    doc.addPage(pw.MultiPage(
      pageFormat: PdfPageFormat.a4,
      margin: pw.EdgeInsets.zero,
      build: (ctx) => [
        // Top strip
        pw.Container(height: 8, color: accent),
        pw.Padding(
          padding: const pw.EdgeInsets.symmetric(horizontal: 36, vertical: 16),
          child: pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.stretch,
            children: [
              // Centered header
              pw.Container(
                padding: const pw.EdgeInsets.only(bottom: 14),
                decoration: pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: accent, width: 2))),
                child: pw.Column(children: [
                  pw.Text(form.fromName.isEmpty ? 'Your Business' : form.fromName,
                      style: pw.TextStyle(font: heading, fontSize: 15, color: accent), textAlign: pw.TextAlign.center),
                  pw.Text('Official Tax Invoice', style: pw.TextStyle(font: regular, fontSize: 9, color: accent, letterSpacing: 1)),
                  pw.SizedBox(height: 6),
                  pw.Row(mainAxisAlignment: pw.MainAxisAlignment.center, children: [
                    if (form.fromGstin.isNotEmpty) pw.Text('GSTIN: ${form.fromGstin}  •  ', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey600)),
                    pw.Text('No: ${form.invoiceNumber}', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey600)),
                    if (form.invoiceDate.isNotEmpty) pw.Text('  •  Date: ${form.invoiceDate}', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey600)),
                  ]),
                ]),
              ),
              pw.SizedBox(height: 14),
              // Bill To row (tinted background)
              pw.Container(
                padding: const pw.EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                color: PdfColor.fromHex('#F8FAFD'),
                child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
                  pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
                    _pLabel('Bill To', regular, color: accent),
                    pw.SizedBox(height: 2),
                    pw.Text(form.toName.isEmpty ? 'Client' : form.toName, style: pw.TextStyle(font: bold, fontSize: 12)),
                    if (form.toGstin.isNotEmpty) pw.Text('GSTIN: ${form.toGstin}', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey600)),
                    if (form.toCity.isNotEmpty) pw.Text('${form.toCity}, ${_state(form.toState)}', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey600)),
                  ]),
                  pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
                    _pLabel('Tax Type', regular, color: accent),
                    pw.Text(_taxLabel(form.taxType), style: pw.TextStyle(font: regular, fontSize: 9)),
                  ]),
                ]),
              ),
              pw.SizedBox(height: 12),
              _corporateItemsTable(form, regular, bold, accent),
              pw.SizedBox(height: 10),
              pw.Align(
                alignment: pw.Alignment.centerRight,
                child: pw.SizedBox(width: 200, child: _corporateTotals(form, regular, bold, accent)),
              ),
              ..._notesTerms(form, regular, bold),
              pw.SizedBox(height: 16),
              pw.Divider(color: accent, thickness: 2),
              pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
                _footer(regular),
                pw.Text('Authorised Signatory', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey400)),
              ]),
            ],
          ),
        ),
        // Bottom strip — rendered last
        pw.Container(height: 8, color: accent),
      ],
    ));
  }

  // ─── ELEGANT ──────────────────────────────────────────────────────────────
  // Cream background, centered header, accent borders

  static void _buildElegant(
    pw.Document doc, InvoiceForm form,
    pw.Font regular, pw.Font bold, pw.Font heading, PdfColor accent,
  ) {
    final cream = PdfColor.fromHex('#FFFDF5');
    doc.addPage(pw.MultiPage(
      pageFormat: PdfPageFormat.a4,
      margin: const pw.EdgeInsets.all(36),
      pageTheme: pw.PageTheme(
        pageFormat: PdfPageFormat.a4,
        buildBackground: (ctx) => pw.FullPage(ignoreMargins: true,
            child: pw.Container(color: cream)),
      ),
      build: (ctx) => [
        // Centered header
        pw.Center(child: pw.Column(children: [
          pw.Text(
            (form.fromName.isEmpty ? 'YOUR BUSINESS' : form.fromName).toUpperCase(),
            style: pw.TextStyle(font: heading, fontSize: 16, color: PdfColor.fromHex('#111827'), letterSpacing: 1),
          ),
          if (form.fromGstin.isNotEmpty) pw.Text('GSTIN: ${form.fromGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
          if (form.fromCity.isNotEmpty) pw.Text('${form.fromCity}, ${_state(form.fromState)}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
          pw.SizedBox(height: 8),
          pw.Text('TAX INVOICE', style: pw.TextStyle(font: bold, fontSize: 10, color: accent, letterSpacing: 3)),
          pw.SizedBox(height: 2),
          pw.Text('#${form.invoiceNumber}${form.invoiceDate.isNotEmpty ? " • Date: ${form.invoiceDate}" : ""}',
              style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
        ])),
        pw.SizedBox(height: 14),
        pw.Divider(color: accent),
        pw.SizedBox(height: 12),
        pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            _pLabel('Bill To', regular, color: accent),
            pw.SizedBox(height: 2),
            pw.Text(form.toName.isEmpty ? 'Client' : form.toName, style: pw.TextStyle(font: bold, fontSize: 12)),
            if (form.toGstin.isNotEmpty) pw.Text('GSTIN: ${form.toGstin}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
            if (form.toCity.isNotEmpty) pw.Text('${form.toCity}, ${_state(form.toState)}', style: pw.TextStyle(font: regular, fontSize: 8, color: PdfColors.grey600)),
          ]),
        ]),
        pw.SizedBox(height: 12),
        _elegantItemsTable(form, regular, bold, accent),
        pw.SizedBox(height: 10),
        pw.Align(
          alignment: pw.Alignment.centerRight,
          child: pw.SizedBox(width: 210, child: _elegantTotals(form, regular, bold, accent)),
        ),
        ..._notesTerms(form, regular, bold),
        pw.SizedBox(height: 20),
        pw.Divider(color: accent, thickness: 2),
        pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          _footer(regular),
          pw.Text('Authorised Signatory', style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey400)),
        ]),
      ],
    ));
  }

  // ─── Shared table builders ─────────────────────────────────────────────────

  static pw.Widget _itemsTable(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor headerBg, {required PdfColor accent}) {
    return pw.Table(
      columnWidths: {
        0: const pw.FixedColumnWidth(20),
        1: const pw.FlexColumnWidth(3),
        if (form.showHsn) 2: const pw.FlexColumnWidth(1.5),
        3: const pw.FixedColumnWidth(30),
        4: const pw.FlexColumnWidth(1.5),
        5: const pw.FixedColumnWidth(35),
        6: const pw.FlexColumnWidth(1.8),
      },
      children: [
        pw.TableRow(
          decoration: pw.BoxDecoration(color: headerBg),
          children: [
            _th('#', bold), _th('DESC', bold),
            if (form.showHsn) _th('HSN', bold),
            _th('QTY', bold), _th('RATE', bold), _th('GST%', bold), _th('AMT', bold),
          ],
        ),
        ...form.items.asMap().entries.map((e) {
          final item = e.value;
          return pw.TableRow(
            decoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: PdfColors.grey300, width: 0.5))),
            children: [
              _td('${e.key + 1}', regular), _td(item.description.isEmpty ? '—' : item.description, regular),
              if (form.showHsn) _td(item.hsn.isEmpty ? '—' : item.hsn, regular),
              _td(item.qty, regular), _td('Rs.${item.rateNum.toStringAsFixed(2)}', regular),
              _td('${item.gstRate}%', regular), _td('Rs.${item.totalAmount.toStringAsFixed(2)}', bold),
            ],
          );
        }),
      ],
    );
  }

  static pw.Widget _minimalItemsTable(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Table(
      columnWidths: {
        0: const pw.FixedColumnWidth(20),
        1: const pw.FlexColumnWidth(3),
        2: const pw.FixedColumnWidth(30),
        3: const pw.FlexColumnWidth(1.5),
        4: const pw.FixedColumnWidth(35),
        5: const pw.FlexColumnWidth(1.8),
      },
      children: [
        pw.TableRow(
          decoration: pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: accent, width: 1.5))),
          children: [
            _thColored('#', bold, accent), _thColored('DESCRIPTION', bold, accent),
            _thColored('QTY', bold, accent), _thColored('RATE', bold, accent),
            _thColored('GST%', bold, accent), _thColored('AMOUNT', bold, accent),
          ],
        ),
        ...form.items.asMap().entries.map((e) {
          final item = e.value;
          return pw.TableRow(
            decoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: PdfColors.grey200, width: 0.5))),
            children: [
              _td('${e.key + 1}', regular), _td(item.description.isEmpty ? '—' : item.description, regular),
              _td(item.qty, regular), _td('Rs.${item.rateNum.toStringAsFixed(2)}', regular),
              _td('${item.gstRate}%', regular), _td('Rs.${item.totalAmount.toStringAsFixed(2)}', bold),
            ],
          );
        }),
      ],
    );
  }

  static pw.Widget _modernItemsTable(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Table(
      columnWidths: {
        0: const pw.FixedColumnWidth(20),
        1: const pw.FlexColumnWidth(3),
        2: const pw.FixedColumnWidth(28),
        3: const pw.FlexColumnWidth(1.5),
        4: const pw.FlexColumnWidth(1.8),
      },
      children: [
        pw.TableRow(
          decoration: pw.BoxDecoration(color: accent),
          children: [
            _thWhite('#', bold), _thWhite('DESCRIPTION', bold),
            _thWhite('QTY', bold), _thWhite('RATE', bold), _thWhite('AMOUNT', bold),
          ],
        ),
        ...form.items.asMap().entries.map((e) {
          final item = e.value;
          return pw.TableRow(
            decoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: PdfColors.grey200, width: 0.5))),
            children: [
              _td('${e.key + 1}', regular), _td(item.description.isEmpty ? '—' : item.description, regular),
              _td(item.qty, regular), _td('Rs.${item.rateNum.toStringAsFixed(2)}', regular),
              _td('Rs.${item.totalAmount.toStringAsFixed(2)}', bold),
            ],
          );
        }),
      ],
    );
  }

  static pw.Widget _corporateItemsTable(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Table(
      columnWidths: {
        0: const pw.FixedColumnWidth(20),
        1: const pw.FlexColumnWidth(3),
        2: const pw.FixedColumnWidth(30),
        3: const pw.FlexColumnWidth(1.5),
        4: const pw.FixedColumnWidth(35),
        5: const pw.FlexColumnWidth(1.8),
      },
      children: [
        pw.TableRow(
          decoration: pw.BoxDecoration(color: accent),
          children: [
            _thWhite('#', bold), _thWhite('DESCRIPTION', bold),
            _thWhite('QTY', bold), _thWhite('RATE', bold),
            _thWhite('GST%', bold), _thWhite('AMOUNT', bold),
          ],
        ),
        ...form.items.asMap().entries.map((e) {
          final item = e.value;
          final bg = e.key % 2 == 0 ? PdfColors.white : PdfColor.fromHex('#F8FAFD');
          return pw.TableRow(
            decoration: pw.BoxDecoration(color: bg, border: const pw.Border(bottom: pw.BorderSide(color: PdfColors.grey200, width: 0.5))),
            children: [
              _td('${e.key + 1}', regular), _td(item.description.isEmpty ? '—' : item.description, regular),
              _td(item.qty, regular), _td('Rs.${item.rateNum.toStringAsFixed(2)}', regular),
              _td('${item.gstRate}%', regular), _td('Rs.${item.totalAmount.toStringAsFixed(2)}', bold),
            ],
          );
        }),
      ],
    );
  }

  static pw.Widget _elegantItemsTable(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Table(
      columnWidths: {
        0: const pw.FixedColumnWidth(20),
        1: const pw.FlexColumnWidth(3),
        2: const pw.FixedColumnWidth(30),
        3: const pw.FlexColumnWidth(1.5),
        4: const pw.FixedColumnWidth(35),
        5: const pw.FlexColumnWidth(1.8),
      },
      children: [
        pw.TableRow(
          decoration: pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: accent, width: 2))),
          children: [
            _thColored('#', bold, accent), _thColored('DESCRIPTION', bold, accent),
            _thColored('QTY', bold, accent), _thColored('RATE', bold, accent),
            _thColored('GST%', bold, accent), _thColored('AMOUNT', bold, accent),
          ],
        ),
        ...form.items.asMap().entries.map((e) {
          final item = e.value;
          return pw.TableRow(
            decoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: PdfColor.fromInt(0xFFF5ECD5), width: 0.5))),
            children: [
              _td('${e.key + 1}', regular), _td(item.description.isEmpty ? '—' : item.description, regular),
              _td(item.qty, regular), _td('Rs.${item.rateNum.toStringAsFixed(2)}', regular),
              _td('${item.gstRate}%', regular), _td('Rs.${item.totalAmount.toStringAsFixed(2)}', bold),
            ],
          );
        }),
      ],
    );
  }

  // ─── Shared totals builders ───────────────────────────────────────────────

  static pw.Widget _classicTotals(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Column(children: [
      _totRow('Subtotal', form.subtotal, regular, bold),
      if (form.taxType == TaxType.cgstSgst) ...[
        _totRow('CGST', form.cgst, regular, bold),
        _totRow('SGST', form.sgst, regular, bold),
      ] else if (form.taxType == TaxType.igst)
        _totRow('IGST', form.igst, regular, bold),
      pw.Divider(),
      pw.Container(
        padding: const pw.EdgeInsets.all(8),
        decoration: pw.BoxDecoration(color: PdfColor.fromHex('#F0FDFA'), borderRadius: pw.BorderRadius.circular(4)),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('Total', style: pw.TextStyle(font: bold, fontSize: 12, color: accent)),
          pw.Text('Rs. ${form.grandTotal.toStringAsFixed(2)}', style: pw.TextStyle(font: bold, fontSize: 12, color: accent)),
        ]),
      ),
    ]);
  }

  static pw.Widget _minimalTotals(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Column(children: [
      _totRow('Subtotal', form.subtotal, regular, bold),
      if (form.taxType == TaxType.cgstSgst) ...[
        _totRow('CGST', form.cgst, regular, bold),
        _totRow('SGST', form.sgst, regular, bold),
      ] else if (form.taxType == TaxType.igst)
        _totRow('IGST', form.igst, regular, bold),
      pw.Divider(color: accent, thickness: 1.5),
      pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
        pw.Text('Total', style: pw.TextStyle(font: bold, fontSize: 12, color: accent)),
        pw.Text('Rs. ${form.grandTotal.toStringAsFixed(2)}', style: pw.TextStyle(font: bold, fontSize: 12, color: accent)),
      ]),
    ]);
  }

  static pw.Widget _corporateTotals(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Column(children: [
      _totRow('Subtotal', form.subtotal, regular, bold),
      if (form.taxType == TaxType.cgstSgst) ...[
        _totRow('CGST', form.cgst, regular, bold),
        _totRow('SGST', form.sgst, regular, bold),
      ] else if (form.taxType == TaxType.igst)
        _totRow('IGST', form.igst, regular, bold),
      pw.SizedBox(height: 4),
      pw.Container(
        padding: const pw.EdgeInsets.all(8),
        decoration: pw.BoxDecoration(color: accent, borderRadius: pw.BorderRadius.circular(3)),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('Total', style: pw.TextStyle(font: bold, fontSize: 12, color: PdfColors.white)),
          pw.Text('Rs. ${form.grandTotal.toStringAsFixed(2)}', style: pw.TextStyle(font: bold, fontSize: 12, color: PdfColors.white)),
        ]),
      ),
    ]);
  }

  static pw.Widget _elegantTotals(InvoiceForm form, pw.Font regular, pw.Font bold, PdfColor accent) {
    return pw.Column(children: [
      _totRow('Subtotal', form.subtotal, regular, bold),
      if (form.taxType == TaxType.cgstSgst) ...[
        _totRow('CGST', form.cgst, regular, bold),
        _totRow('SGST', form.sgst, regular, bold),
      ] else if (form.taxType == TaxType.igst)
        _totRow('IGST', form.igst, regular, bold),
      pw.SizedBox(height: 4),
      pw.Container(
        padding: const pw.EdgeInsets.all(8),
        decoration: pw.BoxDecoration(
          border: pw.Border.all(color: accent),
          borderRadius: pw.BorderRadius.circular(3),
        ),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text('Total', style: pw.TextStyle(font: bold, fontSize: 12, color: accent)),
          pw.Text('Rs. ${form.grandTotal.toStringAsFixed(2)}', style: pw.TextStyle(font: bold, fontSize: 12, color: accent)),
        ]),
      ),
    ]);
  }

  // ─── Shared micro-widgets ─────────────────────────────────────────────────

  static pw.Widget _th(String t, pw.Font f) => pw.Padding(
        padding: const pw.EdgeInsets.all(5),
        child: pw.Text(t, style: pw.TextStyle(font: f, fontSize: 7, color: PdfColors.grey700, letterSpacing: 0.5)),
      );

  static pw.Widget _thColored(String t, pw.Font f, PdfColor color) => pw.Padding(
        padding: const pw.EdgeInsets.all(5),
        child: pw.Text(t, style: pw.TextStyle(font: f, fontSize: 7, color: color, letterSpacing: 0.5)),
      );

  static pw.Widget _thWhite(String t, pw.Font f) => pw.Padding(
        padding: const pw.EdgeInsets.all(5),
        child: pw.Text(t, style: pw.TextStyle(font: f, fontSize: 7, color: PdfColors.white)),
      );

  static pw.Widget _td(String t, pw.Font f) => pw.Padding(
        padding: const pw.EdgeInsets.all(5),
        child: pw.Text(t, style: pw.TextStyle(font: f, fontSize: 9)),
      );

  static pw.Widget _pLabel(String t, pw.Font f, {PdfColor? color}) => pw.Text(
        t.toUpperCase(),
        style: pw.TextStyle(font: f, fontSize: 7, color: color ?? PdfColors.grey, letterSpacing: 0.8),
      );

  static pw.Widget _totRow(String label, double amt, pw.Font regular, pw.Font bold) => pw.Padding(
        padding: const pw.EdgeInsets.symmetric(vertical: 3),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text(label, style: pw.TextStyle(font: regular, fontSize: 9, color: PdfColors.grey600)),
          pw.Text('Rs. ${amt.toStringAsFixed(2)}', style: pw.TextStyle(font: bold, fontSize: 9)),
        ]),
      );

  static pw.Widget _footer(pw.Font regular) => pw.Text(
        'Generated by DocMinty.com',
        style: pw.TextStyle(font: regular, fontSize: 7, color: PdfColors.grey400),
      );

  static List<pw.Widget> _notesTerms(InvoiceForm form, pw.Font regular, pw.Font bold) {
    if (form.notes.isEmpty && form.terms.isEmpty) return [];
    return [
      pw.SizedBox(height: 14),
      pw.Divider(),
      if (form.notes.isNotEmpty) ...[
        pw.SizedBox(height: 6),
        _pLabel('Notes', bold),
        pw.Text(form.notes, style: pw.TextStyle(font: regular, fontSize: 9)),
      ],
      if (form.terms.isNotEmpty) ...[
        pw.SizedBox(height: 6),
        _pLabel('Terms & Conditions', bold),
        pw.Text(form.terms, style: pw.TextStyle(font: regular, fontSize: 9)),
      ],
    ];
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  static PdfColor _hex(String hex) {
    final h = hex.startsWith('#') ? hex.substring(1) : hex;
    final r = int.parse(h.substring(0, 2), radix: 16);
    final g = int.parse(h.substring(2, 4), radix: 16);
    final b = int.parse(h.substring(4, 6), radix: 16);
    return PdfColor.fromInt(0xFF000000 | (r << 16) | (g << 8) | b);
  }

  static String _state(String code) => IndianStates.nameFromCode(code);

  static String _taxLabel(TaxType t) => switch (t) {
        TaxType.cgstSgst => 'CGST + SGST (Intrastate)',
        TaxType.igst => 'IGST (Interstate)',
        TaxType.none => 'No Tax',
      };
}

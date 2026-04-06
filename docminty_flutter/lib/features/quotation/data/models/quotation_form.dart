import 'dart:convert';
import '../../../invoice/data/models/invoice_form.dart';

export '../../../invoice/data/models/invoice_form.dart' show InvoiceItem, TaxType;

class QuotationForm {
  QuotationForm({
    this.quoteNumber = 'QUO-2026-001',
    this.quoteDate = '',
    this.validUntil = '',
    this.fromName = '',
    this.fromGstin = '',
    this.fromAddress = '',
    this.fromCity = '',
    this.fromState = '27',
    this.fromPhone = '',
    this.fromEmail = '',
    this.toName = '',
    this.toGstin = '',
    this.toAddress = '',
    this.toCity = '',
    this.toState = '27',
    this.toPhone = '',
    this.toEmail = '',
    this.taxType = TaxType.cgstSgst,
    List<InvoiceItem>? items,
    this.notes = '',
    this.terms = 'This quotation is valid for 30 days.',
    this.showHsn = false,
    this.showDiscount = false,
    this.templateColor = '#0D9488',
    this.templateName = 'Classic',
    this.advancePercent = '',
    this.bankName = '',
    this.bankAccountNumber = '',
    this.bankIfsc = '',
    this.bankAccountName = '',
  }) : items = items ?? [InvoiceItem()];

  String quoteNumber;
  String quoteDate;
  String validUntil;

  String fromName;
  String fromGstin;
  String fromAddress;
  String fromCity;
  String fromState;
  String fromPhone;
  String fromEmail;

  String toName;
  String toGstin;
  String toAddress;
  String toCity;
  String toState;
  String toPhone;
  String toEmail;

  TaxType taxType;
  List<InvoiceItem> items;

  String notes;
  String terms;
  bool showHsn;
  bool showDiscount;
  String templateColor;
  String templateName;
  String advancePercent;
  String bankName;
  String bankAccountNumber;
  String bankIfsc;
  String bankAccountName;

  double get subtotal => items.fold(0, (s, i) => s + i.baseAmount);
  double get totalGst =>
      taxType == TaxType.none ? 0 : items.fold(0, (s, i) => s + i.gstAmount);
  double get cgst => taxType == TaxType.cgstSgst ? totalGst / 2 : 0;
  double get sgst => taxType == TaxType.cgstSgst ? totalGst / 2 : 0;
  double get igst => taxType == TaxType.igst ? totalGst : 0;
  double get grandTotal => subtotal + totalGst;

  Map<String, dynamic> toJson() => {
        'quoteNumber': quoteNumber,
        'quoteDate': quoteDate,
        'validUntil': validUntil,
        'fromName': fromName,
        'fromGSTIN': fromGstin,
        'fromAddress': fromAddress,
        'fromCity': fromCity,
        'fromState': fromState,
        'fromPhone': fromPhone,
        'fromEmail': fromEmail,
        'toName': toName,
        'toGSTIN': toGstin,
        'toAddress': toAddress,
        'toCity': toCity,
        'toState': toState,
        'toPhone': toPhone,
        'toEmail': toEmail,
        'taxType': _taxStr(taxType),
        'items': items.map((i) => i.toJson()).toList(),
        'notes': notes,
        'terms': terms,
        'showHSN': showHsn,
        'showDiscount': showDiscount,
        'templateColor': templateColor,
        'templateName': templateName,
        'advancePercent': advancePercent,
        'bankName': bankName,
        'bankAccountNumber': bankAccountNumber,
        'bankIfsc': bankIfsc,
        'bankAccountName': bankAccountName,
      };

  String toJsonString() => jsonEncode(toJson());

  factory QuotationForm.fromJson(Map<String, dynamic> j) => QuotationForm(
        quoteNumber: j['quoteNumber'] as String? ?? 'QUO-2026-001',
        quoteDate: j['quoteDate'] as String? ?? '',
        validUntil: j['validUntil'] as String? ?? '',
        fromName: j['fromName'] as String? ?? '',
        fromGstin: j['fromGSTIN'] as String? ?? '',
        fromAddress: j['fromAddress'] as String? ?? '',
        fromCity: j['fromCity'] as String? ?? '',
        fromState: j['fromState'] as String? ?? '27',
        fromPhone: j['fromPhone'] as String? ?? '',
        fromEmail: j['fromEmail'] as String? ?? '',
        toName: j['toName'] as String? ?? '',
        toGstin: j['toGSTIN'] as String? ?? '',
        toAddress: j['toAddress'] as String? ?? '',
        toCity: j['toCity'] as String? ?? '',
        toState: j['toState'] as String? ?? '27',
        toPhone: j['toPhone'] as String? ?? '',
        toEmail: j['toEmail'] as String? ?? '',
        taxType: _parseTax(j['taxType'] as String? ?? 'cgst_sgst'),
        items: j['items'] != null
            ? (j['items'] as List)
                .map((i) => InvoiceItem.fromJson(i as Map<String, dynamic>))
                .toList()
            : [InvoiceItem()],
        notes: j['notes'] as String? ?? '',
        terms: j['terms'] as String? ?? 'This quotation is valid for 30 days.',
        showHsn: j['showHSN'] as bool? ?? false,
        showDiscount: j['showDiscount'] as bool? ?? false,
        templateColor: j['templateColor'] as String? ?? '#0D9488',
        templateName: j['templateName'] as String? ?? 'Classic',
        advancePercent: j['advancePercent'] as String? ?? '',
        bankName: j['bankName'] as String? ?? '',
        bankAccountNumber: j['bankAccountNumber'] as String? ?? '',
        bankIfsc: j['bankIfsc'] as String? ?? '',
        bankAccountName: j['bankAccountName'] as String? ?? '',
      );

  factory QuotationForm.fromJsonString(String s) =>
      QuotationForm.fromJson(jsonDecode(s) as Map<String, dynamic>);

  static String _taxStr(TaxType t) => switch (t) {
        TaxType.cgstSgst => 'cgst_sgst',
        TaxType.igst => 'igst',
        TaxType.none => 'none',
      };

  static TaxType _parseTax(String s) => switch (s) {
        'igst' => TaxType.igst,
        'none' => TaxType.none,
        _ => TaxType.cgstSgst,
      };
}

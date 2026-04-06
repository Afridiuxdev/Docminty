import 'dart:convert';

class InvoiceItem {
  InvoiceItem({
    this.description = '',
    this.hsn = '',
    this.qty = '1',
    this.rate = '0.00',
    this.discount = '0',
    this.gstRate = '18',
  });

  String description;
  String hsn;
  String qty;
  String rate;
  String discount;
  String gstRate;

  double get qtyNum => double.tryParse(qty) ?? 0;
  double get rateNum => double.tryParse(rate) ?? 0;
  double get discountNum => double.tryParse(discount) ?? 0;
  double get gstRateNum => double.tryParse(gstRate) ?? 0;

  double get baseAmount {
    final base = qtyNum * rateNum;
    final disc = base * discountNum / 100;
    return base - disc;
  }

  double get gstAmount => baseAmount * gstRateNum / 100;
  double get totalAmount => baseAmount + gstAmount;

  Map<String, dynamic> toJson() => {
        'description': description,
        'hsn': hsn,
        'qty': qty,
        'rate': rate,
        'discount': discount,
        'gstRate': gstRate,
      };

  factory InvoiceItem.fromJson(Map<String, dynamic> j) => InvoiceItem(
        description: j['description'] as String? ?? '',
        hsn: j['hsn'] as String? ?? '',
        qty: j['qty'] as String? ?? '1',
        rate: j['rate'] as String? ?? '0.00',
        discount: j['discount'] as String? ?? '0',
        gstRate: j['gstRate'] as String? ?? '18',
      );

  InvoiceItem copyWith({
    String? description,
    String? hsn,
    String? qty,
    String? rate,
    String? discount,
    String? gstRate,
  }) =>
      InvoiceItem(
        description: description ?? this.description,
        hsn: hsn ?? this.hsn,
        qty: qty ?? this.qty,
        rate: rate ?? this.rate,
        discount: discount ?? this.discount,
        gstRate: gstRate ?? this.gstRate,
      );
}

enum TaxType { cgstSgst, igst, none }

class InvoiceForm {
  InvoiceForm({
    this.invoiceNumber = 'INV-2026-001',
    this.invoiceDate = '',
    this.dueDate = '',
    this.poNumber = '',
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
    this.gstRate = '18',
    List<InvoiceItem>? items,
    this.notes = '',
    this.terms = 'Payment due within 30 days.',
    this.signature,
    this.logo,
    this.showHsn = false,
    this.showDiscount = false,
    this.templateColor = '#0D9488',
    this.templateName = 'Classic',
  }) : items = items ?? [InvoiceItem()];

  String invoiceNumber;
  String invoiceDate;
  String dueDate;
  String poNumber;

  // Seller
  String fromName;
  String fromGstin;
  String fromAddress;
  String fromCity;
  String fromState;
  String fromPhone;
  String fromEmail;

  // Buyer
  String toName;
  String toGstin;
  String toAddress;
  String toCity;
  String toState;
  String toPhone;
  String toEmail;

  // Tax
  TaxType taxType;
  String gstRate;

  // Items
  List<InvoiceItem> items;

  // Footer
  String notes;
  String terms;
  String? signature; // base64 data URL
  String? logo;      // base64 data URL
  bool showHsn;
  bool showDiscount;
  String templateColor;
  String templateName;

  // ── Calculated totals ────────────────────────────────────────────────────
  double get subtotal => items.fold(0, (s, i) => s + i.baseAmount);

  double get totalGst {
    if (taxType == TaxType.none) return 0;
    return items.fold(0, (s, i) => s + i.gstAmount);
  }

  double get cgst => taxType == TaxType.cgstSgst ? totalGst / 2 : 0;
  double get sgst => taxType == TaxType.cgstSgst ? totalGst / 2 : 0;
  double get igst => taxType == TaxType.igst ? totalGst : 0;

  double get grandTotal => subtotal + totalGst;

  // ── Serialization ─────────────────────────────────────────────────────────
  Map<String, dynamic> toJson() => {
        'invoiceNumber': invoiceNumber,
        'invoiceDate': invoiceDate,
        'dueDate': dueDate,
        'poNumber': poNumber,
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
        'taxType': _taxTypeToString(taxType),
        'gstRate': gstRate,
        'items': items.map((i) => i.toJson()).toList(),
        'notes': notes,
        'terms': terms,
        'signature': signature,
        'logo': logo,
        'showHSN': showHsn,
        'showDiscount': showDiscount,
        'templateColor': templateColor,
        'templateName': templateName,
      };

  String toJsonString() => jsonEncode(toJson());

  factory InvoiceForm.fromJson(Map<String, dynamic> j) => InvoiceForm(
        invoiceNumber: j['invoiceNumber'] as String? ?? 'INV-2026-001',
        invoiceDate: j['invoiceDate'] as String? ?? '',
        dueDate: j['dueDate'] as String? ?? '',
        poNumber: j['poNumber'] as String? ?? '',
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
        taxType: _parseTaxType(j['taxType'] as String? ?? 'cgst_sgst'),
        gstRate: j['gstRate'] as String? ?? '18',
        items: j['items'] != null
            ? (j['items'] as List)
                .map((i) => InvoiceItem.fromJson(i as Map<String, dynamic>))
                .toList()
            : [InvoiceItem()],
        notes: j['notes'] as String? ?? '',
        terms: j['terms'] as String? ?? 'Payment due within 30 days.',
        signature: j['signature'] as String?,
        logo: j['logo'] as String?,
        showHsn: j['showHSN'] as bool? ?? false,
        showDiscount: j['showDiscount'] as bool? ?? false,
        templateColor: j['templateColor'] as String? ?? '#0D9488',
        templateName: j['templateName'] as String? ?? 'Classic',
      );

  factory InvoiceForm.fromJsonString(String s) =>
      InvoiceForm.fromJson(jsonDecode(s) as Map<String, dynamic>);

  static String _taxTypeToString(TaxType t) => switch (t) {
        TaxType.cgstSgst => 'cgst_sgst',
        TaxType.igst => 'igst',
        TaxType.none => 'none',
      };

  static TaxType _parseTaxType(String s) => switch (s) {
        'igst' => TaxType.igst,
        'none' => TaxType.none,
        _ => TaxType.cgstSgst,
      };
}

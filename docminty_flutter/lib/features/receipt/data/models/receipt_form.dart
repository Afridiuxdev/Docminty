import 'dart:convert';

class ReceiptForm {
  ReceiptForm({
    this.receiptNumber = 'REC-2026-001',
    this.receiptDate = '',
    this.fromName = '',
    this.fromAddress = '',
    this.fromCity = '',
    this.fromState = '',
    this.fromPhone = '',
    this.fromEmail = '',
    this.receivedFrom = '',
    this.receivedFromAddress = '',
    this.amount = '',
    this.paymentMode = 'UPI',
    this.purpose = '',
    this.notes = '',
  });

  String receiptNumber;
  String receiptDate;
  String fromName;
  String fromAddress;
  String fromCity;
  String fromState;
  String fromPhone;
  String fromEmail;
  String receivedFrom;
  String receivedFromAddress;
  String amount;
  String paymentMode;
  String purpose;
  String notes;

  static const List<String> paymentModes = [
    'UPI', 'NEFT', 'RTGS', 'Cash', 'Cheque', 'Credit Card', 'Debit Card', 'Bank Transfer'
  ];

  Map<String, dynamic> toJson() => {
        'receiptNumber': receiptNumber,
        'receiptDate': receiptDate,
        'fromName': fromName,
        'fromAddress': fromAddress,
        'fromCity': fromCity,
        'fromState': fromState,
        'fromPhone': fromPhone,
        'fromEmail': fromEmail,
        'receivedFrom': receivedFrom,
        'receivedFromAddress': receivedFromAddress,
        'amount': amount,
        'paymentMode': paymentMode,
        'purpose': purpose,
        'notes': notes,
      };

  String toJsonString() => jsonEncode(toJson());

  factory ReceiptForm.fromJson(Map<String, dynamic> j) => ReceiptForm(
        receiptNumber: j['receiptNumber'] as String? ?? 'REC-2026-001',
        receiptDate: j['receiptDate'] as String? ?? '',
        fromName: j['fromName'] as String? ?? '',
        fromAddress: j['fromAddress'] as String? ?? '',
        fromCity: j['fromCity'] as String? ?? '',
        fromState: j['fromState'] as String? ?? '',
        fromPhone: j['fromPhone'] as String? ?? '',
        fromEmail: j['fromEmail'] as String? ?? '',
        receivedFrom: j['receivedFrom'] as String? ?? '',
        receivedFromAddress: j['receivedFromAddress'] as String? ?? '',
        amount: j['amount'] as String? ?? '',
        paymentMode: j['paymentMode'] as String? ?? 'UPI',
        purpose: j['purpose'] as String? ?? '',
        notes: j['notes'] as String? ?? '',
      );

  factory ReceiptForm.fromJsonString(String s) =>
      ReceiptForm.fromJson(jsonDecode(s) as Map<String, dynamic>);
}

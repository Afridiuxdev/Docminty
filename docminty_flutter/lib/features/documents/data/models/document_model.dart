import 'dart:convert';

class DocumentModel {
  const DocumentModel({
    required this.id,
    required this.docType,
    required this.title,
    required this.templateName,
    this.referenceNumber,
    this.partyName,
    this.amount,
    this.formData,
    this.createdAt,
  });

  final int id;
  final String docType;
  final String title;
  final String templateName;
  final String? referenceNumber;
  final String? partyName;
  final double? amount;
  final String? formData; // JSON string of the full form
  final DateTime? createdAt;

  Map<String, dynamic> get parsedFormData =>
      formData != null ? jsonDecode(formData!) as Map<String, dynamic> : {};

  factory DocumentModel.fromJson(Map<String, dynamic> j) => DocumentModel(
        id: j['id'] as int,
        docType: j['docType'] as String,
        title: j['title'] as String,
        templateName: j['templateName'] as String? ?? 'Classic',
        referenceNumber: j['referenceNumber'] as String?,
        partyName: j['partyName'] as String?,
        amount: (j['amount'] as num?)?.toDouble(),
        formData: j['formData'] as String?,
        createdAt: j['createdAt'] != null
            ? DateTime.tryParse(j['createdAt'] as String)
            : null,
      );

  // Maps to web docType strings
  String get displayName => switch (docType) {
        'invoice' => 'Invoice',
        'quotation' => 'Quotation',
        'receipt' => 'Receipt',
        'salary-slip' => 'Salary Slip',
        'experience-letter' => 'Experience Letter',
        'resignation-letter' => 'Resignation Letter',
        'job-offer-letter' => 'Job Offer Letter',
        'certificate' => 'Certificate',
        'internship-certificate' => 'Internship Certificate',
        'purchase-order' => 'Purchase Order',
        'payment-voucher' => 'Payment Voucher',
        'packing-slip' => 'Packing Slip',
        'proforma-invoice' => 'Proforma Invoice',
        'rent-receipt' => 'Rent Receipt',
        _ => docType,
      };
}

class SaveDocumentRequest {
  const SaveDocumentRequest({
    required this.docType,
    required this.title,
    required this.templateName,
    this.referenceNumber,
    this.partyName,
    this.amount,
    required this.formData,
  });

  final String docType;
  final String title;
  final String templateName;
  final String? referenceNumber;
  final String? partyName;
  final double? amount;
  final String formData; // jsonEncode of form map

  Map<String, dynamic> toJson() => {
        'docType': docType,
        'title': title,
        'templateName': templateName,
        'referenceNumber': referenceNumber,
        'partyName': partyName,
        'amount': amount,
        'formData': formData,
      };
}

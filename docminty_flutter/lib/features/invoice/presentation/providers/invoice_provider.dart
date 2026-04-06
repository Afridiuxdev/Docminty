import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/invoice_form.dart';

/// Holds mutable form state during invoice creation/editing.
/// Uses StateNotifier so every field update triggers a rebuild only
/// in widgets that watch this provider.
class InvoiceFormNotifier extends StateNotifier<InvoiceForm> {
  InvoiceFormNotifier([InvoiceForm? initial])
      : super(initial ?? InvoiceForm());

  void update(InvoiceForm Function(InvoiceForm f) updater) {
    state = updater(state);
  }

  void setField(String field, dynamic value) {
    final f = state;
    state = switch (field) {
      'invoiceNumber' => _clone(f, invoiceNumber: value as String),
      'invoiceDate' => _clone(f, invoiceDate: value as String),
      'dueDate' => _clone(f, dueDate: value as String),
      'poNumber' => _clone(f, poNumber: value as String),
      'fromName' => _clone(f, fromName: value as String),
      'fromGstin' => _clone(f, fromGstin: value as String),
      'fromAddress' => _clone(f, fromAddress: value as String),
      'fromCity' => _clone(f, fromCity: value as String),
      'fromState' => _clone(f, fromState: value as String),
      'fromPhone' => _clone(f, fromPhone: value as String),
      'fromEmail' => _clone(f, fromEmail: value as String),
      'toName' => _clone(f, toName: value as String),
      'toGstin' => _clone(f, toGstin: value as String),
      'toAddress' => _clone(f, toAddress: value as String),
      'toCity' => _clone(f, toCity: value as String),
      'toState' => _clone(f, toState: value as String),
      'toPhone' => _clone(f, toPhone: value as String),
      'toEmail' => _clone(f, toEmail: value as String),
      'taxType' => _clone(f, taxType: value as TaxType),
      'gstRate' => _clone(f, gstRate: value as String),
      'notes' => _clone(f, notes: value as String),
      'terms' => _clone(f, terms: value as String),
      'signature' => _clone(f, signature: value as String?),
      'logo' => _clone(f, logo: value as String?),
      'showHsn' => _clone(f, showHsn: value as bool),
      'showDiscount' => _clone(f, showDiscount: value as bool),
      'templateColor' => _clone(f, templateColor: value as String),
      'templateName' => _clone(f, templateName: value as String),
      _ => f,
    };
  }

  void updateItem(int index, InvoiceItem Function(InvoiceItem i) updater) {
    final items = List<InvoiceItem>.from(state.items);
    items[index] = updater(items[index]);
    state = _clone(state, items: items);
  }

  void addItem() {
    state = _clone(state, items: [...state.items, InvoiceItem()]);
  }

  void removeItem(int index) {
    if (state.items.length <= 1) return;
    final items = List<InvoiceItem>.from(state.items)..removeAt(index);
    state = _clone(state, items: items);
  }

  void reset() => state = InvoiceForm();

  void loadFromSaved(InvoiceForm form) => state = form;

  // Immutable clone helper
  static InvoiceForm _clone(
    InvoiceForm f, {
    String? invoiceNumber,
    String? invoiceDate,
    String? dueDate,
    String? poNumber,
    String? fromName,
    String? fromGstin,
    String? fromAddress,
    String? fromCity,
    String? fromState,
    String? fromPhone,
    String? fromEmail,
    String? toName,
    String? toGstin,
    String? toAddress,
    String? toCity,
    String? toState,
    String? toPhone,
    String? toEmail,
    TaxType? taxType,
    String? gstRate,
    List<InvoiceItem>? items,
    String? notes,
    String? terms,
    String? signature,
    String? logo,
    bool? showHsn,
    bool? showDiscount,
    String? templateColor,
    String? templateName,
  }) =>
      InvoiceForm(
        invoiceNumber: invoiceNumber ?? f.invoiceNumber,
        invoiceDate: invoiceDate ?? f.invoiceDate,
        dueDate: dueDate ?? f.dueDate,
        poNumber: poNumber ?? f.poNumber,
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
        gstRate: gstRate ?? f.gstRate,
        items: items ?? List<InvoiceItem>.from(f.items),
        notes: notes ?? f.notes,
        terms: terms ?? f.terms,
        signature: signature ?? f.signature,
        logo: logo ?? f.logo,
        showHsn: showHsn ?? f.showHsn,
        showDiscount: showDiscount ?? f.showDiscount,
        templateColor: templateColor ?? f.templateColor,
        templateName: templateName ?? f.templateName,
      );
}

final invoiceFormProvider =
    StateNotifierProvider.autoDispose<InvoiceFormNotifier, InvoiceForm>(
  (ref) => InvoiceFormNotifier(),
);

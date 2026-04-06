import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/quotation_form.dart';

class QuotationFormNotifier extends StateNotifier<QuotationForm> {
  QuotationFormNotifier() : super(QuotationForm());

  void update(QuotationForm Function(QuotationForm f) updater) {
    state = updater(state);
  }

  void setItems(List<InvoiceItem> items) {
    state = QuotationForm(
      quoteNumber: state.quoteNumber,
      quoteDate: state.quoteDate,
      validUntil: state.validUntil,
      fromName: state.fromName,
      fromGstin: state.fromGstin,
      fromAddress: state.fromAddress,
      fromCity: state.fromCity,
      fromState: state.fromState,
      fromPhone: state.fromPhone,
      fromEmail: state.fromEmail,
      toName: state.toName,
      toGstin: state.toGstin,
      toAddress: state.toAddress,
      toCity: state.toCity,
      toState: state.toState,
      toPhone: state.toPhone,
      toEmail: state.toEmail,
      taxType: state.taxType,
      items: items,
      notes: state.notes,
      terms: state.terms,
      showHsn: state.showHsn,
      showDiscount: state.showDiscount,
      templateColor: state.templateColor,
      templateName: state.templateName,
    );
  }

  void updateItem(int index, InvoiceItem Function(InvoiceItem i) fn) {
    final items = List<InvoiceItem>.from(state.items);
    items[index] = fn(items[index]);
    setItems(items);
  }

  void addItem() => setItems([...state.items, InvoiceItem()]);

  void removeItem(int index) {
    if (state.items.length <= 1) return;
    final items = List<InvoiceItem>.from(state.items)..removeAt(index);
    setItems(items);
  }

  void reset() => state = QuotationForm();
  void load(QuotationForm form) => state = form;
}

final quotationFormProvider =
    StateNotifierProvider.autoDispose<QuotationFormNotifier, QuotationForm>(
  (ref) => QuotationFormNotifier(),
);

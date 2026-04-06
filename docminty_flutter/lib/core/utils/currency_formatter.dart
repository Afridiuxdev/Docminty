import 'package:intl/intl.dart';

class CurrencyFormatter {
  CurrencyFormatter._();

  static final _fmt = NumberFormat('#,##,##0.00', 'en_IN');
  static final _fmtNoDecimal = NumberFormat('#,##,##0', 'en_IN');

  /// Returns "Rs. 1,00,000.00"
  static String format(double amount) => 'Rs. ${_fmt.format(amount)}';

  /// Returns "Rs. 1,00,000"
  static String formatNoDecimal(double amount) =>
      'Rs. ${_fmtNoDecimal.format(amount)}';

  /// Returns "1,00,000.00" (no prefix)
  static String formatRaw(double amount) => _fmt.format(amount);

  static double parse(String s) =>
      double.tryParse(s.replaceAll(',', '').replaceAll('Rs. ', '')) ?? 0.0;
}

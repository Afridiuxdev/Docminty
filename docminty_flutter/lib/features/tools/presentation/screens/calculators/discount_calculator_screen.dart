import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class DiscountCalculatorScreen extends StatefulWidget {
  const DiscountCalculatorScreen({super.key});
  @override
  State<DiscountCalculatorScreen> createState() =>
      _DiscountCalculatorScreenState();
}

class _DiscountCalculatorScreenState extends State<DiscountCalculatorScreen> {
  final _priceCtrl = TextEditingController();
  final _discountCtrl = TextEditingController();
  String _mode = 'percent'; // percent | amount | find_pct

  Map<String, double>? _result;
  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');

  void _calculate() {
    final price = double.tryParse(_priceCtrl.text.replaceAll(',', ''));
    final discount = double.tryParse(_discountCtrl.text.replaceAll(',', ''));
    if (price == null || discount == null || price <= 0 || discount < 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Enter valid values'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    FocusScope.of(context).unfocus();

    double discountAmount, finalPrice, pct;
    if (_mode == 'percent') {
      pct = discount.clamp(0, 100);
      discountAmount = price * pct / 100;
      finalPrice = price - discountAmount;
    } else if (_mode == 'amount') {
      discountAmount = discount.clamp(0, price);
      finalPrice = price - discountAmount;
      pct = discountAmount / price * 100;
    } else {
      // find_pct: price is original, discount field is final price
      finalPrice = discount.clamp(0, price);
      discountAmount = price - finalPrice;
      pct = discountAmount / price * 100;
    }

    setState(() => _result = {
          'original': price,
          'discount_amount': discountAmount,
          'final_price': finalPrice,
          'pct': pct,
          'savings': discountAmount,
        });
  }

  @override
  void dispose() {
    _priceCtrl.dispose();
    _discountCtrl.dispose();
    super.dispose();
  }

  String get _secondLabel => switch (_mode) {
        'percent' => 'Discount Percentage (%)',
        'amount' => 'Discount Amount (₹)',
        _ => 'Final Price After Discount (₹)',
      };

  String get _secondHint => switch (_mode) {
        'percent' => '20',
        'amount' => '500',
        _ => '8,000',
      };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('Discount Calculator')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Mode
                  Text('Calculate', style: AppTextStyles.label),
                  const SizedBox(height: 8),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _ModeBtn('From %', 'percent', _mode, (v) {
                          setState(() {
                            _mode = v;
                            _result = null;
                            _discountCtrl.clear();
                          });
                        }),
                        const SizedBox(width: 8),
                        _ModeBtn('From Amount', 'amount', _mode, (v) {
                          setState(() {
                            _mode = v;
                            _result = null;
                            _discountCtrl.clear();
                          });
                        }),
                        const SizedBox(width: 8),
                        _ModeBtn('Find Discount %', 'find_pct', _mode, (v) {
                          setState(() {
                            _mode = v;
                            _result = null;
                            _discountCtrl.clear();
                          });
                        }),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: 'Original Price (₹)',
                    hint: '10,000',
                    controller: _priceCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: _secondLabel,
                    hint: _secondHint,
                    controller: _discountCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppButton(
                    label: 'Calculate',
                    onPressed: _calculate,
                    width: double.infinity,
                  ),
                ],
              ),
            ),
            if (_result != null) ...[
              const SizedBox(height: AppSpacing.lg),
              // Main result
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.xl),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF10B981), Color(0xFF059669)],
                  ),
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                ),
                child: Column(
                  children: [
                    const Text('Final Price',
                        style: TextStyle(
                            fontFamily: 'Inter',
                            color: Colors.white70,
                            fontSize: 13)),
                    const SizedBox(height: 4),
                    Text('₹${_fmt.format(_result!['final_price']!)}',
                        style: const TextStyle(
                          fontFamily: 'SpaceGrotesk',
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        )),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                      child: Text(
                        'Save ₹${_fmt.format(_result!['savings']!)} (${_result!['pct']!.toStringAsFixed(1)}% off)',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.base),
              AppCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(
                  children: [
                    _Row('Original Price',
                        '₹${_fmt.format(_result!['original']!)}',
                        AppColors.textPrimary),
                    _Row('Discount (${_result!['pct']!.toStringAsFixed(1)}%)',
                        '-₹${_fmt.format(_result!['discount_amount']!)}',
                        AppColors.error),
                    const Divider(),
                    _Row('You Pay',
                        '₹${_fmt.format(_result!['final_price']!)}',
                        AppColors.success,
                        bold: true),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}

class _ModeBtn extends StatelessWidget {
  const _ModeBtn(this.label, this.value, this.current, this.onTap);
  final String label;
  final String value;
  final String current;
  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    final sel = current == value;
    return GestureDetector(
      onTap: () => onTap(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: sel ? AppColors.secondary : AppColors.bgPage,
          borderRadius: BorderRadius.circular(AppRadius.full),
          border:
              Border.all(color: sel ? AppColors.secondary : AppColors.border),
        ),
        child: Text(label,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: sel ? Colors.white : AppColors.textSecondary,
            )),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row(this.label, this.value, this.color, {this.bold = false});
  final String label;
  final String value;
  final Color color;
  final bool bold;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: AppTextStyles.body),
            Text(value,
                style: AppTextStyles.body.copyWith(
                    color: color,
                    fontWeight:
                        bold ? FontWeight.w800 : FontWeight.w600)),
          ],
        ),
      );
}

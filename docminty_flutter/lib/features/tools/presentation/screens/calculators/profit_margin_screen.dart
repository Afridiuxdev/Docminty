import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class ProfitMarginScreen extends StatefulWidget {
  const ProfitMarginScreen({super.key});
  @override
  State<ProfitMarginScreen> createState() => _ProfitMarginScreenState();
}

class _ProfitMarginScreenState extends State<ProfitMarginScreen> {
  final _costCtrl = TextEditingController();
  final _revenueCtrl = TextEditingController();

  Map<String, double>? _result;
  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');

  void _calculate() {
    final cost = double.tryParse(_costCtrl.text.replaceAll(',', ''));
    final revenue = double.tryParse(_revenueCtrl.text.replaceAll(',', ''));
    if (cost == null || revenue == null || cost <= 0 || revenue <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Enter valid values'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    FocusScope.of(context).unfocus();
    final profit = revenue - cost;
    final grossMargin = profit / revenue * 100;
    final markup = profit / cost * 100;
    setState(() => _result = {
          'cost': cost,
          'revenue': revenue,
          'profit': profit,
          'gross_margin': grossMargin,
          'markup': markup,
        });
  }

  void _reset() {
    _costCtrl.clear();
    _revenueCtrl.clear();
    setState(() => _result = null);
  }

  @override
  void dispose() {
    _costCtrl.dispose();
    _revenueCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isProfit = _result != null && _result!['profit']! >= 0;

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Profit Margin Calculator'),
        actions: [TextButton(onPressed: _reset, child: const Text('Reset'))],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                children: [
                  AppTextField(
                    label: 'Cost / Buying Price (₹)',
                    hint: '8,000',
                    controller: _costCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: 'Selling Price / Revenue (₹)',
                    hint: '12,000',
                    controller: _revenueCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppButton(
                    label: 'Calculate Profit Margin',
                    onPressed: _calculate,
                    width: double.infinity,
                  ),
                ],
              ),
            ),
            if (_result != null) ...[
              const SizedBox(height: AppSpacing.lg),
              Row(
                children: [
                  Expanded(
                    child: _BigCard(
                      label: 'Gross Margin',
                      value:
                          '${_result!['gross_margin']!.toStringAsFixed(2)}%',
                      color: isProfit ? AppColors.success : AppColors.error,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _BigCard(
                      label: 'Markup',
                      value: '${_result!['markup']!.toStringAsFixed(2)}%',
                      color: AppColors.secondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.base),
              AppCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(
                  children: [
                    _Row('Cost Price', '₹${_fmt.format(_result!['cost']!)}',
                        AppColors.textPrimary),
                    _Row('Selling Price',
                        '₹${_fmt.format(_result!['revenue']!)}',
                        AppColors.secondary),
                    const Divider(),
                    _Row(
                      isProfit ? 'Profit' : 'Loss',
                      '₹${_fmt.format(_result!['profit']!.abs())}',
                      isProfit ? AppColors.success : AppColors.error,
                      bold: true,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.base),
              AppCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                color: isProfit
                    ? const Color(0xFFF0FDF4)
                    : const Color(0xFFFFF1F2),
                borderColor:
                    isProfit ? AppColors.success : AppColors.error,
                child: Row(
                  children: [
                    Icon(
                      isProfit
                          ? Icons.trending_up_rounded
                          : Icons.trending_down_rounded,
                      color: isProfit ? AppColors.success : AppColors.error,
                      size: 24,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        isProfit
                            ? 'You make ₹${_fmt.format(_result!['profit']!)} profit on each unit sold.'
                            : 'You are losing ₹${_fmt.format(_result!['profit']!.abs())} per unit sold.',
                        style: AppTextStyles.body.copyWith(
                          color: isProfit ? AppColors.success : AppColors.error,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
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

class _BigCard extends StatelessWidget {
  const _BigCard(
      {required this.label, required this.value, required this.color});
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) => AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            Text(label, style: AppTextStyles.caption),
            const SizedBox(height: 6),
            Text(value,
                style: AppTextStyles.h3.copyWith(color: color),
                textAlign: TextAlign.center),
          ],
        ),
      );
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

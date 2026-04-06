import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class SalaryCalculatorScreen extends StatefulWidget {
  const SalaryCalculatorScreen({super.key});
  @override
  State<SalaryCalculatorScreen> createState() =>
      _SalaryCalculatorScreenState();
}

class _SalaryCalculatorScreenState extends State<SalaryCalculatorScreen> {
  final _ctcCtrl = TextEditingController();
  double _pfPct = 12; // Employee PF %
  double _taxPct = 10; // Income tax %
  double _basicPct = 40; // Basic as % of CTC

  Map<String, double>? _result;
  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');

  void _calculate() {
    final ctc = double.tryParse(_ctcCtrl.text.replaceAll(',', ''));
    if (ctc == null || ctc <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Enter a valid CTC'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    FocusScope.of(context).unfocus();

    final monthly = ctc / 12;
    final basic = monthly * _basicPct / 100;
    final hra = basic * 0.5; // 50% of basic
    final da = basic * 0.1; // 10% DA
    final special = monthly - basic - hra - da;
    final pf = basic * _pfPct / 100;
    final gross = monthly;
    final tax = monthly * _taxPct / 100 / 12;
    final netMonthly = gross - pf - tax;

    setState(() {
      _result = {
        'CTC (Annual)': ctc,
        'Gross Monthly': gross,
        'Basic': basic,
        'HRA': hra,
        'DA': da,
        'Special Allowance': special,
        'PF Deduction': pf,
        'Income Tax (est.)': tax,
        'Net Take-Home': netMonthly,
        'Net Annual': netMonthly * 12,
      };
    });
  }

  @override
  void dispose() {
    _ctcCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('Salary Calculator')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                children: [
                  AppTextField(
                    label: 'Annual CTC (₹)',
                    hint: '12,00,000',
                    controller: _ctcCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  _Slider(
                    label: 'Basic Salary',
                    value: _basicPct,
                    pct: '${_basicPct.toInt()}% of CTC',
                    min: 30,
                    max: 60,
                    onChanged: (v) => setState(() => _basicPct = v),
                  ),
                  _Slider(
                    label: 'PF Contribution',
                    value: _pfPct,
                    pct: '${_pfPct.toInt()}% of Basic',
                    min: 0,
                    max: 12,
                    onChanged: (v) => setState(() => _pfPct = v),
                  ),
                  _Slider(
                    label: 'Income Tax (est.)',
                    value: _taxPct,
                    pct: '${_taxPct.toInt()}% of CTC',
                    min: 0,
                    max: 30,
                    onChanged: (v) => setState(() => _taxPct = v),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  AppButton(
                    label: 'Calculate Salary Breakdown',
                    onPressed: _calculate,
                    width: double.infinity,
                  ),
                ],
              ),
            ),
            if (_result != null) ...[
              const SizedBox(height: AppSpacing.lg),
              // Highlight
              _HighlightCard(
                label: 'Monthly Take-Home',
                value: '₹${_fmt.format(_result!['Net Take-Home']!)}',
                sub:
                    'Annual: ₹${_fmt.format(_result!['Net Annual']!)}',
              ),
              const SizedBox(height: AppSpacing.base),
              AppCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Earnings', style: AppTextStyles.h4),
                    const SizedBox(height: 8),
                    _Row('Basic', _result!['Basic']!),
                    _Row('HRA', _result!['HRA']!),
                    _Row('DA', _result!['DA']!),
                    _Row('Special Allowance',
                        _result!['Special Allowance']!),
                    const Divider(),
                    _Row('Gross Monthly', _result!['Gross Monthly']!,
                        bold: true),
                    const SizedBox(height: AppSpacing.base),
                    Text('Deductions', style: AppTextStyles.h4),
                    const SizedBox(height: 8),
                    _Row('PF', _result!['PF Deduction']!,
                        color: AppColors.error),
                    _Row('Income Tax', _result!['Income Tax (est.)']!,
                        color: AppColors.error),
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

class _Slider extends StatelessWidget {
  const _Slider({
    required this.label,
    required this.value,
    required this.pct,
    required this.min,
    required this.max,
    required this.onChanged,
  });
  final String label;
  final double value;
  final String pct;
  final double min;
  final double max;
  final ValueChanged<double> onChanged;

  @override
  Widget build(BuildContext context) => Column(
        children: [
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: AppTextStyles.body),
              Text(pct,
                  style: AppTextStyles.body.copyWith(
                      color: AppColors.secondary,
                      fontWeight: FontWeight.w700)),
            ],
          ),
          Slider(
            value: value,
            min: min,
            max: max,
            divisions: (max - min).toInt(),
            activeColor: AppColors.secondary,
            onChanged: onChanged,
          ),
        ],
      );
}

class _HighlightCard extends StatelessWidget {
  const _HighlightCard(
      {required this.label, required this.value, required this.sub});
  final String label;
  final String value;
  final String sub;

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.xl),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [AppColors.primary, AppColors.secondary],
          ),
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: Column(
          children: [
            Text(label,
                style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    color: Colors.white70)),
            const SizedBox(height: 4),
            Text(value,
                style: const TextStyle(
                  fontFamily: 'SpaceGrotesk',
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                )),
            Text(sub,
                style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12,
                    color: Colors.white70)),
          ],
        ),
      );
}

class _Row extends StatelessWidget {
  const _Row(this.label, this.amount,
      {this.bold = false, this.color = AppColors.textPrimary});
  final String label;
  final double amount;
  final bool bold;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final fmt = NumberFormat('#,##,##0.00', 'en_IN');
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTextStyles.body),
          Text('₹${fmt.format(amount)}',
              style: AppTextStyles.body.copyWith(
                  color: color,
                  fontWeight:
                      bold ? FontWeight.w800 : FontWeight.w600)),
        ],
      ),
    );
  }
}

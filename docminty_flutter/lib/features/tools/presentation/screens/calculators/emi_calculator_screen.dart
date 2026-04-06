import 'dart:math';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class EmiCalculatorScreen extends StatefulWidget {
  const EmiCalculatorScreen({super.key});
  @override
  State<EmiCalculatorScreen> createState() => _EmiCalculatorScreenState();
}

class _EmiCalculatorScreenState extends State<EmiCalculatorScreen> {
  final _principalCtrl = TextEditingController();
  final _rateCtrl = TextEditingController();
  final _tenureCtrl = TextEditingController();
  String _tenureType = 'Years';

  double? _emi;
  double? _totalPayment;
  double? _totalInterest;

  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');

  void _calculate() {
    final p = double.tryParse(_principalCtrl.text.replaceAll(',', ''));
    final r = double.tryParse(_rateCtrl.text);
    var n = int.tryParse(_tenureCtrl.text);
    if (p == null || r == null || n == null || p <= 0 || r <= 0 || n <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Please enter valid values'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    if (_tenureType == 'Years') n = n * 12;
    final monthlyRate = r / (12 * 100);
    final nMonths = n.toDouble();
    final emi = p *
        monthlyRate *
        pow(1 + monthlyRate, nMonths) /
        (pow(1 + monthlyRate, nMonths) - 1);
    setState(() {
      _emi = emi;
      _totalPayment = emi * nMonths;
      _totalInterest = emi * nMonths - p;
    });
    FocusScope.of(context).unfocus();
  }

  void _reset() {
    _principalCtrl.clear();
    _rateCtrl.clear();
    _tenureCtrl.clear();
    setState(() {
      _emi = null;
      _totalPayment = null;
      _totalInterest = null;
    });
  }

  @override
  void dispose() {
    _principalCtrl.dispose();
    _rateCtrl.dispose();
    _tenureCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final principal = double.tryParse(
            _principalCtrl.text.replaceAll(',', '')) ??
        0;
    final interestPct = _totalPayment != null && _totalPayment! > 0
        ? (_totalInterest! / _totalPayment! * 100)
        : 0.0;

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('EMI Calculator'),
        actions: [
          TextButton(
              onPressed: _reset, child: const Text('Reset'))
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                children: [
                  AppTextField(
                    label: 'Loan Amount (₹)',
                    hint: '10,00,000',
                    controller: _principalCtrl,
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: 'Annual Interest Rate (%)',
                    hint: '8.5',
                    controller: _rateCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Expanded(
                        child: AppTextField(
                          label: 'Tenure',
                          hint: '20',
                          controller: _tenureCtrl,
                          keyboardType: TextInputType.number,
                        ),
                      ),
                      const SizedBox(width: 10),
                      DropdownButton<String>(
                        value: _tenureType,
                        underline: const SizedBox(),
                        items: ['Years', 'Months']
                            .map((t) =>
                                DropdownMenuItem(value: t, child: Text(t)))
                            .toList(),
                        onChanged: (v) =>
                            setState(() => _tenureType = v!),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppButton(
                    label: 'Calculate EMI',
                    onPressed: _calculate,
                    width: double.infinity,
                  ),
                ],
              ),
            ),
            if (_emi != null) ...[
              const SizedBox(height: AppSpacing.lg),
              _ResultCard(
                emi: _emi!,
                totalPayment: _totalPayment!,
                totalInterest: _totalInterest!,
                principal: principal,
                interestPct: interestPct,
                fmt: _fmt,
              ),
            ],
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({
    required this.emi,
    required this.totalPayment,
    required this.totalInterest,
    required this.principal,
    required this.interestPct,
    required this.fmt,
  });
  final double emi;
  final double totalPayment;
  final double totalInterest;
  final double principal;
  final double interestPct;
  final NumberFormat fmt;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // EMI highlight
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.xl),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.secondary],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.lg),
          ),
          child: Column(
            children: [
              const Text('Monthly EMI',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    color: Colors.white70,
                  )),
              const SizedBox(height: 6),
              Text(
                '₹${fmt.format(emi)}',
                style: const TextStyle(
                  fontFamily: 'SpaceGrotesk',
                  fontSize: 36,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.base),

        // Breakdown
        AppCard(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            children: [
              _Row('Principal Amount', '₹${fmt.format(principal)}',
                  AppColors.secondary),
              _Row('Total Interest', '₹${fmt.format(totalInterest)}',
                  AppColors.error),
              const Divider(),
              _Row('Total Payment', '₹${fmt.format(totalPayment)}',
                  AppColors.textPrimary,
                  bold: true),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.base),

        // Progress bar
        AppCard(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Principal',
                      style: AppTextStyles.caption
                          .copyWith(color: AppColors.secondary)),
                  Text('Interest',
                      style: AppTextStyles.caption
                          .copyWith(color: AppColors.error)),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(AppRadius.full),
                child: LinearProgressIndicator(
                  value: (100 - interestPct) / 100,
                  minHeight: 12,
                  backgroundColor: AppColors.error.withValues(alpha: 0.2),
                  valueColor: const AlwaysStoppedAnimation(AppColors.secondary),
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                      '${(100 - interestPct).toStringAsFixed(1)}%',
                      style: AppTextStyles.caption
                          .copyWith(color: AppColors.secondary)),
                  Text('${interestPct.toStringAsFixed(1)}%',
                      style: AppTextStyles.caption
                          .copyWith(color: AppColors.error)),
                ],
              ),
            ],
          ),
        ),
      ],
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
                      bold ? FontWeight.w800 : FontWeight.w700,
                )),
          ],
        ),
      );
}

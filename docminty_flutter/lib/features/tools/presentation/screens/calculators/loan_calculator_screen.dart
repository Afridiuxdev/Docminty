import 'dart:math';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class LoanCalculatorScreen extends StatefulWidget {
  const LoanCalculatorScreen({super.key});
  @override
  State<LoanCalculatorScreen> createState() => _LoanCalculatorScreenState();
}

class _LoanCalculatorScreenState extends State<LoanCalculatorScreen> {
  final _loanCtrl = TextEditingController();
  final _rateCtrl = TextEditingController();
  final _tenureCtrl = TextEditingController();
  String _loanType = 'Home Loan';
  String _tenureType = 'Years';

  Map<String, dynamic>? _result;
  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');

  static const _loanTypes = [
    'Home Loan',
    'Car Loan',
    'Personal Loan',
    'Education Loan',
    'Business Loan',
  ];

  void _calculate() {
    final p = double.tryParse(_loanCtrl.text.replaceAll(',', ''));
    final r = double.tryParse(_rateCtrl.text);
    var n = int.tryParse(_tenureCtrl.text);
    if (p == null || r == null || n == null || p <= 0 || r <= 0 || n <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Enter valid values'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    FocusScope.of(context).unfocus();
    if (_tenureType == 'Years') n = n * 12;
    final monthlyRate = r / (12 * 100);
    final emi = p *
        monthlyRate *
        pow(1 + monthlyRate, n) /
        (pow(1 + monthlyRate, n) - 1);
    final total = emi * n;
    final interest = total - p;

    // Build amortization schedule (first 12 months)
    final schedule = <Map<String, double>>[];
    double balance = p;
    for (var i = 1; i <= n && i <= 12; i++) {
      final intPart = balance * monthlyRate;
      final prinPart = emi - intPart;
      balance -= prinPart;
      schedule.add({
        'month': i.toDouble(),
        'emi': emi,
        'principal': prinPart,
        'interest': intPart,
        'balance': balance < 0 ? 0 : balance,
      });
    }

    setState(() => _result = {
          'emi': emi,
          'total': total,
          'interest': interest,
          'principal': p,
          'schedule': schedule,
        });
  }

  @override
  void dispose() {
    _loanCtrl.dispose();
    _rateCtrl.dispose();
    _tenureCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('Loan Calculator')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Loan type chips
                  Text('Loan Type', style: AppTextStyles.label),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: _loanTypes.map((t) {
                      final sel = _loanType == t;
                      return GestureDetector(
                        onTap: () => setState(() => _loanType = t),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: sel
                                ? AppColors.secondary
                                : AppColors.bgPage,
                            borderRadius:
                                BorderRadius.circular(AppRadius.full),
                            border: Border.all(
                              color: sel
                                  ? AppColors.secondary
                                  : AppColors.border,
                            ),
                          ),
                          child: Text(t,
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: sel
                                    ? Colors.white
                                    : AppColors.textSecondary,
                              )),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: 'Loan Amount (₹)',
                    hint: '50,00,000',
                    controller: _loanCtrl,
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
                            .map((t) => DropdownMenuItem(
                                value: t, child: Text(t)))
                            .toList(),
                        onChanged: (v) =>
                            setState(() => _tenureType = v!),
                      ),
                    ],
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
              // EMI highlight
              Container(
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
                    Text(_loanType,
                        style: const TextStyle(
                            fontFamily: 'Inter',
                            color: Colors.white70,
                            fontSize: 12)),
                    const SizedBox(height: 4),
                    Text('₹${_fmt.format(_result!['emi'] as double)}',
                        style: const TextStyle(
                          fontFamily: 'SpaceGrotesk',
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        )),
                    const Text('Monthly EMI',
                        style: TextStyle(
                            fontFamily: 'Inter',
                            color: Colors.white70,
                            fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.base),
              Row(
                children: [
                  Expanded(
                      child: _MiniCard(
                          'Principal',
                          '₹${_fmt.format(_result!['principal'] as double)}',
                          AppColors.secondary)),
                  const SizedBox(width: 8),
                  Expanded(
                      child: _MiniCard(
                          'Total Interest',
                          '₹${_fmt.format(_result!['interest'] as double)}',
                          AppColors.error)),
                ],
              ),
              const SizedBox(height: AppSpacing.base),
              // Schedule preview
              Text('Amortization Schedule (First 12 months)',
                  style: AppTextStyles.h4),
              const SizedBox(height: 8),
              AppCard(
                padding: EdgeInsets.zero,
                child: Column(
                  children: [
                    _ScheduleHeader(),
                    ...(_result!['schedule'] as List<Map<String, double>>)
                        .map((row) => _ScheduleRow(row, _fmt)),
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

class _MiniCard extends StatelessWidget {
  const _MiniCard(this.label, this.value, this.color);
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) => AppCard(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Text(label, style: AppTextStyles.caption),
            const SizedBox(height: 4),
            Text(value,
                style: AppTextStyles.body
                    .copyWith(color: color, fontWeight: FontWeight.w700),
                textAlign: TextAlign.center),
          ],
        ),
      );
}

class _ScheduleHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.bgPage,
          borderRadius: const BorderRadius.vertical(
              top: Radius.circular(AppRadius.lg - 1)),
        ),
        child: Row(
          children: [
            _Cell('#', flex: 1),
            _Cell('Principal', flex: 2),
            _Cell('Interest', flex: 2),
            _Cell('Balance', flex: 3),
          ],
        ),
      );
}

class _ScheduleRow extends StatelessWidget {
  const _ScheduleRow(this.row, this.fmt);
  final Map<String, double> row;
  final NumberFormat fmt;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: const BoxDecoration(
          border: Border(
              bottom: BorderSide(color: AppColors.borderLight)),
        ),
        child: Row(
          children: [
            _Cell(row['month']!.toInt().toString(), flex: 1),
            _Cell('₹${fmt.format(row['principal']!)}', flex: 2),
            _Cell('₹${fmt.format(row['interest']!)}',
                flex: 2, color: AppColors.error),
            _Cell('₹${fmt.format(row['balance']!)}', flex: 3),
          ],
        ),
      );
}

class _Cell extends StatelessWidget {
  const _Cell(this.text, {required this.flex, this.color});
  final String text;
  final int flex;
  final Color? color;

  @override
  Widget build(BuildContext context) => Expanded(
        flex: flex,
        child: Text(text,
            style: AppTextStyles.caption.copyWith(
                color: color ?? AppColors.textSecondary, fontSize: 10),
            overflow: TextOverflow.ellipsis),
      );
}

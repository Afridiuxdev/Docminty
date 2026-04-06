import 'dart:math';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class InterestCalculatorScreen extends StatefulWidget {
  const InterestCalculatorScreen({super.key});
  @override
  State<InterestCalculatorScreen> createState() =>
      _InterestCalculatorScreenState();
}

class _InterestCalculatorScreenState
    extends State<InterestCalculatorScreen> {
  final _principalCtrl = TextEditingController();
  final _rateCtrl = TextEditingController();
  final _timeCtrl = TextEditingController();
  String _type = 'Compound'; // 'Simple' | 'Compound'
  String _compoundFreq = 'Annually'; // Annually | Monthly | Quarterly

  double? _si;
  double? _ci;
  double? _siTotal;
  double? _ciTotal;

  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');

  int get _n => switch (_compoundFreq) {
        'Monthly' => 12,
        'Quarterly' => 4,
        'Half-Yearly' => 2,
        _ => 1,
      };

  void _calculate() {
    final p = double.tryParse(_principalCtrl.text.replaceAll(',', ''));
    final r = double.tryParse(_rateCtrl.text);
    final t = double.tryParse(_timeCtrl.text);
    if (p == null || r == null || t == null || p <= 0 || r <= 0 || t <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Please enter valid values'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    FocusScope.of(context).unfocus();
    final si = p * r * t / 100;
    final ci = p * pow(1 + r / (100 * _n), _n * t) - p;
    setState(() {
      _si = si;
      _ci = ci;
      _siTotal = p + si;
      _ciTotal = p + ci;
    });
  }

  void _reset() {
    _principalCtrl.clear();
    _rateCtrl.clear();
    _timeCtrl.clear();
    setState(() {
      _si = null;
      _ci = null;
    });
  }

  @override
  void dispose() {
    _principalCtrl.dispose();
    _rateCtrl.dispose();
    _timeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Interest Calculator'),
        actions: [
          TextButton(onPressed: _reset, child: const Text('Reset'))
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppTextField(
                    label: 'Principal Amount (₹)',
                    hint: '1,00,000',
                    controller: _principalCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: 'Annual Interest Rate (%)',
                    hint: '8',
                    controller: _rateCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  AppTextField(
                    label: 'Time Period (Years)',
                    hint: '5',
                    controller: _timeCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  // Type toggle
                  Row(
                    children: ['Simple', 'Compound'].map((t) {
                      final sel = _type == t;
                      return Expanded(
                        child: Padding(
                          padding: EdgeInsets.only(
                              right: t == 'Simple' ? 6 : 0,
                              left: t == 'Compound' ? 6 : 0),
                          child: GestureDetector(
                            onTap: () => setState(() => _type = t),
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: sel
                                    ? AppColors.secondaryLight
                                    : AppColors.bgPage,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.md),
                                border: Border.all(
                                  color: sel
                                      ? AppColors.secondary
                                      : AppColors.border,
                                  width: sel ? 2 : 1,
                                ),
                              ),
                              child: Text(
                                '$t Interest',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: sel
                                      ? AppColors.secondary
                                      : AppColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  if (_type == 'Compound') ...[
                    const SizedBox(height: AppSpacing.base),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Compound Frequency',
                            style: AppTextStyles.body),
                        DropdownButton<String>(
                          value: _compoundFreq,
                          underline: const SizedBox(),
                          style: AppTextStyles.body
                              .copyWith(color: AppColors.secondary),
                          items: [
                            'Annually',
                            'Half-Yearly',
                            'Quarterly',
                            'Monthly'
                          ]
                              .map((f) => DropdownMenuItem(
                                  value: f, child: Text(f)))
                              .toList(),
                          onChanged: (v) =>
                              setState(() => _compoundFreq = v!),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: AppSpacing.base),
                  AppButton(
                    label: 'Calculate Interest',
                    onPressed: _calculate,
                    width: double.infinity,
                  ),
                ],
              ),
            ),
            if (_si != null) ...[
              const SizedBox(height: AppSpacing.lg),
              Row(
                children: [
                  Expanded(
                    child: _HighCard('Simple Interest',
                        '₹${_fmt.format(_si!)}', AppColors.info),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _HighCard('Compound Interest',
                        '₹${_fmt.format(_ci!)}', AppColors.secondary),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.base),
              AppCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(
                  children: [
                    _DetailRow(
                        'SI — Total Amount', '₹${_fmt.format(_siTotal!)}',
                        AppColors.info),
                    _DetailRow(
                        'CI — Total Amount', '₹${_fmt.format(_ciTotal!)}',
                        AppColors.secondary),
                    _DetailRow(
                        'Difference (CI - SI)',
                        '₹${_fmt.format(_ci! - _si!)}',
                        AppColors.success),
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

class _HighCard extends StatelessWidget {
  const _HighCard(this.label, this.value, this.color);
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) => AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            Text(label,
                style:
                    AppTextStyles.caption.copyWith(color: AppColors.textLight),
                textAlign: TextAlign.center),
            const SizedBox(height: 4),
            Text(value,
                style: AppTextStyles.h4.copyWith(color: color),
                textAlign: TextAlign.center),
          ],
        ),
      );
}

class _DetailRow extends StatelessWidget {
  const _DetailRow(this.label, this.value, this.color);
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: AppTextStyles.body),
            Text(value,
                style: AppTextStyles.body
                    .copyWith(color: color, fontWeight: FontWeight.w700)),
          ],
        ),
      );
}

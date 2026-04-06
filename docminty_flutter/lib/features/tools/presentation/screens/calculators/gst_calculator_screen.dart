import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../../../../core/widgets/app_text_field.dart';

class GstCalculatorScreen extends StatefulWidget {
  const GstCalculatorScreen({super.key});
  @override
  State<GstCalculatorScreen> createState() => _GstCalculatorScreenState();
}

class _GstCalculatorScreenState extends State<GstCalculatorScreen> {
  final _amountCtrl = TextEditingController();
  double _gstRate = 18;
  String _mode = 'exclusive'; // exclusive = add GST; inclusive = extract GST

  double? _gstAmount;
  double? _preGst;
  double? _postGst;

  final _fmt = NumberFormat('#,##,##0.00', 'en_IN');
  static const _rates = [0.0, 0.1, 0.25, 3.0, 5.0, 12.0, 18.0, 28.0];

  void _calculate() {
    final amount = double.tryParse(_amountCtrl.text.replaceAll(',', ''));
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Enter a valid amount'),
        backgroundColor: AppColors.error,
      ));
      return;
    }
    FocusScope.of(context).unfocus();
    setState(() {
      if (_mode == 'exclusive') {
        // Amount is pre-GST, add GST
        _preGst = amount;
        _gstAmount = amount * _gstRate / 100;
        _postGst = amount + _gstAmount!;
      } else {
        // Amount includes GST, extract it
        _postGst = amount;
        _preGst = amount * 100 / (100 + _gstRate);
        _gstAmount = amount - _preGst!;
      }
    });
  }

  void _reset() {
    _amountCtrl.clear();
    setState(() {
      _gstAmount = null;
      _preGst = null;
      _postGst = null;
    });
  }

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('GST Calculator'),
        actions: [
          TextButton(onPressed: _reset, child: const Text('Reset'))
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Mode toggle
                  Row(
                    children: [
                      Expanded(
                        child: _ModeBtn(
                          label: 'Add GST',
                          subtitle: 'GST exclusive',
                          selected: _mode == 'exclusive',
                          onTap: () => setState(() {
                            _mode = 'exclusive';
                            _gstAmount = null;
                          }),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _ModeBtn(
                          label: 'Remove GST',
                          subtitle: 'GST inclusive',
                          selected: _mode == 'inclusive',
                          onTap: () => setState(() {
                            _mode = 'inclusive';
                            _gstAmount = null;
                          }),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.base),

                  AppTextField(
                    label: _mode == 'exclusive'
                        ? 'Amount (before GST) ₹'
                        : 'Amount (including GST) ₹',
                    hint: '10,000',
                    controller: _amountCtrl,
                    keyboardType: const TextInputType.numberWithOptions(
                        decimal: true),
                  ),
                  const SizedBox(height: AppSpacing.base),

                  // GST Rate selector
                  Text('GST Rate', style: AppTextStyles.label),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _rates.map((r) {
                      final sel = _gstRate == r;
                      return GestureDetector(
                        onTap: () => setState(() {
                          _gstRate = r;
                          _gstAmount = null;
                        }),
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
                          child: Text(
                            r == 0 ? 'Nil' : '${r}%',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: sel
                                  ? Colors.white
                                  : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
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
            if (_gstAmount != null) ...[
              const SizedBox(height: AppSpacing.lg),
              AppCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(
                  children: [
                    _ResultRow('Pre-GST Amount',
                        '₹${_fmt.format(_preGst!)}', AppColors.textPrimary),
                    _ResultRow('CGST (${_gstRate / 2}%)',
                        '₹${_fmt.format(_gstAmount! / 2)}',
                        AppColors.info),
                    _ResultRow('SGST (${_gstRate / 2}%)',
                        '₹${_fmt.format(_gstAmount! / 2)}',
                        AppColors.info),
                    _ResultRow('Total GST ($_gstRate%)',
                        '₹${_fmt.format(_gstAmount!)}', AppColors.error),
                    const Divider(),
                    _ResultRow('Total Amount',
                        '₹${_fmt.format(_postGst!)}', AppColors.secondary,
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
  const _ModeBtn({
    required this.label,
    required this.subtitle,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: selected ? AppColors.secondaryLight : AppColors.bgPage,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(
              color: selected ? AppColors.secondary : AppColors.border,
              width: selected ? 2 : 1,
            ),
          ),
          child: Column(
            children: [
              Text(label,
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: selected
                        ? AppColors.secondary
                        : AppColors.textSecondary,
                  )),
              Text(subtitle,
                  style: AppTextStyles.caption, textAlign: TextAlign.center),
            ],
          ),
        ),
      );
}

class _ResultRow extends StatelessWidget {
  const _ResultRow(this.label, this.value, this.color, {this.bold = false});
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

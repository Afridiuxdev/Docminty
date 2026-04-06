import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/indian_states.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../data/models/invoice_form.dart';
import '../providers/invoice_provider.dart';

/// Single entry point — renders different content per [tabIndex]
class InvoiceFormTab extends ConsumerWidget {
  const InvoiceFormTab({super.key, required this.tabIndex});
  final int tabIndex;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return switch (tabIndex) {
      0 => const _YourDetailsTab(),
      1 => const _ClientTab(),
      2 => const _ItemsTab(),
      3 => const _SettingsTab(),
      4 => const _TemplatesTab(),
      _ => const SizedBox.shrink(),
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
Widget _scrollable(List<Widget> children) => SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );

// ─── Your Details ─────────────────────────────────────────────────────────────
class _YourDetailsTab extends ConsumerWidget {
  const _YourDetailsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(invoiceFormProvider.notifier);
    final f = ref.watch(invoiceFormProvider);

    return _scrollable([
      const AppFormLabel('Your Business Details'),
      AppTextField(
        label: 'Business Name *',
        hint: 'Your Company Name',
        initialValue: f.fromName,
        onChanged: (v) => n.setField('fromName', v),
      ),
      const SizedBox(height: AppSpacing.base),
      AppTextField(
        label: 'GSTIN',
        hint: '22AAAAA0000A1Z5',
        initialValue: f.fromGstin,
        textCapitalization: TextCapitalization.characters,
        onChanged: (v) => n.setField('fromGstin', v.toUpperCase()),
      ),
      const SizedBox(height: AppSpacing.base),
      AppTextField(
        label: 'Address',
        hint: 'Street address',
        initialValue: f.fromAddress,
        maxLines: 2,
        onChanged: (v) => n.setField('fromAddress', v),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(
          label: 'City',
          hint: 'Mumbai',
          initialValue: f.fromCity,
          onChanged: (v) => n.setField('fromCity', v),
        ),
        right: _StateDropdown(
          label: 'State',
          value: f.fromState,
          onChanged: (v) => n.setField('fromState', v),
        ),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(
          label: 'Phone',
          hint: '+91 98765 43210',
          initialValue: f.fromPhone,
          keyboardType: TextInputType.phone,
          onChanged: (v) => n.setField('fromPhone', v),
        ),
        right: AppTextField(
          label: 'Email',
          hint: 'you@company.com',
          initialValue: f.fromEmail,
          keyboardType: TextInputType.emailAddress,
          onChanged: (v) => n.setField('fromEmail', v),
        ),
      ),

      const SizedBox(height: AppSpacing.xl),
      const AppFormLabel('Invoice Details'),

      AppFormRow(
        left: AppTextField(
          label: 'Invoice Number',
          initialValue: f.invoiceNumber,
          onChanged: (v) => n.setField('invoiceNumber', v),
        ),
        right: AppTextField(
          label: 'Invoice Date',
          hint: 'YYYY-MM-DD',
          initialValue: f.invoiceDate,
          keyboardType: TextInputType.datetime,
          readOnly: true,
          onTap: () async {
            final date = await showDatePicker(
              context: context,
              initialDate: DateTime.now(),
              firstDate: DateTime(2020),
              lastDate: DateTime(2030),
            );
            if (date != null) {
              n.setField(
                'invoiceDate',
                '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}',
              );
            }
          },
        ),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(
          label: 'Due Date',
          hint: 'YYYY-MM-DD',
          initialValue: f.dueDate,
          readOnly: true,
          onTap: () async {
            final date = await showDatePicker(
              context: context,
              initialDate: DateTime.now().add(const Duration(days: 30)),
              firstDate: DateTime(2020),
              lastDate: DateTime(2030),
            );
            if (date != null) {
              n.setField(
                'dueDate',
                '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}',
              );
            }
          },
        ),
        right: AppTextField(
          label: 'PO Number',
          hint: 'Optional',
          initialValue: f.poNumber,
          onChanged: (v) => n.setField('poNumber', v),
        ),
      ),
    ]);
  }
}

// ─── Client ───────────────────────────────────────────────────────────────────
class _ClientTab extends ConsumerWidget {
  const _ClientTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(invoiceFormProvider.notifier);
    final f = ref.watch(invoiceFormProvider);

    return _scrollable([
      const AppFormLabel('Bill To'),
      AppTextField(
        label: 'Client Name *',
        hint: 'Client Name',
        initialValue: f.toName,
        onChanged: (v) => n.setField('toName', v),
      ),
      const SizedBox(height: AppSpacing.base),
      AppTextField(
        label: 'Client GSTIN',
        hint: '22AAAAA0000A1Z5',
        initialValue: f.toGstin,
        textCapitalization: TextCapitalization.characters,
        onChanged: (v) => n.setField('toGstin', v.toUpperCase()),
      ),
      const SizedBox(height: AppSpacing.base),
      AppTextField(
        label: 'Address',
        hint: 'Street address',
        initialValue: f.toAddress,
        maxLines: 2,
        onChanged: (v) => n.setField('toAddress', v),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(
          label: 'City',
          initialValue: f.toCity,
          onChanged: (v) => n.setField('toCity', v),
        ),
        right: _StateDropdown(
          label: 'State',
          value: f.toState,
          onChanged: (v) => n.setField('toState', v),
        ),
      ),
      const SizedBox(height: AppSpacing.base),
      AppFormRow(
        left: AppTextField(
          label: 'Phone',
          initialValue: f.toPhone,
          keyboardType: TextInputType.phone,
          onChanged: (v) => n.setField('toPhone', v),
        ),
        right: AppTextField(
          label: 'Email',
          initialValue: f.toEmail,
          keyboardType: TextInputType.emailAddress,
          onChanged: (v) => n.setField('toEmail', v),
        ),
      ),
    ]);
  }
}

// ─── Items ────────────────────────────────────────────────────────────────────
class _ItemsTab extends ConsumerWidget {
  const _ItemsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(invoiceFormProvider.notifier);
    final f = ref.watch(invoiceFormProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        children: [
          // Tax type selector
          Row(
            children: [
              Expanded(
                child: _TaxTypeChip(
                  label: 'CGST + SGST',
                  selected: f.taxType == TaxType.cgstSgst,
                  onTap: () => n.setField('taxType', TaxType.cgstSgst),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _TaxTypeChip(
                  label: 'IGST',
                  selected: f.taxType == TaxType.igst,
                  onTap: () => n.setField('taxType', TaxType.igst),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _TaxTypeChip(
                  label: 'No Tax',
                  selected: f.taxType == TaxType.none,
                  onTap: () => n.setField('taxType', TaxType.none),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.base),

          // Item cards
          ...f.items.asMap().entries.map((entry) {
            final i = entry.key;
            final item = entry.value;
            return _ItemCard(
              item: item,
              index: i,
              showHsn: f.showHsn,
              showDiscount: f.showDiscount,
              canRemove: f.items.length > 1,
              onUpdate: (updated) => n.updateItem(i, (_) => updated),
              onRemove: () => n.removeItem(i),
            );
          }),

          const SizedBox(height: AppSpacing.sm),
          TextButton.icon(
            onPressed: n.addItem,
            icon: const Icon(Icons.add_rounded,
                color: AppColors.secondary, size: 18),
            label: const Text(
              '+ Add Item',
              style: TextStyle(
                color: AppColors.secondary,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
            ),
          ),

          // Totals
          const SizedBox(height: AppSpacing.base),
          _TotalsCard(form: f),
        ],
      ),
    );
  }
}

class _ItemCard extends StatelessWidget {
  const _ItemCard({
    required this.item,
    required this.index,
    required this.showHsn,
    required this.showDiscount,
    required this.canRemove,
    required this.onUpdate,
    required this.onRemove,
  });

  final InvoiceItem item;
  final int index;
  final bool showHsn;
  final bool showDiscount;
  final bool canRemove;
  final ValueChanged<InvoiceItem> onUpdate;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: AppTextField(
                  label: 'Description',
                  hint: 'Item description',
                  initialValue: item.description,
                  onChanged: (v) =>
                      onUpdate(item.copyWith(description: v)),
                ),
              ),
              if (canRemove) ...[
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: onRemove,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppColors.errorLight,
                      borderRadius:
                          BorderRadius.circular(AppRadius.sm),
                    ),
                    child: const Icon(Icons.delete_outline_rounded,
                        color: AppColors.error, size: 16),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: AppTextField(
                  label: 'Qty',
                  initialValue: item.qty,
                  keyboardType: TextInputType.number,
                  onChanged: (v) => onUpdate(item.copyWith(qty: v)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                flex: 2,
                child: AppTextField(
                  label: 'Rate (Rs.)',
                  initialValue: item.rate,
                  keyboardType: const TextInputType.numberWithOptions(
                      decimal: true),
                  onChanged: (v) => onUpdate(item.copyWith(rate: v)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: AppTextField(
                  label: 'GST%',
                  initialValue: item.gstRate,
                  keyboardType: TextInputType.number,
                  onChanged: (v) => onUpdate(item.copyWith(gstRate: v)),
                ),
              ),
            ],
          ),
          if (showHsn || showDiscount) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                if (showHsn)
                  Expanded(
                    child: AppTextField(
                      label: 'HSN/SAC',
                      initialValue: item.hsn,
                      onChanged: (v) => onUpdate(item.copyWith(hsn: v)),
                    ),
                  ),
                if (showHsn && showDiscount) const SizedBox(width: 8),
                if (showDiscount)
                  Expanded(
                    child: AppTextField(
                      label: 'Discount%',
                      initialValue: item.discount,
                      keyboardType: TextInputType.number,
                      onChanged: (v) =>
                          onUpdate(item.copyWith(discount: v)),
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _TotalsCard extends StatelessWidget {
  const _TotalsCard({required this.form});
  final InvoiceForm form;

  @override
  Widget build(BuildContext context) {
    final rows = <MapEntry<String, double>>[
      MapEntry('Subtotal', form.subtotal),
      if (form.taxType == TaxType.cgstSgst) ...[
        MapEntry('CGST', form.cgst),
        MapEntry('SGST', form.sgst),
      ] else if (form.taxType == TaxType.igst)
        MapEntry('IGST', form.igst),
    ];

    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          ...rows.map(
            (e) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(e.key, style: AppTextStyles.bodySm),
                  Text(
                    'Rs. ${e.value.toStringAsFixed(2)}',
                    style: AppTextStyles.bodySm
                        .copyWith(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total',
                  style: AppTextStyles.h4
                      .copyWith(color: AppColors.secondary)),
              Text(
                'Rs. ${form.grandTotal.toStringAsFixed(2)}',
                style: AppTextStyles.h4
                    .copyWith(color: AppColors.secondary),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
class _SettingsTab extends ConsumerWidget {
  const _SettingsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(invoiceFormProvider.notifier);
    final f = ref.watch(invoiceFormProvider);

    return _scrollable([
      const AppFormLabel('Document Settings'),
      _SwitchRow(
        label: 'Show HSN/SAC Column',
        value: f.showHsn,
        onChanged: (v) => n.setField('showHsn', v),
      ),
      _SwitchRow(
        label: 'Show Discount Column',
        value: f.showDiscount,
        onChanged: (v) => n.setField('showDiscount', v),
      ),
      const SizedBox(height: AppSpacing.xl),
      const AppFormLabel('Notes & Terms'),
      AppTextField(
        label: 'Notes',
        hint: 'Any additional notes...',
        initialValue: f.notes,
        maxLines: 3,
        onChanged: (v) => n.setField('notes', v),
      ),
      const SizedBox(height: AppSpacing.base),
      AppTextField(
        label: 'Terms & Conditions',
        initialValue: f.terms,
        maxLines: 3,
        onChanged: (v) => n.setField('terms', v),
      ),
    ]);
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────
class _TemplatesTab extends ConsumerWidget {
  const _TemplatesTab();

  static const _templates = [
    {'id': 'Classic',   'desc': 'Clean bordered header',    'pro': false},
    {'id': 'Minimal',   'desc': 'Underline accent',         'pro': false},
    {'id': 'Modern',    'desc': 'Left sidebar accent',      'pro': true},
    {'id': 'Corporate', 'desc': 'Centered formal header',   'pro': true},
    {'id': 'Elegant',   'desc': 'Gold accent luxury style', 'pro': true},
  ];

  static const _colors = [
    '#0D9488', '#6366F1', '#F59E0B', '#EF4444',
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981',
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final n = ref.read(invoiceFormProvider.notifier);
    final f = ref.watch(invoiceFormProvider);
    final isPro = ref.watch(isProProvider);

    return _scrollable([
      const AppFormLabel('Choose Template'),
      ...(_templates.map((t) {
        final isProTemplate = t['pro'] as bool;
        final locked = isProTemplate && !isPro;
        final selected = f.templateName == t['id'] && !locked;
        return GestureDetector(
          onTap: () {
            if (locked) {
              context.push('/billing');
            } else {
              n.setField('templateName', t['id']!);
            }
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: selected ? AppColors.secondaryLight : AppColors.bgCard,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(
                color: selected ? AppColors.secondary : AppColors.border,
                width: selected ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: (selected ? AppColors.secondary : AppColors.textMuted).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: Icon(
                    locked ? Icons.lock_rounded : Icons.description_rounded,
                    size: 16,
                    color: locked ? AppColors.textMuted : (selected ? AppColors.secondary : AppColors.textMuted),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Text(t['id']!, style: AppTextStyles.body.copyWith(
                          fontWeight: FontWeight.w600,
                          color: locked ? AppColors.textMuted : AppColors.textPrimary,
                        )),
                        if (isProTemplate) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: locked ? AppColors.bgPage : AppColors.secondary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text('PRO', style: TextStyle(
                              fontSize: 8,
                              fontFamily: 'Inter',
                              fontWeight: FontWeight.w700,
                              color: locked ? AppColors.textMuted : AppColors.secondary,
                            )),
                          ),
                        ],
                      ]),
                      Text(t['desc']!, style: AppTextStyles.caption.copyWith(
                        color: locked ? AppColors.textLight : null,
                      )),
                    ],
                  ),
                ),
                if (selected)
                  const Icon(Icons.check_circle_rounded, color: AppColors.secondary, size: 20)
                else if (locked)
                  const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textMuted, size: 14),
              ],
            ),
          ),
        );
      })),

      const SizedBox(height: AppSpacing.xl),
      const AppFormLabel('Accent Color'),
      Wrap(
        spacing: 10,
        runSpacing: 10,
        children: _colors.map((hex) {
          final color = Color(int.parse('0xFF${hex.substring(1)}'));
          final selected = f.templateColor == hex;
          return GestureDetector(
            onTap: () => n.setField('templateColor', hex),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
                border: Border.all(
                  color: selected ? AppColors.textPrimary : Colors.transparent,
                  width: 3,
                ),
                boxShadow: selected ? AppShadows.card : null,
              ),
              child: selected
                  ? const Icon(Icons.check_rounded, color: Colors.white, size: 16)
                  : null,
            ),
          );
        }).toList(),
      ),
    ]);
  }
}

// ─── Shared small widgets ─────────────────────────────────────────────────────
class _StateDropdown extends ConsumerWidget {
  const _StateDropdown({
    required this.label,
    required this.value,
    required this.onChanged,
  });
  final String label;
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTextStyles.label),
        const SizedBox(height: 4),
        DropdownButtonFormField<String>(
          value: value,
          isExpanded: true,
          decoration: const InputDecoration(
            contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          ),
          style: AppTextStyles.body.copyWith(fontSize: 13),
          items: IndianStates.all
              .map((s) => DropdownMenuItem(
                    value: s['code'],
                    child: Text(s['name']!, overflow: TextOverflow.ellipsis),
                  ))
              .toList(),
          onChanged: (v) { if (v != null) onChanged(v); },
        ),
      ],
    );
  }
}

class _TaxTypeChip extends StatelessWidget {
  const _TaxTypeChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: selected ? AppColors.secondaryLight : AppColors.bgCard,
          borderRadius: BorderRadius.circular(AppRadius.sm),
          border: Border.all(
            color: selected ? AppColors.secondary : AppColors.border,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: selected ? AppColors.secondary : AppColors.textMuted,
            ),
          ),
        ),
      ),
    );
  }
}

class _SwitchRow extends StatelessWidget {
  const _SwitchRow({
    required this.label,
    required this.value,
    required this.onChanged,
  });
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTextStyles.body),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: AppColors.secondary,
        ),
      ],
    );
  }
}

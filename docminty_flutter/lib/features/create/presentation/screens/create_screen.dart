import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';

class CreateScreen extends StatelessWidget {
  const CreateScreen({super.key});

  static const _categories = [
    _Category(
      label: 'Business',
      items: [
        _DocItem('Invoice', Icons.receipt_long_outlined, '/invoice',
            Color(0xFF6366F1), 'GST compliant tax invoice'),
        _DocItem('Quotation', Icons.request_quote_outlined, '/quotation',
            Color(0xFF0D9488), 'Price quote for clients'),
        _DocItem('Receipt', Icons.payments_outlined, '/receipt',
            Color(0xFF10B981), 'Payment acknowledgment'),
        _DocItem('Purchase Order', Icons.shopping_cart_outlined, '/purchase-order',
            Color(0xFF3B82F6), 'Formal purchase request'),
        _DocItem('Proforma Invoice', Icons.description_outlined, '/proforma-invoice',
            Color(0xFF8B5CF6), 'Pre-delivery invoice'),
        _DocItem('Payment Voucher', Icons.receipt_outlined, '/payment-voucher',
            Color(0xFFF59E0B), 'Internal payment record'),
      ],
    ),
    _Category(
      label: 'HR & Employment',
      items: [
        _DocItem('Salary Slip', Icons.account_balance_wallet_outlined, '/salary-slip',
            Color(0xFFF59E0B), 'Monthly payslip'),
        _DocItem('Offer Letter', Icons.handshake_outlined, '/job-offer-letter',
            Color(0xFF8B5CF6), 'Job offer to candidate'),
        _DocItem('Experience Letter', Icons.mail_outline_rounded, '/experience-letter',
            Color(0xFF3B82F6), 'Work experience proof'),
        _DocItem('Resignation Letter', Icons.exit_to_app_outlined, '/resignation-letter',
            Color(0xFFEF4444), 'Formal resignation'),
        _DocItem('Internship Certificate', Icons.school_outlined, '/internship-certificate',
            Color(0xFFEC4899), 'Internship completion proof'),
        _DocItem('Certificate', Icons.workspace_premium_outlined, '/certificate',
            Color(0xFF10B981), 'Achievement certificate'),
      ],
    ),
    _Category(
      label: 'Logistics',
      items: [
        _DocItem('Packing Slip', Icons.inventory_2_outlined, '/packing-slip',
            Color(0xFF10B981), 'Shipment packing list'),
        _DocItem('Rent Receipt', Icons.home_outlined, '/rent-receipt',
            Color(0xFF3B82F6), 'Rental payment receipt'),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Create Document'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          ..._categories.map((cat) => _CategorySection(category: cat)),
          // ── Tools shortcut ────────────────────────────────────────────
          Text('Tools', style: AppTextStyles.h4),
          const SizedBox(height: AppSpacing.sm),
          AppCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            onTap: () => context.push('/tools'),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.secondaryLight,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  child: const Icon(Icons.construction_rounded,
                      color: AppColors.secondary, size: 22),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('QR, PDF & Calculator Tools',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          )),
                      Text(
                          'QR Generator, PDF Merge/Split, EMI, GST & more',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 11,
                            color: AppColors.textMuted,
                          )),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios_rounded,
                    size: 14, color: AppColors.textLight),
              ],
            ),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

class _CategorySection extends StatelessWidget {
  const _CategorySection({required this.category});
  final _Category category;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(category.label, style: AppTextStyles.h4),
        const SizedBox(height: AppSpacing.sm),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            childAspectRatio: 0.85,
          ),
          itemCount: category.items.length,
          itemBuilder: (ctx, i) => _DocTile(item: category.items[i]),
        ),
        const SizedBox(height: AppSpacing.lg),
      ],
    );
  }
}

class _DocTile extends StatelessWidget {
  const _DocTile({required this.item});
  final _DocItem item;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push(item.route),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.bgCard,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: item.color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(item.icon, color: item.color, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              item.label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              item.description,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 9,
                color: AppColors.textLight,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class _Category {
  const _Category({required this.label, required this.items});
  final String label;
  final List<_DocItem> items;
}

class _DocItem {
  const _DocItem(
      this.label, this.icon, this.route, this.color, this.description);
  final String label;
  final IconData icon;
  final String route;
  final Color color;
  final String description;
}

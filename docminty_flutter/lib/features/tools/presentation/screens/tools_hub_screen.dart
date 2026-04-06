import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';

class ToolsHubScreen extends StatelessWidget {
  const ToolsHubScreen({super.key});

  static const _categories = [
    _ToolCategory(
      label: 'QR Code',
      items: [
        _ToolItem('QR Generator', Icons.qr_code_2_rounded,
            '/tools/qr-generator', Color(0xFF0D9488),
            'Text, URL, UPI, Contact'),
      ],
    ),
    _ToolCategory(
      label: 'PDF Tools',
      items: [
        _ToolItem('JPG to PDF', Icons.image_rounded,
            '/tools/jpg-to-pdf', Color(0xFF6366F1),
            'Images → PDF'),
        _ToolItem('PDF to JPG', Icons.photo_library_rounded,
            '/tools/pdf-to-jpg', Color(0xFFF59E0B),
            'PDF pages → images'),
        _ToolItem('Merge PDF', Icons.merge_type_rounded,
            '/tools/merge-pdf', Color(0xFF10B981),
            'Combine multiple PDFs'),
        _ToolItem('Split PDF', Icons.call_split_rounded,
            '/tools/split-pdf', Color(0xFF3B82F6),
            'Extract or split pages'),
        _ToolItem('Compress PDF', Icons.compress_rounded,
            '/tools/compress-pdf', Color(0xFFEC4899),
            'Reduce file size'),
        _ToolItem('PDF to Word', Icons.description_rounded,
            '/tools/pdf-to-word', Color(0xFF2563EB),
            'Convert to .docx'),
        _ToolItem('Word to PDF', Icons.picture_as_pdf_rounded,
            '/tools/word-to-pdf', Color(0xFFEF4444),
            'Convert .docx to PDF'),
      ],
    ),
    _ToolCategory(
      label: 'Calculators',
      items: [
        _ToolItem('EMI Calculator', Icons.account_balance_rounded,
            '/tools/emi-calculator', Color(0xFF0D9488),
            'Loan EMI & schedule'),
        _ToolItem('GST Calculator', Icons.receipt_long_rounded,
            '/tools/gst-calculator', Color(0xFF6366F1),
            'Add or remove GST'),
        _ToolItem('Salary Calculator', Icons.account_balance_wallet_rounded,
            '/tools/salary-calculator', Color(0xFFF59E0B),
            'CTC to take-home'),
        _ToolItem('Interest Calculator', Icons.trending_up_rounded,
            '/tools/interest-calculator', Color(0xFF10B981),
            'Simple & compound'),
        _ToolItem('Loan Calculator', Icons.home_rounded,
            '/tools/loan-calculator', Color(0xFF3B82F6),
            'Any loan type'),
        _ToolItem('Profit Margin', Icons.show_chart_rounded,
            '/tools/profit-margin', Color(0xFF8B5CF6),
            'Margin & markup'),
        _ToolItem('Discount Calculator', Icons.discount_rounded,
            '/tools/discount-calculator', Color(0xFFEC4899),
            'Price after discount'),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('Tools')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          ..._categories.map((cat) => _CategorySection(category: cat)),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

class _CategorySection extends StatelessWidget {
  const _CategorySection({required this.category});
  final _ToolCategory category;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(category.label, style: AppTextStyles.h4),
        const SizedBox(height: AppSpacing.sm),
        ...category.items.map((item) => _ToolTile(item: item)),
        const SizedBox(height: AppSpacing.lg),
      ],
    );
  }
}

class _ToolTile extends StatelessWidget {
  const _ToolTile({required this.item});
  final _ToolItem item;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      onTap: () => context.push(item.route),
      child: Row(
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
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.label,
                    style: AppTextStyles.body
                        .copyWith(fontWeight: FontWeight.w600)),
                Text(item.description, style: AppTextStyles.caption),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded,
              size: 14, color: AppColors.textLight),
        ],
      ),
    );
  }
}

class _ToolCategory {
  const _ToolCategory({required this.label, required this.items});
  final String label;
  final List<_ToolItem> items;
}

class _ToolItem {
  const _ToolItem(this.label, this.icon, this.route, this.color, this.description);
  final String label;
  final IconData icon;
  final String route;
  final Color color;
  final String description;
}

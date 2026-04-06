import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';
import '../../data/models/document_model.dart';
import '../providers/documents_provider.dart';

class DocumentsScreen extends ConsumerStatefulWidget {
  const DocumentsScreen({super.key});

  @override
  ConsumerState<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends ConsumerState<DocumentsScreen> {
  String _search = '';
  String _filter = 'All';

  static const _filters = [
    'All', 'invoice', 'quotation', 'receipt',
    'salary-slip', 'certificate', 'experience-letter',
    'resignation-letter', 'job-offer-letter', 'internship-certificate',
    'purchase-order', 'proforma-invoice', 'payment-voucher',
    'packing-slip', 'rent-receipt',
  ];

  static const _filterLabels = {
    'All': 'All',
    'invoice': 'Invoice',
    'quotation': 'Quotation',
    'receipt': 'Receipt',
    'salary-slip': 'Salary Slip',
    'certificate': 'Certificate',
    'experience-letter': 'Exp. Letter',
    'resignation-letter': 'Resignation',
    'job-offer-letter': 'Job Offer',
    'internship-certificate': 'Internship',
    'purchase-order': 'Purchase Order',
    'proforma-invoice': 'Proforma',
    'payment-voucher': 'Payment Voucher',
    'packing-slip': 'Packing Slip',
    'rent-receipt': 'Rent Receipt',
  };

  @override
  Widget build(BuildContext context) {
    final docsAsync = ref.watch(documentsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('My Documents'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.read(documentsProvider.notifier).refresh(),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Search + Filter ───────────────────────────────────────────
          Container(
            color: AppColors.bgCard,
            padding: const EdgeInsets.fromLTRB(
                AppSpacing.base, 8, AppSpacing.base, 0),
            child: Column(
              children: [
                // Search
                TextField(
                  onChanged: (v) => setState(() => _search = v.toLowerCase()),
                  decoration: InputDecoration(
                    hintText: 'Search documents...',
                    prefixIcon: const Icon(Icons.search_rounded,
                        size: 18, color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.bgPage,
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      borderSide:
                          const BorderSide(color: AppColors.secondary),
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // Filter chips
                SizedBox(
                  height: 34,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _filters.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 6),
                    itemBuilder: (_, i) {
                      final f = _filters[i];
                      final selected = _filter == f;
                      return GestureDetector(
                        onTap: () => setState(() => _filter = f),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.secondary
                                : AppColors.bgPage,
                            borderRadius:
                                BorderRadius.circular(AppRadius.full),
                            border: Border.all(
                              color: selected
                                  ? AppColors.secondary
                                  : AppColors.border,
                            ),
                          ),
                          child: Text(
                            _filterLabels[f] ?? f,
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: selected
                                  ? Colors.white
                                  : AppColors.textMuted,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),

          // ── List ──────────────────────────────────────────────────────
          Expanded(
            child: docsAsync.when(
              data: (docs) {
                final filtered = docs.where((d) {
                  final matchFilter =
                      _filter == 'All' || d.docType == _filter;
                  final matchSearch = _search.isEmpty ||
                      d.title.toLowerCase().contains(_search) ||
                      (d.partyName?.toLowerCase().contains(_search) ??
                          false) ||
                      (d.referenceNumber
                              ?.toLowerCase()
                              .contains(_search) ??
                          false);
                  return matchFilter && matchSearch;
                }).toList();

                if (filtered.isEmpty) {
                  return _EmptyState(
                    hasFilter: _filter != 'All' || _search.isNotEmpty,
                    onClear: () => setState(() {
                      _filter = 'All';
                      _search = '';
                    }),
                  );
                }

                return RefreshIndicator(
                  color: AppColors.secondary,
                  onRefresh: () =>
                      ref.read(documentsProvider.notifier).refresh(),
                  child: ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.base),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(height: 8),
                    itemBuilder: (_, i) =>
                        _DocCard(doc: filtered[i]),
                  ),
                );
              },
              loading: () => const _LoadingSkeleton(),
              error: (e, _) => _ErrorState(
                message: e.toString(),
                onRetry: () =>
                    ref.read(documentsProvider.notifier).refresh(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Document card ──────────────────────────────────────────────────────────────
class _DocCard extends ConsumerWidget {
  const _DocCard({required this.doc});
  final DocumentModel doc;

  static const _typeColors = {
    'invoice': Color(0xFF6366F1),
    'quotation': Color(0xFF0D9488),
    'receipt': Color(0xFF10B981),
    'salary-slip': Color(0xFFF59E0B),
    'certificate': Color(0xFFEC4899),
    'experience-letter': Color(0xFF3B82F6),
    'resignation-letter': Color(0xFFEF4444),
    'job-offer-letter': Color(0xFF8B5CF6),
    'internship-certificate': Color(0xFFEC4899),
    'purchase-order': Color(0xFF0D9488),
    'payment-voucher': Color(0xFFF59E0B),
    'packing-slip': Color(0xFF10B981),
    'proforma-invoice': Color(0xFF6366F1),
    'rent-receipt': Color(0xFF3B82F6),
  };

  static const _typeIcons = {
    'invoice': Icons.receipt_long_rounded,
    'quotation': Icons.request_quote_rounded,
    'receipt': Icons.payments_rounded,
    'salary-slip': Icons.account_balance_wallet_rounded,
    'certificate': Icons.workspace_premium_rounded,
    'experience-letter': Icons.mail_rounded,
    'resignation-letter': Icons.exit_to_app_rounded,
    'job-offer-letter': Icons.handshake_rounded,
    'internship-certificate': Icons.school_rounded,
    'purchase-order': Icons.shopping_cart_rounded,
    'payment-voucher': Icons.receipt_rounded,
    'packing-slip': Icons.inventory_2_rounded,
    'proforma-invoice': Icons.description_rounded,
    'rent-receipt': Icons.home_rounded,
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color =
        _typeColors[doc.docType] ?? AppColors.secondary;
    final icon =
        _typeIcons[doc.docType] ?? Icons.description_rounded;

    return AppCard(
      padding: const EdgeInsets.all(12),
      onTap: () => _openDoc(context),
      child: Row(
        children: [
          // Icon
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 12),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  doc.title,
                  style: AppTextStyles.body
                      .copyWith(fontWeight: FontWeight.w600),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    _Tag(doc.displayName, color),
                    if (doc.partyName?.isNotEmpty == true) ...[
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          doc.partyName!,
                          style: AppTextStyles.caption,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ],
                ),
                if (doc.createdAt != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    _formatDate(doc.createdAt!),
                    style: AppTextStyles.caption
                        .copyWith(color: AppColors.textLight),
                  ),
                ],
              ],
            ),
          ),

          // Amount + actions
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (doc.amount != null)
                Text(
                  'Rs. ${doc.amount!.toStringAsFixed(0)}',
                  style: AppTextStyles.bodySm.copyWith(
                    color: color,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              const SizedBox(height: 4),
              Row(
                children: [
                  _ActionBtn(
                    icon: Icons.edit_rounded,
                    color: AppColors.secondary,
                    onTap: () => _openDoc(context),
                  ),
                  const SizedBox(width: 4),
                  _ActionBtn(
                    icon: Icons.delete_outline_rounded,
                    color: AppColors.error,
                    onTap: () => _confirmDelete(context, ref),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _openDoc(BuildContext context) {
    // Navigate to the appropriate generator with saved data
    final route = switch (doc.docType) {
      'invoice' => '/invoice',
      'quotation' => '/quotation',
      'receipt' => '/receipt',
      'salary-slip' => '/salary-slip',
      'certificate' => '/certificate',
      'experience-letter' => '/experience-letter',
      'resignation-letter' => '/resignation-letter',
      'job-offer-letter' => '/job-offer-letter',
      'internship-certificate' => '/internship-certificate',
      'purchase-order' => '/purchase-order',
      'proforma-invoice' => '/proforma-invoice',
      'payment-voucher' => '/payment-voucher',
      'packing-slip' => '/packing-slip',
      'rent-receipt' => '/rent-receipt',
      _ => '/invoice',
    };
    context.push(route, extra: doc);
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Document'),
        content: Text('Delete "${doc.title}"? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      await ref.read(documentsProvider.notifier).delete(doc.id);
    }
  }

  String _formatDate(DateTime d) {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${d.day} ${months[d.month - 1]} ${d.year}';
  }
}

class _Tag extends StatelessWidget {
  const _Tag(this.label, this.color);
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(AppRadius.full),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.w700,
            color: color,
            fontFamily: 'Inter',
          ),
        ),
      );
}

class _ActionBtn extends StatelessWidget {
  const _ActionBtn({
    required this.icon,
    required this.color,
    required this.onTap,
  });
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: color.withOpacity(0.08),
            borderRadius: BorderRadius.circular(AppRadius.sm),
          ),
          child: Icon(icon, color: color, size: 14),
        ),
      );
}

// ── States ─────────────────────────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.hasFilter, required this.onClear});
  final bool hasFilter;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                hasFilter
                    ? Icons.search_off_rounded
                    : Icons.folder_open_rounded,
                size: 56,
                color: AppColors.textLight,
              ),
              const SizedBox(height: 12),
              Text(
                hasFilter ? 'No matching documents' : 'No documents yet',
                style: AppTextStyles.h4,
              ),
              const SizedBox(height: 4),
              Text(
                hasFilter
                    ? 'Try a different search or filter'
                    : 'Create your first document and save it',
                style: AppTextStyles.bodySm,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              if (hasFilter)
                TextButton(
                  onPressed: onClear,
                  child: const Text('Clear filters'),
                )
              else
                ElevatedButton.icon(
                  onPressed: () => context.push('/create'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary,
                  ),
                  icon: const Icon(Icons.add_rounded,
                      color: Colors.white, size: 16),
                  label: const Text('Create Document',
                      style: TextStyle(color: Colors.white)),
                ),
            ],
          ),
        ),
      );
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.wifi_off_rounded,
                  size: 48, color: AppColors.textLight),
              const SizedBox(height: 12),
              const Text('Failed to load documents', style: AppTextStyles.h4),
              const SizedBox(height: 4),
              Text(message,
                  style: AppTextStyles.caption, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: onRetry,
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary),
                icon: const Icon(Icons.refresh_rounded,
                    color: Colors.white, size: 16),
                label: const Text('Retry',
                    style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      );
}

class _LoadingSkeleton extends StatelessWidget {
  const _LoadingSkeleton();

  @override
  Widget build(BuildContext context) => ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        itemCount: 6,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (_, __) => Container(
          height: 76,
          decoration: BoxDecoration(
            color: AppColors.bgCard,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              const SizedBox(width: 12),
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                        height: 12, width: 140, color: AppColors.border),
                    const SizedBox(height: 6),
                    Container(
                        height: 10, width: 90, color: AppColors.borderLight),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
}

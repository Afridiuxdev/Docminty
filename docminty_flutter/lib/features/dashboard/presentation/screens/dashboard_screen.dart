import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../documents/data/models/document_model.dart';
import '../../../documents/presentation/providers/documents_provider.dart';
import '../../../notifications/presentation/providers/notifications_provider.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  static const int _freeDocLimit = 50;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final docsAsync = ref.watch(documentsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      body: CustomScrollView(
        slivers: [
          // ── App Bar ─────────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 110,
            pinned: true,
            backgroundColor: AppColors.primary,
            surfaceTintColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppColors.primary,
                padding: const EdgeInsets.fromLTRB(20, 56, 20, 0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Welcome back, ${user?.name.split(' ').first ?? 'User'}!',
                          style: AppTextStyles.h3.copyWith(color: Colors.white),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user?.isPro == true ? '${user!.plan.name.toUpperCase()} Plan' : 'Free Plan · Upgrade for more',
                          style: AppTextStyles.bodySm.copyWith(color: Colors.white70),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: () => context.push('/profile'),
                      child: CircleAvatar(
                        radius: 20,
                        backgroundColor: Colors.white24,
                        child: Text(
                          (user?.name.isNotEmpty == true) ? user!.name[0].toUpperCase() : 'U',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              collapseMode: CollapseMode.pin,
            ),
            actions: [
              Consumer(builder: (ctx, ref, _) {
                final unread = ref.watch(unreadCountProvider);
                return Stack(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.notifications_rounded, color: Colors.white),
                      tooltip: 'Notifications',
                      onPressed: () => context.push('/notifications'),
                    ),
                    if (unread > 0)
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          width: 16,
                          height: 16,
                          decoration: const BoxDecoration(
                            color: AppColors.error,
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              unread > 9 ? '9+' : '$unread',
                              style: const TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ),
                  ],
                );
              }),
              IconButton(
                icon: const Icon(Icons.add_rounded, color: Colors.white),
                tooltip: 'New Document',
                onPressed: () => context.push('/create'),
              ),
            ],
          ),

          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.base),
            sliver: SliverList(
              delegate: SliverChildListDelegate([

                // ── 4 Stat Cards (matches web) ──────────────────────────
                docsAsync.when(
                  data: (docs) => _StatsRow(docs: docs, user: user),
                  loading: () => const _StatsShimmer(),
                  error: (_, __) => _StatsRow(docs: const [], user: user),
                ),
                const SizedBox(height: AppSpacing.base),

                // ── Documents Saved Progress (free plan) ────────────────
                if (user?.isPro != true)
                  docsAsync.when(
                    data: (docs) => _DocumentsProgress(count: docs.length, limit: _freeDocLimit),
                    loading: () => const SizedBox.shrink(),
                    error: (_, __) => _DocumentsProgress(count: 0, limit: _freeDocLimit),
                  ),
                if (user?.isPro != true) const SizedBox(height: AppSpacing.base),

                // ── Quick Create ─────────────────────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Quick Create', style: AppTextStyles.h4),
                    TextButton(
                      onPressed: () => context.go('/create'),
                      child: Text('View all', style: AppTextStyles.bodySm.copyWith(color: AppColors.secondary)),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                _QuickCreate(),
                const SizedBox(height: AppSpacing.lg),

                // ── Recent Documents ─────────────────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Recent Documents', style: AppTextStyles.h4),
                    TextButton(
                      onPressed: () => context.go('/documents'),
                      child: Text('View all', style: AppTextStyles.bodySm.copyWith(color: AppColors.secondary)),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                docsAsync.when(
                  data: (docs) {
                    if (docs.isEmpty) return _EmptyDocuments(onTap: () => context.go('/create'));
                    return Column(
                      children: docs.take(5).map((d) => _DocumentTile(doc: d)).toList(),
                    );
                  },
                  loading: () => const _DocsShimmer(),
                  error: (e, _) => Center(child: Text(e.toString(), style: AppTextStyles.caption)),
                ),

                // ── Upgrade Banner (free users) ──────────────────────────
                if (user?.isPro != true) ...[
                  const SizedBox(height: AppSpacing.base),
                  _UpgradeBanner(onTap: () => context.push('/billing')),
                ],

                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

// ── 4 Stat Cards ─────────────────────────────────────────────────────────────
class _StatsRow extends StatelessWidget {
  const _StatsRow({required this.docs, required this.user});
  final List<DocumentModel> docs;
  final dynamic user;

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final thisMonthDocs = docs.where((d) =>
      d.createdAt != null && d.createdAt!.year == now.year && d.createdAt!.month == now.month
    ).length;

    final lastCreated = docs.isNotEmpty && docs.first.createdAt != null
        ? _timeAgo(docs.first.createdAt!)
        : 'Never';

    final planLabel = user?.isPro == true ? 'PRO' : 'FREE';

    return Column(
      children: [
        Row(children: [
          Expanded(child: _StatCard(
            label: 'Docs This Month',
            value: '$thisMonthDocs',
            icon: Icons.trending_up_rounded,
            color: AppColors.secondary,
          )),
          const SizedBox(width: 10),
          Expanded(child: _StatCard(
            label: 'Total Documents',
            value: '${docs.length}',
            icon: Icons.description_rounded,
            color: const Color(0xFF6366F1),
          )),
        ]),
        const SizedBox(height: 10),
        Row(children: [
          Expanded(child: _StatCard(
            label: 'Last Created',
            value: lastCreated,
            icon: Icons.access_time_rounded,
            color: const Color(0xFFF59E0B),
          )),
          const SizedBox(width: 10),
          Expanded(child: _StatCard(
            label: 'Plan',
            value: planLabel,
            icon: Icons.workspace_premium_rounded,
            color: user?.isPro == true ? const Color(0xFFF59E0B) : AppColors.textMuted,
          )),
        ]),
      ],
    );
  }

  static String _timeAgo(DateTime d) {
    final diff = DateTime.now().difference(d);
    if (diff.inDays > 0) return '${diff.inDays}d ago';
    if (diff.inHours > 0) return '${diff.inHours}h ago';
    if (diff.inMinutes > 0) return '${diff.inMinutes}m ago';
    return 'Just now';
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 38, height: 38,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(icon, color: color, size: 19),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(value, style: const TextStyle(fontFamily: 'SpaceGrotesk', fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                Text(label, style: const TextStyle(fontFamily: 'Inter', fontSize: 10, color: AppColors.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Documents Progress ────────────────────────────────────────────────────────
class _DocumentsProgress extends StatelessWidget {
  const _DocumentsProgress({required this.count, required this.limit});
  final int count;
  final int limit;

  @override
  Widget build(BuildContext context) {
    final pct = (count / limit).clamp(0.0, 1.0);
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Documents saved', style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted)),
          Text('$count / $limit', style: AppTextStyles.bodySm.copyWith(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        ]),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(AppRadius.full),
          child: LinearProgressIndicator(
            value: pct,
            backgroundColor: AppColors.border,
            color: pct > 0.8 ? AppColors.error : AppColors.secondary,
            minHeight: 6,
          ),
        ),
      ]),
    );
  }
}

// ── Quick Create ──────────────────────────────────────────────────────────────
class _QuickCreate extends StatelessWidget {
  static const _items = [
    {'label': 'GST Invoice', 'route': '/invoice'},
    {'label': 'Quotation', 'route': '/quotation'},
    {'label': 'Salary Slip', 'route': '/salary-slip'},
    {'label': 'Receipt', 'route': '/receipt'},
    {'label': 'Rent Receipt', 'route': '/rent-receipt'},
    {'label': 'Certificate', 'route': '/certificate'},
    {'label': 'Exp. Letter', 'route': '/experience-letter'},
    {'label': 'Purchase Order', 'route': '/purchase-order'},
    {'label': 'More', 'route': '/create'},
  ];

  static const _icons = [
    Icons.receipt_long_outlined, Icons.request_quote_outlined,
    Icons.account_balance_wallet_outlined, Icons.payments_outlined,
    Icons.home_outlined, Icons.workspace_premium_outlined,
    Icons.mail_outline_rounded, Icons.shopping_cart_outlined,
    Icons.apps_outlined,
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 1.1,
      ),
      itemCount: _items.length,
      itemBuilder: (ctx, i) {
        final item = _items[i];
        return GestureDetector(
          onTap: () => context.push(item['route'] as String),
          child: AppCard(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(_icons[i], color: AppColors.secondary, size: 24),
              const SizedBox(height: 6),
              Text(
                item['label'] as String,
                textAlign: TextAlign.center,
                style: const TextStyle(fontFamily: 'Inter', fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ]),
          ),
        );
      },
    );
  }
}

// ── Document Tile ─────────────────────────────────────────────────────────────
class _DocumentTile extends ConsumerWidget {
  const _DocumentTile({required this.doc});
  final DocumentModel doc;

  static const _typeColors = {
    'invoice': Color(0xFF6366F1), 'quotation': Color(0xFF0D9488),
    'receipt': Color(0xFF10B981), 'salary-slip': Color(0xFFF59E0B),
    'certificate': Color(0xFFEC4899), 'experience-letter': Color(0xFF3B82F6),
    'resignation-letter': Color(0xFFEF4444), 'job-offer-letter': Color(0xFF8B5CF6),
    'internship-certificate': Color(0xFFEC4899), 'purchase-order': Color(0xFF0D9488),
    'payment-voucher': Color(0xFFF59E0B), 'packing-slip': Color(0xFF10B981),
    'proforma-invoice': Color(0xFF6366F1), 'rent-receipt': Color(0xFF3B82F6),
  };

  static const _typeIcons = {
    'invoice': Icons.receipt_long_outlined, 'quotation': Icons.request_quote_outlined,
    'receipt': Icons.payments_outlined, 'salary-slip': Icons.account_balance_wallet_outlined,
    'certificate': Icons.workspace_premium_outlined, 'experience-letter': Icons.mail_outline_rounded,
    'resignation-letter': Icons.exit_to_app_outlined, 'job-offer-letter': Icons.handshake_outlined,
    'internship-certificate': Icons.school_outlined, 'purchase-order': Icons.shopping_cart_outlined,
    'payment-voucher': Icons.receipt_outlined, 'packing-slip': Icons.inventory_2_outlined,
    'proforma-invoice': Icons.description_outlined, 'rent-receipt': Icons.home_outlined,
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _typeColors[doc.docType] ?? AppColors.secondary;
    final icon = _typeIcons[doc.docType] ?? Icons.description_rounded;

    return AppCard(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      onTap: () {
        final route = switch (doc.docType) {
          'invoice' => '/invoice', 'quotation' => '/quotation',
          'receipt' => '/receipt', 'salary-slip' => '/salary-slip',
          'certificate' => '/certificate', 'experience-letter' => '/experience-letter',
          'resignation-letter' => '/resignation-letter', 'job-offer-letter' => '/job-offer-letter',
          'internship-certificate' => '/internship-certificate',
          'purchase-order' => '/purchase-order', 'proforma-invoice' => '/proforma-invoice',
          'payment-voucher' => '/payment-voucher', 'packing-slip' => '/packing-slip',
          'rent-receipt' => '/rent-receipt', _ => '/invoice',
        };
        context.push(route, extra: doc);
      },
      child: Row(children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(AppRadius.md)),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(doc.title, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text('${doc.displayName}${doc.partyName != null ? ' · ${doc.partyName}' : ''}',
              style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis),
        ])),
        if (doc.amount != null)
          Text('Rs. ${doc.amount!.toStringAsFixed(0)}',
              style: AppTextStyles.body.copyWith(color: color, fontWeight: FontWeight.w700)),
      ]),
    );
  }
}

// ── Upgrade Banner ────────────────────────────────────────────────────────────
class _UpgradeBanner extends StatelessWidget {
  const _UpgradeBanner({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [AppColors.primary, AppColors.secondary], begin: Alignment.topLeft, end: Alignment.bottomRight),
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: Row(children: [
          const Icon(Icons.workspace_premium_rounded, color: Colors.amber, size: 28),
          const SizedBox(width: 12),
          const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Upgrade to Business Pro', style: TextStyle(fontFamily: 'SpaceGrotesk', fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
            Text('Batch processing, cloud storage, premium templates — Rs.199/mo',
                style: TextStyle(fontFamily: 'Inter', fontSize: 11, color: Colors.white70)),
          ])),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppRadius.full)),
            child: const Text('Upgrade Now', style: TextStyle(fontFamily: 'SpaceGrotesk', fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary)),
          ),
        ]),
      ),
    );
  }
}

// ── Empty State ───────────────────────────────────────────────────────────────
class _EmptyDocuments extends StatelessWidget {
  const _EmptyDocuments({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: Column(children: [
        const Icon(Icons.description_rounded, size: 48, color: AppColors.textLight),
        const SizedBox(height: 12),
        Text('No documents yet. Create your first one!', style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted), textAlign: TextAlign.center),
        const SizedBox(height: 12),
        ElevatedButton(
          onPressed: onTap,
          style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary, foregroundColor: Colors.white),
          child: const Text('Create Invoice'),
        ),
      ]),
    );
  }
}

class _StatsShimmer extends StatelessWidget {
  const _StatsShimmer();
  @override
  Widget build(BuildContext context) => Column(children: [
    Row(children: [
      Expanded(child: Container(height: 68, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(12)))),
      const SizedBox(width: 10),
      Expanded(child: Container(height: 68, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(12)))),
    ]),
    const SizedBox(height: 10),
    Row(children: [
      Expanded(child: Container(height: 68, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(12)))),
      const SizedBox(width: 10),
      Expanded(child: Container(height: 68, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(12)))),
    ]),
  ]);
}

class _DocsShimmer extends StatelessWidget {
  const _DocsShimmer();
  @override
  Widget build(BuildContext context) => Column(
    children: List.generate(3, (_) => Container(
      height: 60, margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(12)),
    )),
  );
}

// Keep StatCard exported for any other usage
class StatCard extends StatelessWidget {
  const StatCard({super.key, required this.label, required this.value, required this.icon, required this.color});
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  @override
  Widget build(BuildContext context) => _StatCard(label: label, value: value, icon: icon, color: color);
}

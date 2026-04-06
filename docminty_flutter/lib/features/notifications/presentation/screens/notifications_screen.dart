import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';
import '../../data/models/notification_model.dart';
import '../providers/notifications_provider.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationsProvider);
    final notifier = ref.read(notificationsProvider.notifier);

    final today = DateTime.now();
    final todayList = notifications
        .where((n) => _isToday(n.createdAt, today))
        .toList();
    final earlierList = notifications
        .where((n) => !_isToday(n.createdAt, today))
        .toList();

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Notifications'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (notifications.any((n) => !n.isRead))
            TextButton(
              onPressed: notifier.markAllRead,
              child: Text(
                'Mark all read',
                style: AppTextStyles.bodySm.copyWith(color: AppColors.secondary),
              ),
            ),
          if (notifications.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_rounded, size: 20),
              tooltip: 'Clear all',
              color: AppColors.textMuted,
              onPressed: () => _confirmClear(context, notifier),
            ),
        ],
      ),
      body: notifications.isEmpty
          ? _EmptyState()
          : ListView(
              padding: const EdgeInsets.all(AppSpacing.base),
              children: [
                if (todayList.isNotEmpty) ...[
                  _SectionLabel('Today'),
                  const SizedBox(height: AppSpacing.sm),
                  ...todayList.map((n) => _NotifCard(
                        notif: n,
                        onTap: () => notifier.markRead(n.id),
                      )),
                  const SizedBox(height: AppSpacing.base),
                ],
                if (earlierList.isNotEmpty) ...[
                  _SectionLabel('Earlier'),
                  const SizedBox(height: AppSpacing.sm),
                  ...earlierList.map((n) => _NotifCard(
                        notif: n,
                        onTap: () => notifier.markRead(n.id),
                      )),
                ],
                const SizedBox(height: 32),
              ],
            ),
    );
  }

  bool _isToday(DateTime d, DateTime now) =>
      d.year == now.year && d.month == now.month && d.day == now.day;

  Future<void> _confirmClear(
      BuildContext context, NotificationsNotifier notifier) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear All'),
        content: const Text('Remove all notifications?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
    if (ok == true) notifier.clearAll();
  }
}

// ── Section Label ─────────────────────────────────────────────────────────────
class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(left: 4),
        child: Text(
          text,
          style: AppTextStyles.caption.copyWith(
            color: AppColors.textMuted,
            letterSpacing: 0.5,
          ),
        ),
      );
}

// ── Notification Card ─────────────────────────────────────────────────────────
class _NotifCard extends StatelessWidget {
  const _NotifCard({required this.notif, required this.onTap});
  final NotificationModel notif;
  final VoidCallback onTap;

  static const _typeIcon = {
    NotifType.info: Icons.info_rounded,
    NotifType.success: Icons.check_circle_rounded,
    NotifType.warning: Icons.warning_amber_rounded,
    NotifType.promo: Icons.workspace_premium_rounded,
  };

  static const _typeColor = {
    NotifType.info: AppColors.info,
    NotifType.success: AppColors.success,
    NotifType.warning: AppColors.warning,
    NotifType.promo: AppColors.secondary,
  };

  @override
  Widget build(BuildContext context) {
    final color = _typeColor[notif.type]!;
    final icon = _typeIcon[notif.type]!;

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: AppCard(
        padding: const EdgeInsets.all(12),
        onTap: onTap,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 12),

            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          notif.title,
                          style: AppTextStyles.body.copyWith(
                            fontWeight: FontWeight.w600,
                            color: notif.isRead
                                ? AppColors.textMuted
                                : AppColors.textPrimary,
                          ),
                        ),
                      ),
                      if (!notif.isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.secondary,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    notif.body,
                    style: AppTextStyles.bodySm.copyWith(
                      color: AppColors.textMuted,
                      height: 1.45,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    _formatTime(notif.createdAt),
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textLight,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime d) {
    final diff = DateTime.now().difference(d);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${d.day} ${months[d.month - 1]}';
  }
}

// ── Empty State ───────────────────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.notifications_none_rounded,
                size: 56, color: AppColors.textLight),
            const SizedBox(height: 12),
            const Text('No notifications', style: AppTextStyles.h4),
            const SizedBox(height: 4),
            Text(
              "You're all caught up!",
              style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted),
            ),
          ],
        ),
      );
}

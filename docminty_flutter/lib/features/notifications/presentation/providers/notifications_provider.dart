import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/notification_model.dart';

class NotificationsNotifier extends StateNotifier<List<NotificationModel>> {
  NotificationsNotifier() : super(_seed());

  static List<NotificationModel> _seed() => [
        NotificationModel(
          id: '1',
          title: 'Welcome to DocMinty!',
          body: 'Start creating professional GST documents in seconds. Tap Create to begin.',
          type: NotifType.info,
          isRead: false,
          createdAt: DateTime.now().subtract(const Duration(minutes: 3)),
        ),
        NotificationModel(
          id: '2',
          title: 'Profile Setup Reminder',
          body: 'Add your business name and GSTIN to auto-fill documents faster.',
          type: NotifType.warning,
          isRead: false,
          createdAt: DateTime.now().subtract(const Duration(hours: 1)),
        ),
        NotificationModel(
          id: '3',
          title: 'Upgrade to Business Pro',
          body: 'Get unlimited documents, 5 GB storage, batch CSV processing, and premium templates.',
          type: NotifType.promo,
          isRead: false,
          createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        ),
        NotificationModel(
          id: '4',
          title: 'New: Packing Slip & Payment Voucher',
          body: 'Two new document types have been added. Try them from the Create screen.',
          type: NotifType.success,
          isRead: true,
          createdAt: DateTime.now().subtract(const Duration(days: 2)),
        ),
      ];

  void markRead(String id) {
    state = [
      for (final n in state)
        if (n.id == id) n.copyWith(isRead: true) else n,
    ];
  }

  void markAllRead() {
    state = [for (final n in state) n.copyWith(isRead: true)];
  }

  void addNotification(NotificationModel n) {
    state = [n, ...state];
  }

  void clearAll() {
    state = [];
  }
}

final notificationsProvider =
    StateNotifierProvider<NotificationsNotifier, List<NotificationModel>>(
  (_) => NotificationsNotifier(),
);

final unreadCountProvider = Provider<int>((ref) {
  return ref.watch(notificationsProvider).where((n) => !n.isRead).length;
});

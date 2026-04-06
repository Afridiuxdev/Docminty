package com.docminty.service;

import com.docminty.dto.response.ApiResponse;
import com.docminty.model.Payment;
import com.docminty.model.User;
import com.docminty.repository.PaymentRepository;
import com.docminty.repository.UserRepository;
import com.docminty.repository.AdminNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final AdminNotificationRepository adminNotificationRepository;

    public ApiResponse<List<Map<String, Object>>> getNotifications() {
        List<Map<String, Object>> notifs = new ArrayList<>();

        // --- Recent successful payments (last 30 days) ---
        LocalDateTime last30 = LocalDateTime.now().minusDays(30);
        List<Payment> recentPayments = paymentRepository.findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus.PAID);
        for (Payment p : recentPayments) {
            if (p.getPaidAt() != null && p.getPaidAt().isAfter(last30)) {
                Map<String, Object> n = new LinkedHashMap<>();
                n.put("id", "pay_" + p.getId());
                n.put("type", "success");
                String plan = p.getPlanType() != null ? p.getPlanType().name().replace("_", " ") : "Pro";
                n.put("title", "Payment Received");
                n.put("message", "Rs. " + String.format("%,.0f", p.getAmount() / 100.0) +
                        " from " + p.getUser().getName() + " (" + plan + ")");
                n.put("createdAt", p.getPaidAt());
                n.put("time", formatTime(p.getPaidAt()));
                n.put("isRead", false);
                notifs.add(n);
            }
        }

        // --- Recent signups (last 30 days) ---
        List<User> recentUsers = userRepository.findAllByRoleNotOrderByCreatedAtDesc(User.Role.ADMIN);
        int signupCount = 0;
        for (User u : recentUsers) {
            if (u.getCreatedAt().isAfter(last30)) {
                if (signupCount < 5) { // cap individual signup notifs
                    Map<String, Object> n = new LinkedHashMap<>();
                    n.put("id", "usr_" + u.getId());
                    n.put("type", "info");
                    n.put("title", "New User Signup");
                    n.put("message", u.getName() + " (" + u.getEmail() + ") joined DocMinty");
                    n.put("createdAt", u.getCreatedAt());
                    n.put("time", formatTime(u.getCreatedAt()));
                    n.put("isRead", false);
                    notifs.add(n);
                }
                signupCount++;
            }
        }
        if (signupCount > 5) {
            Map<String, Object> n = new LinkedHashMap<>();
            n.put("id", "usr_bulk");
            n.put("type", "info");
            n.put("title", signupCount + " New User Signups");
            n.put("message", signupCount + " users signed up in the last 30 days");
            n.put("createdAt", LocalDateTime.now());
            n.put("time", "This month");
            n.put("isRead", true);
            notifs.add(n);
        }

        // --- Pro user milestone ---
        long proCount = userRepository.countByRoleNotAndPlan(User.Role.ADMIN, User.Plan.PRO);
        if (proCount > 0) {
            Map<String, Object> n = new LinkedHashMap<>();
            n.put("id", "milestone_pro");
            n.put("type", "success");
            n.put("title", "Pro Subscribers");
            n.put("message", "DocMinty has " + proCount + " active Pro subscriber" + (proCount > 1 ? "s" : ""));
            n.put("createdAt", LocalDateTime.now());
            n.put("time", "Live");
            n.put("isRead", true);
            notifs.add(n);
        }

        // --- Total user milestone ---
        long totalUsers = userRepository.countByRoleNot(User.Role.ADMIN);
        if (totalUsers > 0) {
            Map<String, Object> n = new LinkedHashMap<>();
            n.put("id", "milestone_users");
            n.put("type", "info");
            n.put("title", "User Milestone");
            n.put("message", "DocMinty has reached " + String.format("%,d", totalUsers) + " registered users");
            n.put("createdAt", LocalDateTime.now());
            n.put("time", "Live");
            n.put("isRead", true);
            notifs.add(n);
        }

        // --- Banned / inactive users warning ---
        // --- Persistent notifications from DB ---
        adminNotificationRepository.findAllByOrderByCreatedAtDesc().forEach(dn -> {
            Map<String, Object> n = new LinkedHashMap<>();
            n.put("id", dn.getId().toString());
            n.put("type", dn.getType());
            n.put("title", dn.getTitle());
            n.put("message", dn.getMessage());
            n.put("createdAt", dn.getCreatedAt());
            n.put("isRead", dn.isRead());
            notifs.add(n);
        });

        // Filter out read ones or handle read status consistently
        // Sort by read (unread first), then by natural order
        notifs.sort(Comparator.comparing(m -> m.get("isRead") != null ? (Boolean) m.get("isRead") : false));
        return ApiResponse.ok("Notifications fetched", notifs);
    }

    @Transactional
    public ApiResponse<String> markAllRead() {
        adminNotificationRepository.markAllAsRead();
        return ApiResponse.ok("All marked as read");
    }

    @Transactional
    public ApiResponse<String> deleteNotification(Long id) {
        adminNotificationRepository.deleteById(id);
        return ApiResponse.ok("Notification deleted");
    }

    private String formatTime(LocalDateTime dt) {
        Duration d = Duration.between(dt, LocalDateTime.now());
        long minutes = d.toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " min ago";
        long hours = d.toHours();
        if (hours < 24) return hours + " hr ago";
        long days = d.toDays();
        if (days == 1) return "Yesterday";
        if (days < 30) return days + " days ago";
        return dt.toLocalDate().toString();
    }
}

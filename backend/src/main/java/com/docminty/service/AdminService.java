package com.docminty.service;

import com.docminty.dto.response.*;
import com.docminty.model.*;
import com.docminty.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository     userRepository;
    private final DocumentRepository documentRepository;
    private final PaymentRepository  paymentRepository;
    private final AdminNotificationRepository adminNotificationRepository;
    private final ActivityLogRepository  activityLogRepository;

    public ApiResponse<AdminStatsResponse> getStats() {
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Map<String, Long> breakdown = new LinkedHashMap<>();
        documentRepository.countByDocType().forEach(row ->
            breakdown.put((String) row[0], (Long) row[1]));
        AdminStatsResponse stats = AdminStatsResponse.builder()
            .totalUsers(userRepository.countByRoleNot(User.Role.ADMIN))
            .proUsers(userRepository.countByRoleNotAndPlan(User.Role.ADMIN, User.Plan.PRO))
            .freeUsers(userRepository.countByRoleNotAndPlan(User.Role.ADMIN, User.Plan.FREE))
            .newUsersThisMonth(userRepository.countByRoleNotAndCreatedAtAfter(User.Role.ADMIN, monthStart))
            .totalDocuments(documentRepository.count())
            .documentsToday(documentRepository.countTodayDocuments(todayStart))
            .documentsThisMonth(documentRepository.countByCreatedAtAfter(monthStart))
            .totalRevenue(Optional.ofNullable(paymentRepository.sumTotalPaidAmount(Payment.PaymentStatus.PAID)).orElse(0L))
            .revenueThisMonth(Optional.ofNullable(paymentRepository.sumPaidAmountAfter(Payment.PaymentStatus.PAID, monthStart)).orElse(0L))
            .totalPayments(paymentRepository.countByStatus(Payment.PaymentStatus.PAID))
            .docTypeBreakdown(breakdown)
            .build();
        return ApiResponse.ok("Stats fetched", stats);
    }

    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAllByRoleNotOrderByCreatedAtDesc(User.Role.ADMIN)
            .stream().map(AuthService::toUserResponse).collect(Collectors.toList());
        return ApiResponse.ok("Users fetched", users);
    }

    public ApiResponse<Map<String, Object>> getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Document> docs = documentRepository.findByUser_IdOrderByCreatedAtDesc(userId);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("companyName", user.getCompany());
        data.put("gstin", user.getGstin());
        data.put("address", user.getAddress());
        data.put("city", user.getCity());
        data.put("state", user.getState());
        data.put("pincode", user.getPincode());
        data.put("website", user.getWebsite());
        data.put("plan", user.getPlan().name());
        data.put("status", user.getStatus().name());
        data.put("createdAt", user.getCreatedAt());

        List<Map<String, Object>> docList = docs.stream().map(d -> {
            Map<String, Object> dm = new LinkedHashMap<>();
            dm.put("id", d.getId());
            dm.put("type", d.getDocType());
            dm.put("title", d.getTitle());
            dm.put("referenceNumber", d.getReferenceNumber());
            dm.put("partyName", d.getPartyName());
            dm.put("amount", d.getAmount());
            dm.put("createdAt", d.getCreatedAt());
            return dm;
        }).collect(Collectors.toList());

        data.put("documents", docList);

        return ApiResponse.ok("User details fetched", data);
    }

    public ApiResponse<List<Map<String, Object>>> getAllDocuments() {
        List<Document> docs = documentRepository.findAll(
            org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        List<Map<String, Object>> result = docs.stream().map(d -> {
            Map<String, Object> dm = new LinkedHashMap<>();
            dm.put("id", d.getId());
            dm.put("type", d.getDocType());
            dm.put("title", d.getTitle());
            dm.put("referenceNumber", d.getReferenceNumber());
            dm.put("partyName", d.getPartyName());
            dm.put("amount", d.getAmount());
            dm.put("createdAt", d.getCreatedAt());
            dm.put("userName", d.getUser() != null ? d.getUser().getName() : null);
            dm.put("userEmail", d.getUser() != null ? d.getUser().getEmail() : null);
            dm.put("userId", d.getUser() != null ? d.getUser().getId() : null);
            return dm;
        }).collect(Collectors.toList());
        return ApiResponse.ok("Documents fetched", result);
    }

    public ApiResponse<Map<String, Object>> getDocument(Long docId) {
        Document d = documentRepository.findById(docId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        Map<String, Object> dm = new LinkedHashMap<>();
        dm.put("id", d.getId());
        dm.put("type", d.getDocType());
        dm.put("title", d.getTitle());
        dm.put("templateName", d.getTemplateName());
        dm.put("referenceNumber", d.getReferenceNumber());
        dm.put("partyName", d.getPartyName());
        dm.put("amount", d.getAmount());
        dm.put("formData", d.getFormData());
        dm.put("createdAt", d.getCreatedAt());
        dm.put("userName", d.getUser() != null ? d.getUser().getName() : null);
        dm.put("userEmail", d.getUser() != null ? d.getUser().getEmail() : null);
        return ApiResponse.ok("Document fetched", dm);
    }

    @Transactional
    public ApiResponse<String> banUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.BANNED);
        userRepository.save(user);
        logActivity("admin", "BAN_USER", "Banned user: " + user.getEmail(), "system");
        return ApiResponse.ok("User banned");
    }

    @Transactional
    public ApiResponse<String> unbanUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
        logActivity("admin", "UNBAN_USER", "Unbanned user: " + user.getEmail(), "system");
        return ApiResponse.ok("User unbanned");
    }

    public ApiResponse<List<Map<String, Object>>> getRevenueStats() {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = now.minusMonths(i);
            LocalDateTime start = d.withDayOfMonth(1).atStartOfDay();
            LocalDateTime end   = d.plusMonths(1).withDayOfMonth(1).atStartOfDay();
            Long rev = paymentRepository.sumPaidAmountBetween(Payment.PaymentStatus.PAID, start, end);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", start.getMonth().name());
            m.put("revenue", rev != null ? rev : 0L);
            result.add(m);
        }
        return ApiResponse.ok("Revenue stats fetched", result);
    }

    public ApiResponse<List<Map<String, Object>>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = payments.stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId());
            m.put("paymentId", p.getRazorpayPaymentId());
            m.put("orderId", p.getRazorpayOrderId());
            m.put("amount", p.getAmount());
            m.put("status", p.getStatus().name());
            m.put("plan", p.getPlanType() != null ? p.getPlanType().name() : "PRO");
            m.put("createdAt", p.getCreatedAt());
            m.put("userName", p.getUser() != null ? p.getUser().getName() : "Unknown");
            m.put("userEmail", p.getUser() != null ? p.getUser().getEmail() : "Unknown");
            return m;
        }).collect(Collectors.toList());
        return ApiResponse.ok("Payments fetched", result);
    }

    public ApiResponse<List<AdminNotification>> getNotifications() {
        return ApiResponse.ok("Notifications fetched", adminNotificationRepository.findAllByOrderByCreatedAtDesc());
    }
 
    @Transactional
    public ApiResponse<String> markAllNotificationsRead() {
        adminNotificationRepository.markAllAsRead();
        logActivity("admin", "NOTIFICATIONS_CLEARED", "Marked all admin notifications as read", "system");
        return ApiResponse.ok("All notifications marked as read");
    }
 
    @Transactional
    public ApiResponse<String> deleteNotification(Long id) {
        adminNotificationRepository.deleteById(id);
        logActivity("admin", "NOTIFICATION_DELETED", "Deleted notification " + id, "system");
        return ApiResponse.ok("Notification deleted");
    }

    public ApiResponse<List<ActivityLog>> getActivityLogs() {
        return ApiResponse.ok("Activity logs fetched", activityLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @Transactional
    public void logActivity(String adminEmail, String action, String details, String ip) {
        activityLogRepository.save(ActivityLog.builder()
            .adminEmail(adminEmail)
            .action(action)
            .details(details)
            .ipAddress(ip)
            .build());
    }
}
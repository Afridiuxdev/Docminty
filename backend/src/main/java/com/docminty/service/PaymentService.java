package com.docminty.service;

import com.docminty.dto.request.*;
import com.docminty.dto.response.*;
import com.docminty.model.Payment;
import com.docminty.model.User;
import com.docminty.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final UserRepository    userRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService      emailService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${app.pro.monthly-price}")
    private int monthlyPrice;

    @Value("${app.pro.annual-price}")
    private int annualPrice;

    @Value("${app.enterprise.monthly-price}")
    private int entMonthlyPrice;

    @Value("${app.enterprise.annual-price}")
    private int entAnnualPrice;

    @Transactional
    public ApiResponse<PaymentOrderResponse> createOrder(PaymentOrderRequest req, String email) {
        try {
            User user = userRepository.findByEmail(email).orElseThrow();
            int amount;
            Payment.PlanType planType;

            switch (req.getPlanType()) {
                case "ANNUAL_PRO" -> { amount = annualPrice; planType = Payment.PlanType.ANNUAL_PRO; }
                case "MONTHLY_ENTERPRISE" -> { amount = entMonthlyPrice; planType = Payment.PlanType.MONTHLY_ENTERPRISE; }
                case "ANNUAL_ENTERPRISE" -> { amount = entAnnualPrice; planType = Payment.PlanType.ANNUAL_ENTERPRISE; }
                default -> { amount = monthlyPrice; planType = Payment.PlanType.MONTHLY_PRO; }
            }

            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject options = new JSONObject();
            options.put("amount", amount);
            options.put("currency", "INR");
            options.put("receipt", "docminty_" + user.getId() + "_" + System.currentTimeMillis());
            Order order = client.orders.create(options);

            Payment payment = Payment.builder()
                .user(user)
                .razorpayOrderId(order.get("id"))
                .amount(amount)
                .currency("INR")
                .planType(planType)
                .build();
            paymentRepository.save(payment);

            return ApiResponse.ok("Order created", PaymentOrderResponse.builder()
                .orderId(order.get("id")).amount(amount).currency("INR")
                .keyId(razorpayKeyId).userName(user.getName()).userEmail(user.getEmail())
                .build());
        } catch (Exception e) {
            log.error("Error creating Razorpay order: {}", e.getMessage());
            return ApiResponse.error("Payment initialization failed");
        }
    }

    @Transactional
    public ApiResponse<String> verifyPayment(PaymentVerifyRequest req, String email) {
        try {
            String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String generated = HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
            if (!generated.equals(req.getRazorpaySignature())) {
                return ApiResponse.error("Invalid payment signature");
            }
            Payment payment = paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
            payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
            payment.setRazorpaySignature(req.getRazorpaySignature());
            payment.setStatus(Payment.PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            User user = payment.getUser();
            boolean isEnterprise = payment.getPlanType() == Payment.PlanType.MONTHLY_ENTERPRISE || 
                                 payment.getPlanType() == Payment.PlanType.ANNUAL_ENTERPRISE;
            user.setPlan(isEnterprise ? User.Plan.ENTERPRISE : User.Plan.PRO);
            
            boolean isMonthly = payment.getPlanType() == Payment.PlanType.MONTHLY_PRO || 
                               payment.getPlanType() == Payment.PlanType.MONTHLY_ENTERPRISE;
            user.setPlanExpiresAt(LocalDateTime.now().plusMonths(isMonthly ? 1 : 12));
            userRepository.save(user);
            emailService.sendProUpgradeEmail(user.getEmail(), user.getName(),
                isEnterprise ? (isMonthly ? "Monthly Enterprise" : "Annual Enterprise") :
                             (isMonthly ? "Monthly Pro" : "Annual Pro"));
            return ApiResponse.ok("Payment verified! You are now upgraded.");
        } catch (Exception e) {
            log.error("Payment verification error: {}", e.getMessage());
            return ApiResponse.error("Payment verification failed");
        }
    }
    @Transactional(readOnly = true)
    public ApiResponse<java.util.List<PaymentHistoryResponse>> getPaymentHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        java.util.List<PaymentHistoryResponse> history = paymentRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .map(p -> PaymentHistoryResponse.builder()
                .id(p.getRazorpayOrderId())
                .date(p.getPaidAt() != null ? p.getPaidAt() : p.getCreatedAt())
                .plan(p.getPlanType().toString().replaceAll("_", " "))
                .amount("₹" + (p.getAmount() / 100)) // Razorpay amounts are in paise? Actually service had amount=annualPrice.
                .status(p.getStatus().toString())
                .build())
            .collect(java.util.stream.Collectors.toList());
        return ApiResponse.ok("History fetched", history);
    }
}
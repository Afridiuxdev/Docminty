package com.docminty.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="payments") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @Column(nullable=false,unique=true) private String razorpayOrderId;
    private String razorpayPaymentId; private String razorpaySignature;
    @Column(nullable=false) private Integer amount;
    @Column(nullable=false) private String currency;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private PaymentStatus status = PaymentStatus.CREATED;
    @Enumerated(EnumType.STRING) private PlanType planType;
    @Column(nullable=false,updatable=false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;
    public enum PaymentStatus { CREATED, PAID, FAILED, REFUNDED }
    public enum PlanType { MONTHLY_PRO, ANNUAL_PRO, MONTHLY_ENTERPRISE, ANNUAL_ENTERPRISE }
}

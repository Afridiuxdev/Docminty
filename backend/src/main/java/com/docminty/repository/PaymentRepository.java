package com.docminty.repository;

import com.docminty.model.Payment;
import com.docminty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String orderId);
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    List<Payment> findAllByOrderByCreatedAtDesc();
    long countByStatus(Payment.PaymentStatus status);
    List<Payment> findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status AND p.createdAt > :date")
    Long sumPaidAmountAfter(@Param("status") Payment.PaymentStatus status, @Param("date") LocalDateTime date);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status AND p.createdAt >= :start AND p.createdAt < :end")
    Long sumPaidAmountBetween(@Param("status") Payment.PaymentStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    Long sumTotalPaidAmount(@Param("status") Payment.PaymentStatus status);
}
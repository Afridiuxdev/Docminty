package com.docminty.controller;
import com.docminty.dto.request.PaymentOrderRequest;
import com.docminty.dto.request.PaymentVerifyRequest;
import com.docminty.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/payment") @RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    @PostMapping("/create-order") public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest req, @AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(paymentService.createOrder(req,u.getUsername())); }
    @PostMapping("/verify") public ResponseEntity<?> verify(@RequestBody PaymentVerifyRequest req, @AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(paymentService.verifyPayment(req,u.getUsername())); }
    @GetMapping("/history") public ResponseEntity<?> getHistory(@AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(paymentService.getPaymentHistory(u.getUsername())); }
}

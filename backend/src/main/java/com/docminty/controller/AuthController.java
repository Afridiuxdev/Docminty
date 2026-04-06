package com.docminty.controller;
import com.docminty.dto.request.*; import com.docminty.dto.response.*;
import com.docminty.service.AuthService;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/signup") public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) { return ResponseEntity.ok(authService.signup(req)); }
    @PostMapping("/verify-otp") public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest req) { return ResponseEntity.ok(authService.verifyOtp(req)); }
    @PostMapping("/resend-otp") public ResponseEntity<?> resendOtp(@RequestBody OtpRequest req) { return ResponseEntity.ok(authService.resendOtp(req)); }
    @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) { return ResponseEntity.ok(authService.login(req)); }
    @PostMapping("/verify-login-otp") public ResponseEntity<?> verifyLoginOtp(@RequestBody OtpRequest req) { return ResponseEntity.ok(authService.verifyLoginOtp(req)); }
    @PostMapping("/refresh") public ResponseEntity<?> refresh(@RequestBody Map<String,String> body) { return ResponseEntity.ok(authService.refreshToken(body.get("refreshToken"))); }
    @GetMapping("/me") public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(ApiResponse.ok("User fetched", authService.getMe(u.getUsername()))); }
    @PutMapping("/update-profile") public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails u, @RequestBody ProfileUpdateRequest req) { return ResponseEntity.ok(authService.updateProfile(u.getUsername(), req)); }
    @PostMapping("/forgot-password") public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) { return ResponseEntity.ok(authService.forgotPassword(req)); }
    @PostMapping("/verify-reset-otp") public ResponseEntity<?> verifyResetOtp(@RequestBody OtpRequest req) { return ResponseEntity.ok(authService.verifyResetOtp(req)); }
    @PostMapping("/reset-password") public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) { return ResponseEntity.ok(authService.resetPassword(req)); }
    @DeleteMapping("/delete-account") public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserDetails u, @RequestBody DeleteAccountRequest req) { return ResponseEntity.ok(authService.deleteAccount(u.getUsername(), req)); }
}


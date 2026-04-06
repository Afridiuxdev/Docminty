package com.docminty.service;
import com.docminty.dto.request.*;
import com.docminty.dto.response.*;
import com.docminty.model.*;
import com.docminty.repository.*;
import com.docminty.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime; import java.util.Random; import java.util.UUID;
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;
    private final EmailService emailService;
    private final AdminService adminService;
    @Transactional
    public ApiResponse<AuthResponse> signup(SignupRequest req) {
        User existing = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (existing != null) {
            if (existing.getEmailVerified()) return ApiResponse.error("Email already registered");
            // If already exists but not verified, just trigger a resend
            return resendOtp(new OtpRequest(req.getEmail(), null));
        }
        
        String otp = String.format("%06d", new Random().nextInt(999999));
        User user = User.builder().name(req.getName()).email(req.getEmail())
            .password(encoder.encode(req.getPassword())).phone(req.getPhone())
            .emailOtp(encoder.encode(otp)).otpExpiresAt(LocalDateTime.now().plusMinutes(10)).build();
        userRepo.save(user);
        emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);
        return ApiResponse.ok("Account created! Check your email for OTP.", null);
    }
    
    @Transactional
    public ApiResponse<AuthResponse> resendOtp(OtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow(()->new RuntimeException("User not found"));
        if (user.getEmailVerified()) return ApiResponse.error("Already verified");
        
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setEmailOtp(encoder.encode(otp));
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepo.save(user);
        
        emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);
        return ApiResponse.ok("New OTP sent!", null);
    }
    @Transactional
    public ApiResponse<String> verifyOtp(OtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow(()->new RuntimeException("User not found"));
        if (user.getEmailVerified()) return ApiResponse.error("Already verified");
        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) return ApiResponse.error("OTP expired");
        if (!encoder.matches(req.getOtp(), user.getEmailOtp())) return ApiResponse.error("Invalid OTP");
        user.setEmailVerified(true); user.setEmailOtp(null); user.setOtpExpiresAt(null);
        userRepo.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        return ApiResponse.ok("Email verified!");
    }
    @Transactional
    public ApiResponse<AuthResponse> login(LoginRequest req) {
        try { authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())); }
        catch (BadCredentialsException e) { return ApiResponse.error("Invalid credentials"); }
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        if (user.getStatus()==User.UserStatus.BANNED) return ApiResponse.error("Account banned");
        
        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            String otp = String.format("%06d", new Random().nextInt(999999));
            user.setEmailOtp(encoder.encode(otp));
            user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
            userRepo.save(user);
            emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);
            return ApiResponse.ok("2FA OTP sent to email", AuthResponse.builder()
                .require2fa(true).email(user.getEmail()).build());
        }

        String access = jwt.generateToken(user.getEmail());
        String refresh = createRefreshToken(user);
        adminService.logActivity(user.getEmail(), "LOGIN", "Successful login", "Remote IP");
        return ApiResponse.ok("Login successful", buildAuth(access, refresh, user));
    }

    @Transactional
    public ApiResponse<AuthResponse> verifyLoginOtp(OtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) return ApiResponse.error("OTP expired. Please try logging in again.");
        if (!encoder.matches(req.getOtp(), user.getEmailOtp())) return ApiResponse.error("Invalid OTP");
        user.setEmailOtp(null); user.setOtpExpiresAt(null);
        userRepo.save(user);
        
        String access = jwt.generateToken(user.getEmail());
        String refresh = createRefreshToken(user);
        adminService.logActivity(user.getEmail(), "LOGIN_2FA", "Successful 2FA login", "Remote IP");
        return ApiResponse.ok("Login successful", buildAuth(access, refresh, user));
    }
    @Transactional
    public ApiResponse<AuthResponse> refreshToken(String token) {
        RefreshToken rt = refreshRepo.findByToken(token).orElseThrow(()->new RuntimeException("Invalid refresh token"));
        if (rt.getExpiresAt().isBefore(LocalDateTime.now())) { refreshRepo.delete(rt); return ApiResponse.error("Refresh token expired"); }
        String access = jwt.generateToken(rt.getUser().getEmail());
        String refresh = createRefreshToken(rt.getUser());
        return ApiResponse.ok("Token refreshed", buildAuth(access, refresh, rt.getUser()));
    }
    public UserResponse getMe(String email) { return toUserResponse(userRepo.findByEmail(email).orElseThrow()); }

    @Transactional
    public ApiResponse<UserResponse> updateProfile(String email, ProfileUpdateRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getCompany() != null) user.setCompany(req.getCompany());
        if (req.getGstin() != null) user.setGstin(req.getGstin());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        if (req.getCity() != null) user.setCity(req.getCity());
        if (req.getState() != null) user.setState(req.getState());
        if (req.getPincode() != null) user.setPincode(req.getPincode());
        if (req.getWebsite() != null) user.setWebsite(req.getWebsite());
        if (req.getLogo() != null) user.setLogo(req.getLogo());

        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getTwoFactorEnabled() != null) user.setTwoFactorEnabled(req.getTwoFactorEnabled());
        if (req.getEmailOnCreate() != null) user.setEmailOnCreate(req.getEmailOnCreate());
        if (req.getEmailOnDownload() != null) user.setEmailOnDownload(req.getEmailOnDownload());
        if (req.getMarketingEmails() != null) user.setMarketingEmails(req.getMarketingEmails());
        
        if (req.getCurrentPassword() != null && req.getNewPassword() != null) {
            if (!encoder.matches(req.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            user.setPassword(encoder.encode(req.getNewPassword()));
        }

        userRepo.save(user);
        return ApiResponse.ok("Profile updated successfully", toUserResponse(user));
    }

    public String createRefreshToken(User user) {
        RefreshToken rt = refreshRepo.findByUser(user).orElse(new RefreshToken());
        rt.setUser(user);
        rt.setToken(UUID.randomUUID().toString());
        rt.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshRepo.save(rt); 
        return rt.getToken();
    }
    private AuthResponse buildAuth(String a, String r, User u) {
        return AuthResponse.builder().accessToken(a).refreshToken(r).tokenType("Bearer").user(toUserResponse(u)).build();
    }
    public static UserResponse toUserResponse(User u) {
        return UserResponse.builder().id(u.getId()).name(u.getName()).email(u.getEmail())
            .phone(u.getPhone()).company(u.getCompany()).gstin(u.getGstin())
            .address(u.getAddress()).city(u.getCity()).state(u.getState())
            .pincode(u.getPincode()).website(u.getWebsite()).logo(u.getLogo())
            .plan(u.getPlan().name()).role(u.getRole().name()).emailVerified(u.getEmailVerified())
            .twoFactorEnabled(u.getTwoFactorEnabled())
            .emailOnCreate(u.getEmailOnCreate())
            .emailOnDownload(u.getEmailOnDownload())
            .marketingEmails(u.getMarketingEmails())
            .planExpiresAt(u.getPlanExpiresAt()).createdAt(u.getCreatedAt()).build();
    }

    // ── Forgot Password Flow ──

    @Transactional
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElse(null);
        // Always return success to prevent email enumeration
        if (user == null) return ApiResponse.ok("If that email exists, a reset OTP has been sent.");
        if (!user.getEmailVerified()) return ApiResponse.error("Email not verified. Please verify your account first.");

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setEmailOtp(encoder.encode(otp));
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepo.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), otp);
        return ApiResponse.ok("If that email exists, a reset OTP has been sent.");
    }

    @Transactional
    public ApiResponse<String> verifyResetOtp(OtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getEmailOtp() == null) return ApiResponse.error("No reset OTP requested. Please request a new one.");
        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) return ApiResponse.error("OTP expired. Please request a new one.");
        if (!encoder.matches(req.getOtp(), user.getEmailOtp())) return ApiResponse.error("Invalid OTP. Please check and try again.");
        // OTP is valid — keep it temporarily for the final reset step
        return ApiResponse.ok("OTP verified. You may now reset your password.");
    }

    @Transactional
    public ApiResponse<String> resetPassword(ResetPasswordRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getEmailOtp() == null) return ApiResponse.error("No reset OTP requested. Please request a new one.");
        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) return ApiResponse.error("OTP expired. Please request a new one.");
        if (!encoder.matches(req.getOtp(), user.getEmailOtp())) return ApiResponse.error("Invalid OTP.");
        if (req.getNewPassword() == null || req.getNewPassword().length() < 8)
            return ApiResponse.error("Password must be at least 8 characters.");

        user.setPassword(encoder.encode(req.getNewPassword()));
        user.setEmailOtp(null);
        userRepo.save(user);
        return ApiResponse.ok("Password reset successfully! You can now log in.");
    }

    @Transactional
    public ApiResponse<String> deleteAccount(String email, DeleteAccountRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        // If user has a password (not just Google), verify it
        if (user.getPassword() != null) {
            if (req.getPassword() == null || !encoder.matches(req.getPassword(), user.getPassword())) {
                return ApiResponse.error("Incorrect password. Account deletion aborted.");
            }
        }

        userRepo.delete(user);
        return ApiResponse.ok("Account and all associated documents have been permanently deleted.");
    }
}

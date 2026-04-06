package com.docminty.service;

import com.docminty.dto.response.AuthResponse;
import com.docminty.dto.response.ApiResponse;
import com.docminty.model.User;
import com.docminty.repository.UserRepository;
import com.docminty.util.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Transactional
    public ApiResponse<AuthResponse> loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                return ApiResponse.error("Invalid Google Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleId = payload.getSubject();

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // First time social login -> Create user
                user = User.builder()
                        .name(name)
                        .email(email)
                        .googleId(googleId)
                        .password(null) // Social users don't need password
                        .emailVerified(true) // Google emails are already verified
                        .role(User.Role.USER)
                        .plan(User.Plan.FREE)
                        .build();
                userRepository.save(user);
                log.info("New Google user created: {}", email);
            } else {
                // Existing user -> Link googleId if missing
                if (user.getGoogleId() == null) {
                    user.setGoogleId(googleId);
                    userRepository.save(user);
                }
            }

            if (user.getStatus() == User.UserStatus.BANNED) {
                return ApiResponse.error("Account banned");
            }

            // Generate tokens
            String accessToken = jwtUtil.generateToken(user.getEmail());
            String refreshToken = authService.createRefreshToken(user);

            return ApiResponse.ok("Google login successful", AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .user(AuthService.toUserResponse(user))
                    .build());

        } catch (Exception e) {
            log.error("Google authentication failed", e);
            return ApiResponse.error("Internal Server Error: " + e.getMessage());
        }
    }
}

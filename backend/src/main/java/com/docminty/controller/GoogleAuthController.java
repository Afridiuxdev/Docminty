package com.docminty.controller;

import com.docminty.dto.response.AuthResponse;
import com.docminty.dto.response.ApiResponse;
import com.docminty.service.GoogleAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/google")
@RequiredArgsConstructor
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    @PostMapping
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing idToken"));
        }
        ApiResponse<AuthResponse> res = googleAuthService.loginWithGoogle(idToken);
        return ResponseEntity.ok(res);
    }
}

package com.docminty.dto.response;
import lombok.*;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AuthResponse { private String accessToken; private String refreshToken; private String tokenType; private UserResponse user; private Boolean require2fa; private String email; }

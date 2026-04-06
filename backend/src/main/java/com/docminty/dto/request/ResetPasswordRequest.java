package com.docminty.dto.request;
import lombok.*;
@Data @AllArgsConstructor @NoArgsConstructor
public class ResetPasswordRequest {
    private String email;
    private String otp;
    private String newPassword;
}

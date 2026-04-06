package com.docminty.dto.response;
import lombok.*;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class UserResponse { 
    private Long id; private String name; private String email; 
    private String phone; private String company; private String gstin; 
    private String address; private String city; private String state;
    private String pincode; private String website;
    private String logo;
    private String plan; private String role; private boolean emailVerified; 
    private Boolean twoFactorEnabled;
    private Boolean emailOnCreate;
    private Boolean emailOnDownload;
    private Boolean marketingEmails;
    private LocalDateTime planExpiresAt; private LocalDateTime createdAt; 
}

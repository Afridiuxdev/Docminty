package com.docminty.dto.request;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ProfileUpdateRequest {
    private String name;
    private String phone;
    private String company;
    private String gstin;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String website;
    private String logo;

    private String email;
    private Boolean twoFactorEnabled;
    private Boolean emailOnCreate;
    private Boolean emailOnDownload;
    private Boolean marketingEmails;
    private String currentPassword;
    private String newPassword;
}

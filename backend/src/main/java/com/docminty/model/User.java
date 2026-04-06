package com.docminty.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Entity @Table(name="users") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true) private String email;
    @Column(nullable=true) private String password;
    @Column(nullable=false) private String name;
    @Column(unique=true) private String googleId;
    private String phone; private String company; private String gstin;
    private String address; private String city; private String state;
    private String pincode; private String website;
    @Column(columnDefinition="TEXT") private String logo;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private Role role = Role.USER;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private Plan plan = Plan.FREE;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private UserStatus status = UserStatus.ACTIVE;
    @Column(nullable=false) @Builder.Default private Boolean emailVerified = false;
    @Column(nullable=false) @Builder.Default private Boolean twoFactorEnabled = false;
    @Column(nullable=false) @Builder.Default private Boolean emailOnCreate = true;
    @Column(nullable=false) @Builder.Default private Boolean emailOnDownload = false;
    @Column(nullable=false) @Builder.Default private Boolean marketingEmails = true;
    private String emailOtp; private LocalDateTime otpExpiresAt; private LocalDateTime planExpiresAt;
    @Column(nullable=false,updatable=false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
 
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;
 
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;
 
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private RefreshToken refreshToken;
 
    @PreUpdate public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
    public enum Role { USER, ADMIN }
    public enum Plan { FREE, PRO, ENTERPRISE }
    public enum UserStatus { ACTIVE, INACTIVE, BANNED }
}

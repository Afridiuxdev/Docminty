package com.docminty.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="certificate_verifications") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CertificateVerification {
    @Id @Column(nullable=false,unique=true) private String verificationId;
    @Column(nullable=false) private String recipientName;
    @Column(nullable=false) private String orgName;
    private String certType; private String course; private String issueDate; private String issuedBy;
    @Enumerated(EnumType.STRING) @Builder.Default private CertType documentType = CertType.CERTIFICATE;
    @Column(nullable=false,updatable=false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    public enum CertType { CERTIFICATE, INTERNSHIP }
}

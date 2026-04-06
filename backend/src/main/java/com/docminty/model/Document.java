package com.docminty.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="documents") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Document {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @Column(nullable=false) private String docType;
    @Column(nullable=false) private String title;
    private String templateName; private String referenceNumber;
    private String partyName; private Double amount;
    @Column(columnDefinition="TEXT") private String formData;
    private String cloudinaryUrl;
    private String publicId;
    
    @Column(columnDefinition="BOOLEAN DEFAULT FALSE") 
    @Builder.Default private Boolean isPublic = false;
    
    @Column(unique=true) 
    private String shareToken;

    @Column(nullable=false,updatable=false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}

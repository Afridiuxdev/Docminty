package com.docminty.dto.response;
import lombok.*;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class DocumentResponse { private Long id; private String docType; private String title; private String templateName; private String referenceNumber; private String partyName; private Double amount; private String formData; private String cloudinaryUrl; private Boolean isPublic; private String shareToken; private LocalDateTime createdAt; }

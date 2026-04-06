package com.docminty.dto.request;
import lombok.Data;
@Data public class SaveDocumentRequest { private Long id; private String docType; private String title; private String templateName; private String referenceNumber; private String partyName; private Double amount; private String formData; }

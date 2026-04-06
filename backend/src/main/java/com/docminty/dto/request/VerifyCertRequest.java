package com.docminty.dto.request;
import lombok.Data;
@Data public class VerifyCertRequest { private String verificationId; private String recipientName; private String orgName; private String certType; private String course; private String issueDate; private String issuedBy; private String documentType; }

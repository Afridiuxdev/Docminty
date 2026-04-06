package com.docminty.service;
import com.docminty.dto.request.VerifyCertRequest;
import com.docminty.dto.response.*;
import com.docminty.model.CertificateVerification;
import com.docminty.repository.CertificateVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class CertificateService {
    private final CertificateVerificationRepository certRepo;
    @Transactional
    public ApiResponse<String> saveCertificate(VerifyCertRequest req) {
        CertificateVerification cert = CertificateVerification.builder()
            .verificationId(req.getVerificationId()).recipientName(req.getRecipientName())
            .orgName(req.getOrgName()).certType(req.getCertType())
            .course(req.getCourse()).issueDate(req.getIssueDate()).issuedBy(req.getIssuedBy())
            .documentType(CertificateVerification.CertType.valueOf(
                req.getDocumentType()!=null?req.getDocumentType():"CERTIFICATE"))
            .build();
        certRepo.save(cert);
        return ApiResponse.ok("Certificate registered for verification");
    }
    public ApiResponse<CertificateVerification> verifyCertificate(String id) {
        return certRepo.findByVerificationId(id)
            .map(c->ApiResponse.ok("Certificate is authentic",c))
            .orElse(ApiResponse.error("Certificate not found"));
    }
}

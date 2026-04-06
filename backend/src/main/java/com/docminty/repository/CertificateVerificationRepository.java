package com.docminty.repository;
import com.docminty.model.CertificateVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CertificateVerificationRepository extends JpaRepository<CertificateVerification,String> {
    Optional<CertificateVerification> findByVerificationId(String verificationId);
}

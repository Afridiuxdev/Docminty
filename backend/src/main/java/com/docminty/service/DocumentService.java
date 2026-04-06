package com.docminty.service;
import com.docminty.dto.request.SaveDocumentRequest;
import com.docminty.dto.response.*;
import com.docminty.model.*; import com.docminty.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List; import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository docRepo;
    private final UserRepository userRepo;
    @Transactional
    public ApiResponse<DocumentResponse> saveDocument(SaveDocumentRequest req, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        int limit = (user.getPlan() == User.Plan.ENTERPRISE) ? 50 : (user.getPlan() == User.Plan.PRO ? 20 : 0);
        if (docRepo.countByUser(user) >= limit) {
            String msg = (user.getPlan() == User.Plan.FREE) 
                ? "Free users cannot save documents to cloud. Please upgrade to Business Pro." 
                : user.getPlan() + " plan limit (" + limit + " docs) reached. Please upgrade.";
            return ApiResponse.error(msg);
        }
        Document doc = Document.builder().user(user).docType(req.getDocType()).title(req.getTitle())
            .templateName(req.getTemplateName()).referenceNumber(req.getReferenceNumber())
            .partyName(req.getPartyName()).amount(req.getAmount()).formData(req.getFormData()).build();
        docRepo.save(doc);
        return ApiResponse.ok("Document saved", toResponse(doc));
    }
    public ApiResponse<List<DocumentResponse>> getMyDocuments(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return ApiResponse.ok("Documents fetched", docRepo.findByUserOrderByCreatedAtDesc(user)
            .stream().map(this::toResponse).collect(Collectors.toList()));
    }
    @Transactional
    public ApiResponse<String> deleteDocument(Long id, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Document doc = docRepo.findById(id).orElseThrow(()->new RuntimeException("Not found"));
        if (!doc.getUser().getId().equals(user.getId())) return ApiResponse.error("Unauthorized");
        docRepo.delete(doc); return ApiResponse.ok("Document deleted");
    }
    public ApiResponse<DocumentResponse> verifyDocument(String id) {
        return docRepo.findByReferenceNumber(id)
            .map(d -> ApiResponse.ok("Document verified", toResponse(d)))
            .orElse(ApiResponse.error("Document not found"));
    }
    private DocumentResponse toResponse(Document d) {
        return DocumentResponse.builder().id(d.getId()).docType(d.getDocType()).title(d.getTitle())
            .templateName(d.getTemplateName()).referenceNumber(d.getReferenceNumber())
            .partyName(d.getPartyName()).amount(d.getAmount())
            .formData(d.getFormData()).createdAt(d.getCreatedAt()).build();
    }
}

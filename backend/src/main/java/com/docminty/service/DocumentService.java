package com.docminty.service;
import com.docminty.dto.request.SaveDocumentRequest;
import com.docminty.dto.response.*;
import com.docminty.model.*; import com.docminty.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository docRepo;
    private final UserRepository userRepo;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ApiResponse<DocumentResponse> saveDocument(SaveDocumentRequest req, String email, byte[] fileBytes) {
        User user = userRepo.findByEmail(email).orElseThrow();
        
        // 1. Check Plan Limits
        int limit = getPlanLimit(user.getPlan());
        if (user.getPlan() == User.Plan.FREE) {
            return ApiResponse.error("Free users cannot save documents to cloud. Please upgrade to Pro.");
        }
        
        long currentCount = docRepo.countByUser(user);
        boolean isEdit = req.getId() != null;
        
        if (!isEdit && currentCount >= limit) {
            return ApiResponse.error(user.getPlan() + " plan limit (" + limit + " docs) reached. Please upgrade.");
        }

        Document doc;
        if (isEdit) {
            doc = docRepo.findById(req.getId()).orElseThrow(() -> new RuntimeException("Document not found"));
            if (!doc.getUser().getId().equals(user.getId())) return ApiResponse.error("Unauthorized");
            
            // Delete old file if it exists
            if (doc.getPublicId() != null) {
                try { cloudinaryService.delete(doc.getPublicId()); } catch (Exception e) { /* log and continue */ }
            }
        } else {
            doc = new Document();
            doc.setUser(user);
        }

        // 2. Upload to Cloudinary if file provided
        if (fileBytes != null && fileBytes.length > 0) {
            try {
                String folder = "docminty/" + user.getId() + "/documents";
                var uploadResult = cloudinaryService.upload(fileBytes, folder);
                doc.setCloudinaryUrl((String) uploadResult.get("secure_url"));
                doc.setPublicId((String) uploadResult.get("public_id"));
            } catch (Exception e) {
                return ApiResponse.error("Failed to upload to cloud storage");
            }
        }

        // 3. Update metadata
        doc.setDocType(req.getDocType());
        doc.setTitle(req.getTitle());
        doc.setTemplateName(req.getTemplateName());
        doc.setReferenceNumber(req.getReferenceNumber());
        doc.setPartyName(req.getPartyName());
        doc.setAmount(req.getAmount());
        doc.setFormData(req.getFormData());

        docRepo.save(doc);
        return ApiResponse.ok(isEdit ? "Document updated" : "Document saved", toResponse(doc));
    }

    public ApiResponse<List<DocumentResponse>> getDocuments(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        List<Document> docs;
        
        if (user.getRole() == User.Role.ADMIN) {
            docs = docRepo.findAllByOrderByCreatedAtDesc();
        } else {
            docs = docRepo.findByUserOrderByCreatedAtDesc(user);
        }
        
        return ApiResponse.ok("Documents fetched", docs.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    public ApiResponse<Object> getDocumentCount(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        long used = docRepo.countByUser(user);
        int limit = getPlanLimit(user.getPlan());
        return ApiResponse.ok("Count fetched", Map.of("used", used, "limit", limit, "plan", user.getPlan()));
    }

    @Transactional
    public ApiResponse<String> deleteDocument(Long id, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Document doc = docRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        
        if (!doc.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ApiResponse.error("Unauthorized");
        }

        if (doc.getPublicId() != null) {
            try { cloudinaryService.delete(doc.getPublicId()); } catch (Exception e) { /* log and continue */ }
        }
        
        docRepo.delete(doc);
        return ApiResponse.ok("Document deleted");
    }

    private int getPlanLimit(User.Plan plan) {
        if (plan == User.Plan.ENTERPRISE) return 50;
        if (plan == User.Plan.PRO) return 20;
        return 0;
    }

    public ApiResponse<DocumentResponse> verifyDocument(String id) {
        return docRepo.findByReferenceNumber(id)
            .map(d -> ApiResponse.ok("Document verified", toResponse(d)))
            .orElse(ApiResponse.error("Document not found"));
    }

    @Transactional
    public ApiResponse<String> togglePublicAccess(Long id, String email, boolean isPublic) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Document doc = docRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        
        if (!doc.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ApiResponse.error("Unauthorized");
        }
        
        doc.setIsPublic(isPublic);
        if (isPublic && doc.getShareToken() == null) {
            doc.setShareToken(java.util.UUID.randomUUID().toString());
        }
        
        docRepo.save(doc);
        return ApiResponse.ok("Access updated", doc.getShareToken());
    }

    public ApiResponse<Map<String, String>> getPublicDocument(String token) {
        Document doc = docRepo.findByShareToken(token).orElseThrow(() -> new RuntimeException("Not found"));
        if (doc.getIsPublic() == null || !doc.getIsPublic()) {
            return ApiResponse.error("Document is not public");
        }
        return ApiResponse.ok("Document loaded", Map.of(
            "title", doc.getTitle(),
            "cloudinaryUrl", doc.getCloudinaryUrl() != null ? doc.getCloudinaryUrl() : ""
        ));
    }

    private DocumentResponse toResponse(Document d) {
        return DocumentResponse.builder()
            .id(d.getId())
            .docType(d.getDocType())
            .title(d.getTitle())
            .templateName(d.getTemplateName())
            .referenceNumber(d.getReferenceNumber())
            .partyName(d.getPartyName())
            .amount(d.getAmount())
            .formData(d.getFormData())
            .cloudinaryUrl(d.getCloudinaryUrl())
            .isPublic(d.getIsPublic() != null && d.getIsPublic())
            .shareToken(d.getShareToken())
            .createdAt(d.getCreatedAt())
            .build();
    }
}

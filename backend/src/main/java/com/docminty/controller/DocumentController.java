package com.docminty.controller;
import com.docminty.dto.request.SaveDocumentRequest;
import com.docminty.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/documents") @RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> save(
            @RequestPart("document") SaveDocumentRequest req,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @AuthenticationPrincipal UserDetails u) throws java.io.IOException {
        byte[] bytes = (file != null) ? file.getBytes() : null;
        return ResponseEntity.ok(documentService.saveDocument(req, u.getUsername(), bytes));
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(documentService.getDocuments(u.getUsername()));
    }

    @GetMapping("/count")
    public ResponseEntity<?> count(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(documentService.getDocumentCount(u.getUsername()));
    }

    @PostMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable Long id, @RequestParam boolean isPublic, @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(documentService.togglePublicAccess(id, u.getUsername(), isPublic));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(documentService.deleteDocument(id, u.getUsername()));
    }
}

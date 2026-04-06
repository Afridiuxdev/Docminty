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
    @PostMapping public ResponseEntity<?> save(@RequestBody SaveDocumentRequest req, @AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(documentService.saveDocument(req,u.getUsername())); }
    @GetMapping public ResponseEntity<?> list(@AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(documentService.getMyDocuments(u.getUsername())); }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(documentService.deleteDocument(id,u.getUsername())); }
}

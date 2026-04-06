package com.docminty.controller;

import com.docminty.dto.request.ContactRequest;
import com.docminty.service.DocumentService;
import com.docminty.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    private final EmailService emailService;
    private final DocumentService documentService;

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequest request) {
        emailService.sendContactEmail(request);
        return ResponseEntity.ok().body("{\"message\": \"Contact form submitted successfully\"}");
    }

    @GetMapping("/verify/{id}")
    public ResponseEntity<?> verifyDocument(@PathVariable String id) {
        return ResponseEntity.ok(documentService.verifyDocument(id));
    }
}

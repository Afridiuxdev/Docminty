package com.docminty.controller;
import com.docminty.dto.request.VerifyCertRequest;
import com.docminty.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/verify") @RequiredArgsConstructor
public class CertificateController {
    private final CertificateService certService;
    @PostMapping public ResponseEntity<?> save(@RequestBody VerifyCertRequest req) { return ResponseEntity.ok(certService.saveCertificate(req)); }
    @GetMapping("/{id}") public ResponseEntity<?> verify(@PathVariable String id) { return ResponseEntity.ok(certService.verifyCertificate(id)); }
}

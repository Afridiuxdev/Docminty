package com.docminty.controller;
import com.docminty.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    @GetMapping("/stats")   public ResponseEntity<?> stats()           { return ResponseEntity.ok(adminService.getStats()); }
    @GetMapping("/users")   public ResponseEntity<?> users()           { return ResponseEntity.ok(adminService.getAllUsers()); }
    @PutMapping("/users/{id}/ban")   public ResponseEntity<?> ban(@PathVariable Long id)   { return ResponseEntity.ok(adminService.banUser(id)); }
    @PutMapping("/users/{id}/unban") public ResponseEntity<?> unban(@PathVariable Long id) { return ResponseEntity.ok(adminService.unbanUser(id)); }
    @GetMapping("/users/{id}")       public ResponseEntity<?> userDetails(@PathVariable Long id) { return ResponseEntity.ok(adminService.getUserDetails(id)); }
    @GetMapping("/documents")        public ResponseEntity<?> documents()           { return ResponseEntity.ok(adminService.getAllDocuments()); }
    @GetMapping("/documents/{id}")    public ResponseEntity<?> getDocument(@PathVariable Long id) { return ResponseEntity.ok(adminService.getDocument(id)); }
    @GetMapping("/revenue")          public ResponseEntity<?> revenue()             { return ResponseEntity.ok(adminService.getRevenueStats()); }
    @GetMapping("/payments")         public ResponseEntity<?> payments()            { return ResponseEntity.ok(adminService.getAllPayments()); }
    @GetMapping("/activities")       public ResponseEntity<?> activities()          { return ResponseEntity.ok(adminService.getActivityLogs()); }
}

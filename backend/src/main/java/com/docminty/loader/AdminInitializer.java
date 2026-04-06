package com.docminty.loader;

import com.docminty.model.User;
import com.docminty.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // We'll use a simpler password to avoid any special character issues
        String adminEmail = "docmintyofficial@gmail.com";
        String adminPass  = "Admin123!"; 
        
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        
        if (admin == null) {
            admin = User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPass))
                    .role(User.Role.ADMIN)
                    .plan(User.Plan.PRO)
                    .status(User.UserStatus.ACTIVE)
                    .emailVerified(true)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Final Admin Reset: " + adminEmail + " | Pass: " + adminPass);
        } else {
            admin.setName("Admin");
            admin.setRole(User.Role.ADMIN);
            admin.setPlan(User.Plan.PRO);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setPassword(passwordEncoder.encode(adminPass));
            admin.setEmailVerified(true);
            userRepository.save(admin);
            System.out.println(">>> Final Admin Reset: " + adminEmail + " | Pass: " + adminPass);
        }
    }
}

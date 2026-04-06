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
        String adminEmail = "docmintyofficial@gmail.com";
        String adminPass  = "admin123"; 
        
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPass))
                    .role(User.Role.ADMIN)
                    .plan(User.Plan.PRO)
                    .status(User.UserStatus.ACTIVE)
                    .emailVerified(true)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Default Admin user created successfully.");
        } else {
            System.out.println(">>> Admin user already exists. Skipping creation.");
        }
    }
}

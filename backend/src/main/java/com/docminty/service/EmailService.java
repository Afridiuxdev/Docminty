package com.docminty.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import com.docminty.dto.request.ContactRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String from;
    @Value("${app.frontend.url}")
    private String frontendUrl;

    private String getLogoHtml(boolean isPro) {
        return "<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"margin: 0 auto; margin-bottom: 24px;\"><tr>"
                + "<td style=\"padding-right: 8px; vertical-align: middle;\">"
                + "<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"28\" height=\"28\" style=\"background-color: #0D9488; border-radius: 6px;\">"
                + "<tr><td align=\"center\" valign=\"middle\">"
                + "<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"14\" style=\"border: 2px solid #ffffff; border-radius: 2px; border-collapse: separate;\">"
                + "<tr><td height=\"2\" style=\"line-height:2px;font-size:2px;\">&nbsp;</td></tr>"
                + "<tr><td align=\"center\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"8\" height=\"2\" style=\"background-color:#ffffff;\"><tr><td></td></tr></table></td></tr>"
                + "<tr><td height=\"1\" style=\"line-height:1px;font-size:1px;\">&nbsp;</td></tr>"
                + "<tr><td align=\"center\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"8\" height=\"2\" style=\"background-color:#ffffff;\"><tr><td></td></tr></table></td></tr>"
                + "<tr><td height=\"1\" style=\"line-height:1px;font-size:1px;\">&nbsp;</td></tr>"
                + "<tr><td align=\"center\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"8\"><tr><td width=\"5\" height=\"2\" style=\"background-color:#ffffff;\"></td><td width=\"3\"></td></tr></table></td></tr>"
                + "<tr><td height=\"2\" style=\"line-height:2px;font-size:2px;\">&nbsp;</td></tr>"
                + "</table>"
                + "</td></tr></table>"
                + "</td>"
                + "<td style=\"vertical-align: middle;\">"
                + "<span style=\"font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 20px; color: #111827; letter-spacing: -0.5px;\">"
                + "Doc<span style=\"color: #0D9488;\">Minty</span>"
                + (isPro ? " <span style=\"font-weight: 700; font-size: 11px; color: #D97706; background-color: #FEF9C3; padding: 2px 6px; border-radius: 6px; vertical-align: middle; margin-left: 4px;\">PRO</span>" : "")
                + "</span></td></tr></table>";
    }

    public void sendOtpEmail(String to, String name, String otp) {
        log.info("OTP FOR {}: {}", to, otp);
        System.out.println(">>> DEBUG OTP: " + otp);
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
            h.setFrom(from);
            h.setTo(to);
            h.setSubject("DocMinty - Verify Your Email");
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9FAFB; padding: 40px 20px; color: #111827;\">"
                    + getLogoHtml(false)
                    + "<div style=\"max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px 32px; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.02);\">"
                    + "<h2 style=\"font-size: 20px; font-weight: 700; text-align: center; margin: 0 0 12px;\">Confirm it's you</h2>"
                    + "<p style=\"font-size: 15px; color: #4B5563; text-align: center; line-height: 1.5; margin: 0 0 32px;\">"
                    + "Hi " + name + ", thanks for using DocMinty. To confirm it's you, please use the verification code below."
                    + "</p>"
                    + "<div style=\"background-color: #0D9488; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 32px;\">"
                    + "<span style=\"font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 12px;\">" + otp + "</span>"
                    + "</div>"
                    + "<div style=\"border-top: 1px solid #E5E7EB; padding-top: 24px;\">"
                    + "<div style=\"margin-bottom: 20px;\">"
                    + "<h3 style=\"font-size: 14px; font-weight: 700; margin: 0 0 4px;\">What's DocMinty?</h3>"
                    + "<p style=\"font-size: 13px; color: #6B7280; margin: 0; line-height: 1.5;\">The fastest way to generate GST invoices, salary slips, and professional documents in India.</p>"
                    + "</div>"
                    + "<div>"
                    + "<h3 style=\"font-size: 14px; font-weight: 700; margin: 0 0 4px;\">Need support?</h3>"
                    + "<p style=\"font-size: 13px; color: #6B7280; margin: 0; line-height: 1.5;\">For questions or concerns, reply to this email or contact support@docminty.com.</p>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "<div style=\"text-align: center; margin-top: 32px;\">"
                    + "<p style=\"font-size: 12px; color: #9CA3AF; margin: 0 0 8px;\">Code expires in 10 minutes.</p>"
                    + "<p style=\"font-size: 12px; color: #9CA3AF; margin: 0;\">If you didn't request this, you can safely ignore this email.</p>"
                    + "</div>"
                    + "</div>";

            h.setText(htmlContent, true);
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("OTP email failed", e);
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
            h.setFrom(from);
            h.setTo(to);
            h.setSubject("Welcome to DocMinty!");
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9FAFB; padding: 40px 20px; color: #111827;\">"
                    + getLogoHtml(false)
                    + "<div style=\"max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px 32px; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.02); text-align: center;\">"
                    + "<h2 style=\"font-size: 20px; font-weight: 700; margin: 0 0 12px;\">Welcome, " + name + "!</h2>"
                    + "<p style=\"font-size: 15px; color: #4B5563; line-height: 1.5; margin: 0 0 32px;\">"
                    + "Your free account is ready. Start generating professional documents in seconds."
                    + "</p>"
                    + "<a href=\"" + frontendUrl + "/invoice\" style=\"display: inline-block; background-color: #0D9488; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;\">Create Your First Invoice</a>"
                    + "</div>"
                    + "<div style=\"text-align: center; margin-top: 32px;\">"
                    + "<p style=\"font-size: 12px; color: #9CA3AF; margin: 0;\">© " + java.time.Year.now().getValue() + " DocMinty. All rights reserved.</p>"
                    + "</div>"
                    + "</div>";

            h.setText(htmlContent, true);
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Welcome email failed", e);
        }
    }

    public void sendProUpgradeEmail(String to, String name, String plan) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
            h.setFrom(from);
            h.setTo(to);
            h.setSubject("DocMinty Pro Activated!");
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9FAFB; padding: 40px 20px; color: #111827;\">"
                    + getLogoHtml(true)
                    + "<div style=\"max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px 32px; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.02); text-align: center;\">"
                    + "<div style=\"width: 48px; height: 48px; background-color: #F0FDFA; border-radius: 24px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;\">"
                    + "<span style=\"color: #0D9488; font-size: 24px;\">★</span>"
                    + "</div>"
                    + "<h2 style=\"font-size: 20px; font-weight: 700; margin: 0 0 12px;\">You're now a Pro, " + name + "!</h2>"
                    + "<p style=\"font-size: 15px; color: #4B5563; line-height: 1.5; margin: 0 0 32px;\">"
                    + "Your " + plan + " plan is active. Enjoy unlimited template access, batch generation, and premium tools."
                    + "</p>"
                    + "<a href=\"" + frontendUrl + "/dashboard\" style=\"display: inline-block; background-color: #0D9488; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;\">Go to Dashboard</a>"
                    + "</div>"
                    + "</div>";

            h.setText(htmlContent, true);
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Pro upgrade email failed", e);
        }
    }

    public void sendPasswordResetEmail(String to, String name, String otp) {
        log.info("PASSWORD RESET OTP FOR {}: {}", to, otp);
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
            h.setFrom(from);
            h.setTo(to);
            h.setSubject("DocMinty - Reset Your Password");
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9FAFB; padding: 40px 20px; color: #111827;\">"
                    + getLogoHtml(false)
                    + "<div style=\"max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px 32px; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.02);\">"
                    + "<h2 style=\"font-size: 20px; font-weight: 700; text-align: center; margin: 0 0 12px;\">Reset Your Password</h2>"
                    + "<p style=\"font-size: 15px; color: #4B5563; text-align: center; line-height: 1.5; margin: 0 0 32px;\">"
                    + "Hi " + name + ", we received a request to reset your DocMinty password. Use the code below to proceed."
                    + "</p>"
                    + "<div style=\"background-color: #DC2626; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;\">"
                    + "<span style=\"font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 12px;\">" + otp + "</span>"
                    + "</div>"
                    + "<p style=\"font-size: 13px; color: #6B7280; text-align: center; margin: 0 0 32px;\">This code expires in <strong>10 minutes</strong>.</p>"
                    + "<div style=\"border-top: 1px solid #E5E7EB; padding-top: 24px;\">"
                    + "<h3 style=\"font-size: 14px; font-weight: 700; margin: 0 0 4px;\">Didn't request this?</h3>"
                    + "<p style=\"font-size: 13px; color: #6B7280; margin: 0; line-height: 1.5;\">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>"
                    + "</div>"
                    + "</div>"
                    + "<div style=\"text-align: center; margin-top: 32px;\">"
                    + "<p style=\"font-size: 12px; color: #9CA3AF; margin: 0;\">© " + java.time.Year.now().getValue() + " DocMinty. All rights reserved.</p>"
                    + "</div>"
                    + "</div>";

            h.setText(htmlContent, true);
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Password reset email failed", e);
        }
    }

    public void sendContactEmail(ContactRequest request) {
        log.info("CONTACT FORM SUBMISSION FROM: {}", request.getEmail());
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
            h.setFrom(from);
            // hardcoded official email to receive contact submissions
            h.setTo("docmintyofficial@gmail.com");
            h.setReplyTo(request.getEmail());
            h.setSubject("New Contact Inquiry from " + request.getName());
            
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9FAFB; padding: 40px 20px; color: #111827;\">"
                    + getLogoHtml(false)
                    + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px 32px; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.02);\">"
                    + "<h2 style=\"font-size: 20px; font-weight: 700; margin: 0 0 24px; border-bottom: 2px solid #F3F4F6; padding-bottom: 12px;\">New Contact Form Submission</h2>"
                    + "<table style=\"width: 100%; border-collapse: collapse; margin-bottom: 24px;\">"
                    + "<tr><td style=\"padding: 12px 0; border-bottom: 1px solid #F3F4F6;\"><strong style=\"color: #4B5563; font-size: 14px;\">Name:</strong></td><td style=\"padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px;\">" + request.getName() + "</td></tr>"
                    + "<tr><td style=\"padding: 12px 0; border-bottom: 1px solid #F3F4F6;\"><strong style=\"color: #4B5563; font-size: 14px;\">Email:</strong></td><td style=\"padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px;\">" + request.getEmail() + "</td></tr>"
                    + "<tr><td style=\"padding: 12px 0; border-bottom: 1px solid #F3F4F6;\"><strong style=\"color: #4B5563; font-size: 14px;\">Phone:</strong></td><td style=\"padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px;\">" + request.getPhone() + "</td></tr>"
                    + "</table>"
                    + "<div style=\"background-color: #F9FAFB; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB;\">"
                    + "<h3 style=\"font-size: 14px; font-weight: 700; margin: 0 0 12px; color: #4B5563;\">Message:</h3>"
                    + "<p style=\"font-size: 15px; color: #111827; margin: 0; line-height: 1.6; white-space: pre-wrap;\">" + request.getMessage() + "</p>"
                    + "</div>"
                    + "</div>"
                    + "</div>";

            h.setText(htmlContent, true);
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Contact email failed", e);
        }
    }
}

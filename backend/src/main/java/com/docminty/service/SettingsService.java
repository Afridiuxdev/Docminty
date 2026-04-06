package com.docminty.service;

import com.docminty.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SettingsService {

    @Value("${app.name:DocMinty}")
    private String appName;

    @Value("${app.frontend.url:https://docminty.com}")
    private String frontendUrl;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String smtpHost;

    @Value("${spring.mail.port:587}")
    private String smtpPort;

    @Value("${spring.mail.username:}")
    private String smtpUser;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${app.pro.monthly-price:19900}")
    private long proMonthlyPricePaise;

    @Value("${app.pro.annual-price:199000}")
    private long proAnnualPricePaise;

    // In-memory overlay so admin changes persist within the session
    private final Map<String, String> overrides = new ConcurrentHashMap<>();

    public ApiResponse<Map<String, Object>> getSettings() {
        Map<String, Object> s = new LinkedHashMap<>();

        // General
        s.put("siteName",     get("siteName",     appName));
        s.put("tagline",      get("tagline",      "Free GST Invoice Generator for India"));
        s.put("domain",       get("domain",       frontendUrl));
        s.put("supportEmail", get("supportEmail", "support@docminty.com"));

        // Pricing (convert paise → rupees)
        s.put("proPrice",     get("proPrice",     String.valueOf(proMonthlyPricePaise / 100)));
        s.put("annualPrice",  get("annualPrice",  String.valueOf(proAnnualPricePaise  / 100)));

        // API / Integrations
        s.put("adsenseId",    get("adsenseId",    "ca-pub-XXXXXXXXXXXXXXXX"));
        s.put("razorpayKey",  get("razorpayKey",  razorpayKeyId));
        s.put("apiUrl",       get("apiUrl",       "http://localhost:8080/api"));

        // SMTP (never return passwords)
        s.put("smtpHost",     get("smtpHost",     smtpHost));
        s.put("smtpPort",     get("smtpPort",     smtpPort));
        s.put("smtpUser",     get("smtpUser",     smtpUser));

        // Feature toggles
        s.put("adsEnabled",        Boolean.parseBoolean(get("adsEnabled",        "true")));
        s.put("batchEnabled",      Boolean.parseBoolean(get("batchEnabled",      "true")));
        s.put("signupEnabled",     Boolean.parseBoolean(get("signupEnabled",     "true")));
        s.put("emailVerification", Boolean.parseBoolean(get("emailVerification", "false")));
        s.put("analyticsEnabled",  Boolean.parseBoolean(get("analyticsEnabled",  "true")));
        s.put("maintenanceMode",   Boolean.parseBoolean(get("maintenanceMode",   "false")));

        return ApiResponse.ok("Settings fetched", s);
    }

    public ApiResponse<String> saveSettings(Map<String, String> updated) {
        updated.forEach((key, val) -> {
            if (val != null) overrides.put(key, val);
        });
        return ApiResponse.ok("Settings saved");
    }

    private String get(String key, String defaultVal) {
        return overrides.getOrDefault(key, defaultVal != null ? defaultVal : "");
    }
}

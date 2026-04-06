package com.docminty.config;
import com.docminty.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException; import java.util.List;
@Configuration @EnableWebSecurity @RequiredArgsConstructor
public class SecurityConfig {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(c->c.disable())
            .cors(c->c.configurationSource(corsSource()))
            .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a->a
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/auth/update-profile").authenticated()
                .requestMatchers("/api/auth/**","/api/verify/**","/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public OncePerRequestFilter jwtFilter() {
        return new OncePerRequestFilter() {
            @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
                    throws jakarta.servlet.ServletException, IOException {
                String h = req.getHeader("Authorization");
                if (h != null && h.startsWith("Bearer ")) {
                    String t = h.substring(7);
                    if (jwtUtil.validateToken(t)) {
                        String email = jwtUtil.extractEmail(t);
                        UserDetails ud = userDetailsService.loadUserByUsername(email);
                        var auth = new UsernamePasswordAuthenticationToken(ud,null,ud.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
                chain.doFilter(req,res);
            }
        };
    }
    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOriginPatterns(List.of(
            "https://docminty.com",
            "https://www.docminty.com"
        ));
        c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        c.setAllowedHeaders(List.of("*")); c.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**",c); return s;
    }
    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean public AuthenticationManager authManager(AuthenticationConfiguration c) throws Exception { return c.getAuthenticationManager(); }
}

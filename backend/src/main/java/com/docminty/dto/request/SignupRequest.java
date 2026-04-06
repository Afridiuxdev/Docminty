package com.docminty.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class SignupRequest {
    @NotBlank @Size(min=2,max=60) private String name;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=8,max=40) private String password;
    private String phone;
}

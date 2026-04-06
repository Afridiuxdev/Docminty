package com.docminty.dto.request;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class DeleteAccountRequest {
    private String password;
}

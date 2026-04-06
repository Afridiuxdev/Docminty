package com.docminty.dto.response;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentHistoryResponse {
    private String id;
    private LocalDateTime date;
    private String plan;
    private String amount;
    private String status;
}

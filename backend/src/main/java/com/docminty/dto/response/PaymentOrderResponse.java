package com.docminty.dto.response;
import lombok.*;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class PaymentOrderResponse { private String orderId; private Integer amount; private String currency; private String keyId; private String userName; private String userEmail; }

package com.fullstackdev.ecommerceapp.dto;
import lombok.Data;

// @Data - with final or @NotNull fields
@Data
public class PurchaseResponse {

    private final String orderTrackingNumber;
}

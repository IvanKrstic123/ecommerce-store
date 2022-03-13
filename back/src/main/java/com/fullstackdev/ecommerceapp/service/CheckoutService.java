package com.fullstackdev.ecommerceapp.service;

import com.fullstackdev.ecommerceapp.dto.Purchase;
import com.fullstackdev.ecommerceapp.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}

package com.fullstackdev.ecommerceapp.service;

import com.fullstackdev.ecommerceapp.dao.CustomerRepository;
import com.fullstackdev.ecommerceapp.dto.Purchase;
import com.fullstackdev.ecommerceapp.dto.PurchaseResponse;
import com.fullstackdev.ecommerceapp.entity.Address;
import com.fullstackdev.ecommerceapp.entity.Customer;
import com.fullstackdev.ecommerceapp.entity.Order;
import com.fullstackdev.ecommerceapp.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService{

    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with order items
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with shipping and billing address
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // save to the database
        customerRepository.save(customer);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate random UUID number
        return UUID.randomUUID().toString();
    }
}

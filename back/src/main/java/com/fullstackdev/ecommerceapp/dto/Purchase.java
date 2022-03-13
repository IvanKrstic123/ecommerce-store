package com.fullstackdev.ecommerceapp.dto;

import com.fullstackdev.ecommerceapp.entity.Address;
import com.fullstackdev.ecommerceapp.entity.Customer;
import com.fullstackdev.ecommerceapp.entity.Order;
import com.fullstackdev.ecommerceapp.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}

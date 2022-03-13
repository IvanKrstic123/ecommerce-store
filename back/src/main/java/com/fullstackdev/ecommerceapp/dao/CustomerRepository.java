package com.fullstackdev.ecommerceapp.dao;

import com.fullstackdev.ecommerceapp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}

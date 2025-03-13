package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
}

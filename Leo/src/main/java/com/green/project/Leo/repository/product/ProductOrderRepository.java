package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOrderRepository extends JpaRepository<ProductOrder,Long> {
}

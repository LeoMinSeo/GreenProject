package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
}

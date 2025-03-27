package com.green.project.Leo.dto.admin;

import com.green.project.Leo.entity.product.Product;
import com.green.project.Leo.entity.product.ProductOrder;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {

    private Long pno;

    private String pName;

    private int numOfItem;
}



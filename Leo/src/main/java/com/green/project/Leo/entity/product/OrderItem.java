package com.green.project.Leo.entity.product;

import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemNo;

    @ManyToOne
    @JoinColumn(name = "productOrderNum")
    private ProductOrder productOrder;

    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;

    private int numOfItem;


}

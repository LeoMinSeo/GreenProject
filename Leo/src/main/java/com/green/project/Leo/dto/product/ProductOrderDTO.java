package com.green.project.Leo.dto.product;

import com.green.project.Leo.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public class ProductOrderDTO {
    private Long orderNum;


    private User user;

    private String payment;

    private LocalDateTime orderDate;

    private String shippingAdress;  // 배송 주소
    private String trackingNumber;  // 배송 추적 번호

    private List<OrderItemDTO> orderItems;
}

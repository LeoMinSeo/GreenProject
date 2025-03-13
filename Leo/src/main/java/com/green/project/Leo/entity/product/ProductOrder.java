package com.green.project.Leo.entity.product;

import com.green.project.Leo.entity.User;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderNum;

    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    private String payment;

    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String shippingAdress;  // 배송 주소
    private String trackingNumber;  // 배송 추적 번호
    private String note;//요청사항
    private String totalPrice;
    @OneToMany(mappedBy = "productOrder", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;


}

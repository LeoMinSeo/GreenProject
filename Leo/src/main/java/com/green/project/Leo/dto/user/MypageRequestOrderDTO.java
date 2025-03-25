package com.green.project.Leo.dto.user;

import com.green.project.Leo.entity.product.OrderStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MypageRequestOrderDTO {

    private String orderNo;
    private LocalDateTime orderDate;
    private String productName;
    private String shippingNum;
    private OrderStatus status;

}

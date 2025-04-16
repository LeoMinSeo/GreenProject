package com.green.project.Leo.service.payment;

import com.green.project.Leo.entity.payment.ProductRefund;

import java.util.List;

public interface PaymentService {

    List<ProductRefund> findByAll( Long productId, Long orderNum, Long userId);
}

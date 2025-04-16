package com.green.project.Leo.service.payment;

import com.green.project.Leo.entity.payment.ProductRefund;
import com.green.project.Leo.repository.payment.RefundRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class PaymentServiceImpl  implements PaymentService{
    @Autowired
    private RefundRepository refundRepository;
    @Override
    public List<ProductRefund> findByAll(Long productId, Long orderNum, Long userId) {
        log.info("service refund: productId {},orderNum:{},userId:{}",productId,orderNum,userId);
        return refundRepository.findByAll(productId,orderNum,userId);
    }
}

package com.green.project.Leo.service.payment;

import com.green.project.Leo.dto.admin.payment.ProductRefundDetailDTO;
import com.green.project.Leo.dto.admin.payment.RefundApprovalRequestDTO;
import com.green.project.Leo.entity.payment.ProductRefund;
import com.green.project.Leo.entity.payment.RefundStatus;
import com.green.project.Leo.entity.product.OrderItem;
import com.green.project.Leo.entity.product.Product;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.repository.payment.RefundRepository;
import com.green.project.Leo.repository.product.OrderItemRepository;
import com.green.project.Leo.repository.product.ProductImageRepository;
import com.green.project.Leo.util.DiscordLogger;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PaymentServiceImpl  implements PaymentService {
    @Autowired
    private IamportClient iamportClient;
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private DiscordLogger discordLogger;

    @Override
    public List<ProductRefund> findByAll(Long productId, Long orderNum, Long userId) {
        log.info("service refund: productId {},orderNum:{},userId:{}", productId, orderNum, userId);
        return refundRepository.findByAll(productId, orderNum, userId);
    }

    @Override
    public ProductRefundDetailDTO getRefundDetail(Long refundId) {
        // 환불 정보 조회
        ProductRefund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("환불 정보를 찾을 수 없습니다."));

        // 관련 엔티티 가져오기
        Product product = refund.getProduct();
        ProductOrder order = refund.getProductOrder();
        User user = refund.getUser();

        //아이템 개수받아오기 위해서 조회
        OrderItem orderItem = orderItemRepository.getOrderItemByOrderNumAndPNo(order.getOrderNum(), product.pNo());

        // 생성자를 활용하여 DTO 생성
        ProductRefundDetailDTO dto = new ProductRefundDetailDTO(
                refund.getRefundId(),
                refund.getReason(),
                refund.getStatus(),
                product.pName(),
                product.pPrice(),
                order.getOrderDate(),
                orderItem.getNumOfItem(),
                user.userId(),
                user.userName(),
                user.userPhoneNum(),
                user.userAddress(),
                order.getImp_uid()
        );

        // 이미지 파일명은 생성자에 포함되지 않았으므로 별도로 설정
        dto.setProductImgFileName(productImageRepository.findFileNamesByPNo(product.pNo())
                .stream()
                .findFirst()
                .orElse(null));

        return dto;
    }

    @Transactional
    @Override
    public ResponseEntity<?> approveProductRefund(RefundApprovalRequestDTO requestDTO) {

        ProductRefund refund = refundRepository.findById(requestDTO.getRefundId())
                .orElseThrow(() -> new EntityNotFoundException("환불 정보를 찾을 수 없습니다. ID: " + requestDTO.getRefundId()));


        if (RefundStatus.COMPLETE.equals(refund.getStatus())) {
            return ResponseEntity.badRequest().body("이미 처리된 환불 요청입니다.");
        }

        OrderItem orderItem = orderItemRepository.getOrderItemByOrderNumAndPNo(
                refund.getProductOrder().getOrderNum(),
                refund.getProduct().pNo()
        );


        refund.setStatus(RefundStatus.COMPLETE);
        orderItem.setRefundStatus(RefundStatus.COMPLETE);

        refundRepository.save(refund);
        orderItemRepository.save(orderItem);


        String imp_uid = refund.getProductOrder().getImp_uid();

        try {
            CancelData cancelData = new CancelData(imp_uid, true, requestDTO.getAmount());
            IamportResponse<Payment> response = iamportClient.cancelPaymentByImpUid(cancelData);

            if (response.getCode() == 0) {
                discordLogger.refundRequest(requestDTO.getRefundId()+"번 주문의 환불 승인 완료후 환불 처리 진행하였습니다");
                return ResponseEntity.ok("승인완료 후 정상적으로 환불처리 진행하였습니다.");
            } else {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return ResponseEntity.badRequest().body("환불과정에 오류가 발생했습니다 : " + response.getMessage());
            }
        } catch (IamportResponseException | IOException e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.badRequest().body("아임포트 클라이언트 오류");
        }
    }
}

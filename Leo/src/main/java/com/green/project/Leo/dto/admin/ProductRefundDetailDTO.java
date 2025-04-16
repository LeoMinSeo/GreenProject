package com.green.project.Leo.dto.admin;

import com.green.project.Leo.entity.payment.RefundStatus;

import java.time.LocalDateTime;

public class ProductRefundDetailDTO {
 private Long refundId;
 private String reason;
 private RefundStatus status;
 private String pname;
 private String price;
 private String productImgFileName;
 private LocalDateTime orderDate;

}

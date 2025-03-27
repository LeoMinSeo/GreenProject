package com.green.project.Leo.entity.product;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Accessors(fluent = true)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pNo;

    private String pdesc;

    @Column(nullable = false)
    private String pName;

    @Column(nullable = false)
    private String pPrice;

    private int pStock;

    private String category;

    // 상품 삭제시 이미지도 삭제
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    // 상품 삭제시 리뷰도 삭제
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ProductReview> reviews = new ArrayList<>();

    // 상품 삭제시 주문 아이템은 유지 (필요시 soft delete 또는 별도 처리 필요)
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<OrderItem> orderItems = new ArrayList<>();

    // 상품 삭제시 장바구니 아이템도 삭제
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ProductCart> carts = new ArrayList<>();
}
package com.green.project.Leo.entity;

import com.green.project.Leo.entity.concert.ConcertReview;
import com.green.project.Leo.entity.concert.ConcertTicket;
import com.green.project.Leo.entity.product.ProductCart;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.product.ProductReview;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(fluent = true)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uId;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String userPw;

    private String userName;

    private String userEmail;

    private String userAdress;

    // 유저가 삭제되면 콘서트 티켓도 삭제
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<ConcertTicket> concertTickets = new ArrayList<>();

    // 유저가 삭제되면 콘서트 리뷰도 삭제
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<ConcertReview> concertReviews = new ArrayList<>();

    // 유저가 삭제되면 상품 리뷰도 삭제
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<ProductReview> productReviews = new ArrayList<>();

    // 유저가 삭제되면 장바구니도 삭제
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<ProductCart> productCarts = new ArrayList<>();

    // 유저가 삭제되면 주문은 별도 처리 필요 (주문 기록은 남겨야 하므로)
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductOrder> productOrders = new ArrayList<>();

    @Builder
    public User(String userId, String userPw, String userName, String userEmail, String userAdress) {
        this.userId = userId;
        this.userPw = userPw;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userAdress = userAdress;
    }
}
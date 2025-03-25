package com.green.project.Leo.entity.product;

import com.green.project.Leo.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pReivewNo;

    @Column(nullable = false)
    private double reviewRating;

    @Column(nullable = false)
    private String reviewtext;

    private LocalDate dueDate;

    // 리뷰->상품 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;

    // 리뷰->유저 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;
}
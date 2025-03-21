package com.green.project.Leo.entity.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.green.project.Leo.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @ManyToOne(cascade = CascadeType.ALL)
    @OnDelete( action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "pNo")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;
}

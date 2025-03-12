package com.green.project.Leo.entity.product;

import com.green.project.Leo.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProductCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartNo;


    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;

    private int numOfItem;





}

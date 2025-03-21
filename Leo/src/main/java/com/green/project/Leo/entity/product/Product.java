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
@ToString
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

}

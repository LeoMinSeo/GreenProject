package com.green.project.Leo.entity.product;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@AllArgsConstructor
@Builder
@Getter
@Setter
@NoArgsConstructor
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pImageNo;

    private String fileName;

    @ManyToOne(cascade = {CascadeType.ALL, CascadeType.REMOVE})
    @JoinColumn(name = "pNo")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;
}

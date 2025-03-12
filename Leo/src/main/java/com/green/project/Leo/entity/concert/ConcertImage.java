package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ConcertImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cImageNo;

    private String fileName;

    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;
}

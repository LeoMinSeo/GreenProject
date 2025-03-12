package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Concert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cNo;

    @Column(nullable = false)
    private String cName;

    @Column(nullable = false)
    private int cPrice;

    private String cdesc;

    @Column(nullable = false)
    private String cPlace;

    @OneToMany(mappedBy ="concert",cascade = CascadeType.ALL)
    private List<ConcertSchedule> schedules;


}

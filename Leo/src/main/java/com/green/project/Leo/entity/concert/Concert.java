package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Concert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cNo;

    @Column(nullable = false)
    private String cName;

    @Column(nullable = false)
    private String cPrice;

    private String cdesc;

    @Column(nullable = false)
    private String cPlace;

    @OneToMany(mappedBy ="concert",cascade = CascadeType.ALL)
    private List<ConcertSchedule> schedules;


}

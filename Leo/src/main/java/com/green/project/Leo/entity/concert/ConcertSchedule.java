package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ConcertSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int totalSeats;
    private int availableSeats;

    @Enumerated(EnumType.STRING)
    private ConcertStatus status;


    public boolean isPossibleBooking(){
        return status != ConcertStatus.SOLD_OUT;
    }

}

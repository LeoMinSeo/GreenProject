package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
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

    public  void renewSeats(int numSeats){
        if(availableSeats>= numSeats){
            availableSeats -= numSeats;
            if(availableSeats==0){
                this.status = ConcertStatus.SOLD_OUT;
            }
        }else {
            throw new IllegalStateException("좌석이 부족합니다.");
        }
    }

    public boolean isPossibleBooking(){
        return status != ConcertStatus.SOLD_OUT;
    }

}

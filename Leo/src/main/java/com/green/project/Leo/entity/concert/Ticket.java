package com.green.project.Leo.entity.concert;

import com.green.project.Leo.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Entity
@AllArgsConstructor
@Builder
@Getter
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "scheduleId")
    private ConcertSchedule schedule;

    private int numSeats;

    public  void book(){
        if (!schedule.isPossibleBooking()){
            throw new IllegalStateException("해당 공연은 예매가 불가능합니다");
        }
        schedule.renewSeats(numSeats);
    }


}

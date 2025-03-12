package com.green.project.Leo.entity.concert;

import com.green.project.Leo.entity.User;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class ConcertReservation {
    @Id
    private Long reservationNum;

    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;

    private int numOfTicket;
    private String payment;

    @Enumerated(EnumType.STRING)
    private OrderStatusforConcert status;
    private LocalDate reservationDay;



}

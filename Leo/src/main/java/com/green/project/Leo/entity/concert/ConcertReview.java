package com.green.project.Leo.entity.concert;


import com.green.project.Leo.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ConcertReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cReviewNo;

    @Column(nullable = false)
    private int reviewRating;

    @Column(nullable = false)
    private String reviewtext;

    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
}

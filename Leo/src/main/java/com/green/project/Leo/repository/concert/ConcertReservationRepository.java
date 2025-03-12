package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertReservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConcertReservationRepository extends JpaRepository<ConcertReservation,Long> {
}

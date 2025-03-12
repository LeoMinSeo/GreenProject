package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConcertScheduleRepository extends JpaRepository<ConcertSchedule,Long> {
}

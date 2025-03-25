package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConcertTicketRepository extends JpaRepository<ConcertTicket,Long> {
    @Query(value = "select * from concert_ticket where schedule_id = :id ",nativeQuery = true)
    List<ConcertTicket> findTicketByScheduleId(@Param("id")Long scheduleId);
}

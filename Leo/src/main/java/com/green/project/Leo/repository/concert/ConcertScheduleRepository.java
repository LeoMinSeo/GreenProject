package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface ConcertScheduleRepository extends JpaRepository<ConcertSchedule,Long> {
    @Transactional
    @Modifying
    @Query(value = "delete from concert_schedule where c_no = :cNo" ,nativeQuery = true)
    void deleteScheduleByCno(@Param("cNo")Long cNo);

    @Query(value = "select * from concert_schedule where c_no = :cNo" ,nativeQuery = true)
    List<ConcertSchedule> getScheduleByCno(@Param("cNo")Long cNo);

    @Query(value = "select * from concert_schedule where c_no = :cNo and start_time = :startTime",nativeQuery = true)
    ConcertSchedule getScheduleByCnoAndStartTime(@Param("cNo")Long cNo, @Param("startTime")LocalDateTime startTime);
}

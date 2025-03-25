package com.green.project.Leo.service.concert;


import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ConcertScheduleDTO;
import com.green.project.Leo.dto.concert.ResponseListDTO;
import com.green.project.Leo.dto.concert.ScheduleDtoForBooking;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;

import java.time.LocalDateTime;


public interface ConcertService {
    public PageResponseDTO<ResponseListDTO> getConcertList(PageRequestDTO dto);
    public ConcertDTO getConcertByCno(Long cno);
    public ScheduleDtoForBooking getConcertScheduleByCnoAndStartTime(Long cno , LocalDateTime startTime);
}

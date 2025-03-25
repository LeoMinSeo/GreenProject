package com.green.project.Leo.service.concert;

import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ConcertScheduleDTO;
import com.green.project.Leo.dto.concert.ResponseListDTO;
import com.green.project.Leo.dto.concert.ScheduleDtoForBooking;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.entity.concert.Concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.repository.concert.ConcertImageRepository;
import com.green.project.Leo.repository.concert.ConcertRepository;
import com.green.project.Leo.repository.concert.ConcertScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConcertServiceIplm implements ConcertService{
    @Autowired
    private ConcertRepository concertRepository;
    @Autowired
    private ConcertImageRepository imageRepository;
    @Autowired
    private ConcertScheduleRepository scheduleRepository;

    @Override
    public PageResponseDTO<ResponseListDTO> getConcertList(PageRequestDTO dto) {

        Pageable pageable = PageRequest.of(
                dto.getPage()-1, dto.getSize(), Sort.by("cNo").descending()
        );
        Page<Concert> result = concertRepository.findAll(pageable);
        List<ResponseListDTO> responseListDTO =new ArrayList<>();
        for(Concert i : result){
            String imgName = imageRepository.findFileNameByCNo(i.getCNo());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


            ResponseListDTO listDTO = ResponseListDTO.builder()
                    .cno(i.getCNo())
                    .cname(i.getCName())
                    .cplace(i.getCPlace())
                    .cprice(i.getCPrice())
                    .uploadFileName(imgName)
                    .startTime(i.getSchedules().get(0).getStartTime().format(formatter))
                    .endTime(i.getSchedules().get(i.getSchedules().size()-1).getEndTime().format(formatter))
                    .category(i.getCategory())
                    .build();
            responseListDTO.add(listDTO);
        }
        long totalCount = result.getTotalElements();
        return PageResponseDTO.<ResponseListDTO>withAll()
                .dtoList(responseListDTO)
                .totalCount(totalCount)
                .pageRequestDTO(dto)
                .build();
    }



    @Override
    public ScheduleDtoForBooking getConcertScheduleByCnoAndStartTime(Long cno, LocalDateTime startTime) {
        ConcertSchedule concertSchedule = scheduleRepository.getScheduleByCnoAndStartTime(cno, startTime);
        ScheduleDtoForBooking scheduleDTO = new ScheduleDtoForBooking();
        scheduleDTO.setScheduleId(concertSchedule.getScheduleId());
        scheduleDTO.setStartTime(concertSchedule.getStartTime());
        scheduleDTO.setEndTime(concertSchedule.getEndTime());
        scheduleDTO.setStatus(concertSchedule.getStatus());
        scheduleDTO.setTotalSeats(concertSchedule.getTotalSeats());
        scheduleDTO.setAvailableSeats(concertSchedule.getAvailableSeats());
        ConcertDTO concertDTO = ConcertDTO.builder()
                .cno(concertSchedule.getConcert().getCNo())
                .cname(concertSchedule.getConcert().getCName())
                .cplace(concertSchedule.getConcert().getCPlace())
                .cprice(concertSchedule.getConcert().getCPrice())
                .uploadFileName(imageRepository.findFileNameByCNo(concertSchedule.getConcert().getCNo()))
                .build();
        scheduleDTO.setConcertDTO(concertDTO);

        return scheduleDTO;
    }

    @Override
    public ConcertDTO getConcertByCno(Long cno) {
        Concert result = concertRepository.findById(cno).orElse(null);
        List<ConcertScheduleDTO> scheduleDTOList = new ArrayList<>();
        for(ConcertSchedule i: result.getSchedules()){
            ConcertScheduleDTO scheduleDTO = new ConcertScheduleDTO();
            scheduleDTO.setScheduleId(i.getScheduleId());
            scheduleDTO.setStartTime(i.getStartTime());
            scheduleDTO.setEndTime(i.getEndTime());
            scheduleDTO.setTotalSeats(i.getTotalSeats());
            scheduleDTO.setStatus(i.getStatus());
            scheduleDTOList.add(scheduleDTO);
        }
        ConcertDTO concertDTO = ConcertDTO.builder()
                .cno(result.getCNo())
                .cdesc(result.getCdesc())
                .cname(result.getCName())
                .cprice(result.getCPrice())
                .cplace(result.getCPlace())
                .uploadFileName(imageRepository.findFileNameByCNo(cno))
                .schedulesDtoList(scheduleDTOList)
                .build();
        return concertDTO;
    }
}

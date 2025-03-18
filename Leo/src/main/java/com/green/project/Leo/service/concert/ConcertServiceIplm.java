package com.green.project.Leo.service.concert;

import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ConcertScheduleDTO;
import com.green.project.Leo.dto.concert.ResponseListDTO;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.entity.concert.Concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.repository.concert.ConcertImageRepository;
import com.green.project.Leo.repository.concert.ConcertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConcertServiceIplm implements ConcertService{
    @Autowired
    private ConcertRepository concertRepository;
    @Autowired
    private ConcertImageRepository imageRepository;

    @Override
    public PageResponseDTO<ResponseListDTO> getProductList(PageRequestDTO dto) {

        Pageable pageable = PageRequest.of(
                dto.getPage()-1, dto.getSize(), Sort.by("cNo").descending()
        );
        Page<Concert> result = concertRepository.findAll(pageable);
        List<ResponseListDTO> responseListDTO =new ArrayList<>();
        for(Concert i : result){
            String imgName = imageRepository.findFileNameByCNo(i.getCNo());
            ResponseListDTO listDTO = ResponseListDTO.builder()
                    .cno(i.getCNo())
                    .cname(i.getCName())
                    .cplace(i.getCPlace())
                    .cprice(i.getCPrice())
                    .uploadFileName(imgName)
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
    public ConcertDTO getProductByCno(Long cno) {
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

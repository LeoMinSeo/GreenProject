package com.green.project.Leo.service.concert;


import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ResponseListDTO;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;


public interface ConcertService {
    public PageResponseDTO<ResponseListDTO> getProductList(PageRequestDTO dto);
    public ConcertDTO getProductByCno(Long cno);
}

package com.green.project.Leo.controller;

import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ResponseListDTO;
import com.green.project.Leo.dto.concert.ScheduleDtoForBooking;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.service.concert.ConcertService;
import com.green.project.Leo.util.CustomConcertFileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/concert")
@CrossOrigin("http://localhost:3000")

public class ConcertController {
    @Autowired
    private CustomConcertFileUtil fileUtil;
    @Autowired
    private ConcertService service;
    @GetMapping("/list/{category}")
    public PageResponseDTO<ResponseListDTO> getList(PageRequestDTO dto,@PathVariable(name = "category")String category){

        return service.getConcertList(dto,category);
    }

    @GetMapping("/read/{cno}")
    public ConcertDTO getConcert(@PathVariable(name = "cno")Long cNo){

        return service.getConcertByCno(cNo);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGet(@PathVariable(name = "fileName")String fileName){

        return fileUtil.getFile(fileName);
    }

    @GetMapping("/reservation")
    public ScheduleDtoForBooking forReservation(@RequestParam Long cno,
                                         @RequestParam LocalDateTime startTime){

        return  service.getConcertScheduleByCnoAndStartTime(cno,startTime);
    }



}

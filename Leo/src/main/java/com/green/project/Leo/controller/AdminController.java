package com.green.project.Leo.controller;


import com.green.project.Leo.dto.admin.AdminConcertDTO;
import com.green.project.Leo.dto.admin.AdminProductDTO;
import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.service.Admin.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@Slf4j
@RequestMapping("/admin")
@CrossOrigin("http://localhost:3000")
public class AdminController {
    @Autowired
    private AdminService service;

    @PostMapping("/add/product")
    public String addProduct(@ModelAttribute ProductDTO productDTO){
        log.info("add로 들어옴"+productDTO);
        service.addProduct(productDTO);
        return "성공";

    }
    @PostMapping(value = "/add/concert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String addConcert(
            @RequestPart("concertDTO") ConcertDTO concertDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        // file 파트가 있으면, ConcertDTO 내의 file 필드에 수동 할당하거나 별도로 처리할 수 있음
        concertDTO.setFile(file);

        return service.addConcert(concertDTO);
    }
    @PutMapping("/modify/product")
    public String modifyProduct(@ModelAttribute ProductDTO productDTO){
        service.updateProduct(productDTO);
        return "정상적으로 수정을 완료하였습니다";
    }

    @DeleteMapping("/remove/product/{pno}")
    public String removeProduct(@PathVariable(name = "pno")Long pno){
        service.removeProduct(pno);
        return "삭제성공";
    }

    @PutMapping(value = "/modify/concert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String modifyConcert(
            @RequestPart("concertDTO")ConcertDTO concertDTO,
            @RequestPart(value = "file",required = false) MultipartFile file){
         concertDTO.setFile(file);

        return service.updateConcert(concertDTO);
    }

    @DeleteMapping("/remove/concert/{cno}")
    public String removeConcert(@PathVariable(name = "cno")Long cno){
            service.removeConcert(cno);
        return "삭제성공";
    }

    @GetMapping("/product/list")
    public List<AdminProductDTO> getProductList(){

        return service.getProductList();
    }

    @GetMapping("/product/read/{pno}")
    public ProductDTO getProductByPno(@PathVariable(name = "pno") Long pno){


        return service.getProductByPno(pno);

    }

    @GetMapping("/concert/list")
    public List<AdminConcertDTO> getConcertList(){

        return service.getConcertList();
    }
    @GetMapping("/concert/read/{cno}")
    public ConcertDTO getConcertByCno(@PathVariable(name = "cno") Long cno){

        return service.getConcertByCno(cno);
    }
}

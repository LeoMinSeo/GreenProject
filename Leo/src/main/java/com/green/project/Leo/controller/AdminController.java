package com.green.project.Leo.controller;

import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.service.Admin.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/admin")
@CrossOrigin("http://localhost:3000")
public class AdminController {
    @Autowired
    private AdminService service;

    @PostMapping(value = "/add")
    public String addProduct(@ModelAttribute ProductDTO productDTO){
        log.info("add로 들어옴"+productDTO);
        service.addProduct(productDTO);
        return "성공";

    }

    @PutMapping("/modify")
    public String modifyProduct(@ModelAttribute ProductDTO productDTO){
        service.updateProduct(productDTO);
        return "성공";
    }

    @DeleteMapping("/remove/{pno}")
    public String removeProduct(@PathVariable(name = "pno")Long pno){
        service.removeProduct(pno);
        return "삭제성공";
    }
}

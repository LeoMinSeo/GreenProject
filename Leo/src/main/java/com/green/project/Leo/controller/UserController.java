package com.green.project.Leo.controller;

import com.green.project.Leo.dto.product.ProductCartDTO;

import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;

import com.green.project.Leo.service.user.UserService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/user")
@CrossOrigin("http://localhost:3000")
public class UserController {


    @Autowired
    private UserService service;

    @PostMapping("/addcart")
    public String addCart(@ModelAttribute RequestCartDTO cartDTO){

        return service.addCart(cartDTO);
    }

    @GetMapping("/cartlist/{userId}")
    public List<ProductCartDTO> selectCartlist(@PathVariable(name = "userId")String userId){

        return service.selectCartList(userId);
    }
    @DeleteMapping("/delete/cart/{cartNo}")
    public void deleteProductFromCart(@PathVariable(name = "cartNo")Long cartNo){
        service.deleteFromCart(cartNo);
    }

    @PostMapping("/purchase/{imp_uid}")
    public String purchaseProduct(@PathVariable(name = "imp_uid") String imp_uid, @RequestBody  ProductOrderDTO orderDTO)
            throws IamportResponseException, IOException {

        return service.addOrder(imp_uid,orderDTO);
    }

    @PostMapping("/reservation/{imp_uid}")
    public String reservationTicket(@PathVariable(name = "imp_uid")String imp_uid) throws IamportResponseException,IOException{
                    service.addConcertOrder(imp_uid);
        return "티켓 예매 성공";
    }


}

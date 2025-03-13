package com.green.project.Leo.controller;

import com.green.project.Leo.dto.product.ProductCartDTO;

import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;

import com.green.project.Leo.service.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/purchase")
    public String purchaseProduct(@RequestBody  ProductOrderDTO orderDTO){
        return service.addOrder(orderDTO);
    }

}

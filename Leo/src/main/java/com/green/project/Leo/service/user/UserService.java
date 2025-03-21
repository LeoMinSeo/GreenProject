package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.product.ProductCartDTO;
import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;

import java.util.List;

public interface UserService {
    public String addCart(RequestCartDTO cartDTO);
    public List<ProductCartDTO> selectCartList(String userId);
    public String addOrder(ProductOrderDTO orderDTO);
    public void deleteFromCart(Long cartNo);


}

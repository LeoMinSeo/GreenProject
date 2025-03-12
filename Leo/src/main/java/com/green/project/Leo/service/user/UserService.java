package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.product.ProductCartDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;

import java.util.List;

public interface UserService {
    String addCart(RequestCartDTO cartDTO);
    List<ProductCartDTO> selectCartList(String userId);
}

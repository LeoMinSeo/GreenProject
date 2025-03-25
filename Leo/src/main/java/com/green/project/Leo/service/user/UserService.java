package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.product.ProductCartDTO;
import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;
import com.siot.IamportRestClient.exception.IamportResponseException;

import java.io.IOException;
import java.util.List;

public interface UserService {
    public String addCart(RequestCartDTO cartDTO);
    public List<ProductCartDTO> selectCartList(String userId);
    public String addOrder(String imp_uid,ProductOrderDTO orderDTO) throws IamportResponseException, IOException;
    public void deleteFromCart(Long cartNo);
    public void addConcertOrder(String uid) throws IamportResponseException, IOException;


}

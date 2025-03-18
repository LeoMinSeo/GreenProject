package com.green.project.Leo.service.Admin;

import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.dto.product.ProductOrderDTO;

public interface AdminService {
    public void addProduct(ProductDTO dto);
    public void updateProduct(ProductDTO dto);
    public void removeProduct(Long pno);
    public String addConcert(ConcertDTO concertDTO);
    public String updateConcert(ConcertDTO concertDTO);
    public void removeConcert(Long cno);
}

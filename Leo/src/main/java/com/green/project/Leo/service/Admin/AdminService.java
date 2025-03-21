package com.green.project.Leo.service.Admin;

import com.green.project.Leo.dto.admin.AdminConcertDTO;
import com.green.project.Leo.dto.admin.AdminProductDTO;
import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.dto.product.ProductOrderDTO;

import java.util.List;

public interface AdminService {
    public void addProduct(ProductDTO dto);
    public void updateProduct(ProductDTO dto);
    public void removeProduct(Long pno);
    public String addConcert(ConcertDTO concertDTO);
    public String updateConcert(ConcertDTO concertDTO);
    public void removeConcert(Long cno);
    public List<AdminProductDTO> getProductList();
    public ProductDTO getProductByPno(Long pno);
    public List<AdminConcertDTO> getConcertList();
    public ConcertDTO getConcertByCno(Long cno);
}

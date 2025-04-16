package com.green.project.Leo.service.Admin;

import com.green.project.Leo.dto.admin.*;
import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.dto.product.ResponseProductReviewDTO;
import com.green.project.Leo.dto.user.UserDTO;

import java.util.List;
import java.util.Map;

public interface AdminService {
    public void addProduct(ProductDTO dto);
    public void updateProduct(ProductDTO dto);
    public void removeProduct(Long pno);
    public String addConcert(ConcertDTO concertDTO);
    public String updateConcert(ConcertDTO concertDTO,List<Long> deleteScheduleIds);
    public void removeConcert(Long cno);
    public List<AdminProductDTO> getProductList();
    public ProductDTO getProductByPno(Long pno);
    public List<AdminConcertDTO> getConcertList();
    public ConcertDTO getConcertByCno(Long cno);
    public List<ProductOrderListDTO> getProductOrderList();
    public ProductOrderDetailDTO getProductOrderDetail(Long orderNum);
    public void modifyProductOrder(RequestOrderModifyDTO modifyDTO);
    public List<ConcertTicketListDTO> getConcertTicketList();
    public ConcertTicketDetailDTO getConcertTicketDetail(Long id);
    public void modifyConcertTicket(RequestTicketModifyDTO modifyDTO);
    public List<Map<Integer, Long[]>>getStatisticsData(int yearData);
    public List<ResponseProductReviewDTO> getReviewList(Long pno);
    public void deleteReview(Long reviewNo);
    public List<UserDTO> getUserList();
    public List<ProductRefundListDTO> getProductRefundList();
}

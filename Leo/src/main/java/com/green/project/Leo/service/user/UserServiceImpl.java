package com.green.project.Leo.service.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.green.project.Leo.dto.concert.ConcertCustomDataDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.dto.product.*;

import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertTicket;
import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import com.green.project.Leo.entity.product.*;

import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.concert.ConcertTicketRepository;
import com.green.project.Leo.repository.product.*;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private IamportClient iamportClient;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductCartRepository cartRepository;
    @Autowired
    private ProductImageRepository imageRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductOrderRepository orderRepository;
    @Autowired
    private OrderItemRepository itemRepository;
    @Autowired
    private ConcertTicketRepository ticketRepository;
    @Override
    public String addCart(RequestCartDTO cartDTO) {
        ProductCart result = cartRepository.selectDuplicate(cartDTO.getUserId(), cartDTO.getPNo());
        if(result == null) {
            ProductCart productCart = ProductCart.builder()
                    .product(productRepository.findById(cartDTO.getPNo()).orElse(null))
                    .user(userRepository.selectByUserId(cartDTO.getUserId()))
                    .numOfItem(cartDTO.getNumOfItem())
                    .build();
            cartRepository.save(productCart);
        }else {
            result.setNumOfItem(result.getNumOfItem()+cartDTO.getNumOfItem());
            System.out.println("동일한상품이라 수량만 증가"+result.getNumOfItem());
            cartRepository.save(result);
        }

        return "장바구니에 담았습니다.";
    }

    @Override
    public List<ProductCartDTO> selectCartList(String userId) {
        List<ProductCart> result = cartRepository.selectCartByUserId(userId);
        List<ProductCartDTO> cartDTOList = new ArrayList<>();
        for(ProductCart i : result){
            List<String> imglist = imageRepository.findFileNamesByPNo(i.getProduct().pNo());
            ProductDTO productDTO = modelMapper.map(i.getProduct(),ProductDTO.class);
            productDTO.setUploadFileNames(imglist);
            ProductCartDTO cartDTO = ProductCartDTO.builder()
                    .cartNo(i.getCartNo())
                    .userDTO(modelMapper.map(i.getUser(), UserDTO.class))
                    .productDTO(productDTO)
                    .numofItem(i.getNumOfItem())
                    .build();
            cartDTO.getUserDTO().setUserPw(null);
            cartDTOList.add(cartDTO);
        }

        return cartDTOList;
    }

    @Override
    public String addOrder(String imp_uid,ProductOrderDTO orderDTO) throws IamportResponseException, IOException {

        IamportResponse<Payment> payment = iamportClient.paymentByImpUid(imp_uid);
        Payment paymentInformation = payment.getResponse();
        orderDTO.setPayment(paymentInformation.getPayMethod());
        orderDTO.setCardName(paymentInformation.getCardName());
        User user = new User();
        user.uId(orderDTO.getUserdto().getUid());
        ProductOrder productOrder = new ProductOrder();
        productOrder.setUser(user);
        productOrder.setPayment(orderDTO.getPayment());
        productOrder.setCardName(orderDTO.getCardName());
        productOrder.setStatus(OrderStatus.PAY_COMPLETED);
        productOrder.setShippingAdress(orderDTO.getShippingAdress());
        productOrder.setOrderDate(LocalDateTime.now());
        productOrder.setNote(orderDTO.getNote());
        productOrder.setTotalPrice(orderDTO.getTotalPrice());


        List<OrderItemDTO> itemListDto = orderDTO.getOrderItems();
        List<OrderItem> itemlist = new ArrayList<>();
        for(OrderItemDTO i : itemListDto){
            Product product = productRepository.findById(i.getPno()).orElseThrow();
            product.pStock(product.pStock() - i.getNumOfItem());
            Product updateProduct = productRepository.save(product);
            OrderItem orderItem = OrderItem.builder()
                    .numOfItem(i.getNumOfItem())
                    .product(updateProduct)
                    .productOrder(productOrder)
                    .build();
            itemlist.add(orderItem);
        }

        productOrder.setOrderItems(itemlist);
        ProductOrder orderInformation = orderRepository.save(productOrder);

        LocalDate date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formatDate = date.format(formatter);
        String ordercode =  formatDate+orderInformation.getOrderNum();
        cartRepository.deleteById(orderDTO.getUserdto().getUid());

        return "주문번호:"+ordercode;
    }

    @Override
    public void deleteFromCart(Long cartNo) {
        cartRepository.deleteById(cartNo);
    }

    @Override
    public void addConcertOrder(String uid) throws IamportResponseException, IOException {
        IamportResponse<Payment> payment = iamportClient.paymentByImpUid(uid);
        Payment paymentInformation = payment.getResponse();
        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.KOREA);
        String customDataJson = paymentInformation.getCustomData();
        ObjectMapper objectMapper = new ObjectMapper();
        ConcertCustomDataDTO customData = objectMapper.readValue(customDataJson, ConcertCustomDataDTO.class);
        User user =  new User();
        user.uId(customData.getUid());
        ConcertTicket concertTicket =  ConcertTicket.builder()
                .shippingAddress(paymentInformation.getBuyerAddr())
                .buyerName(paymentInformation.getBuyerName())
                .buyerTel(paymentInformation.getBuyerTel())
                .price(formatter.format(paymentInformation.getAmount())+"원")
                .buyMethod(paymentInformation.getPayMethod())
                .concertSchedule(ConcertSchedule.builder().scheduleId(customData.getScheduleId()).build())
                .ticketQuantity(customData.getTicketQuantity())
                .deliveryMethod(customData.getDeliveryMethod())
                .paymentDate(LocalDate.now())
                .status(OrderStatusForConcert.RESERVATION)
                .user(user)
                .build();

         ticketRepository.save(concertTicket);


    }


}

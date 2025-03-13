package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.UserDTO;
import com.green.project.Leo.dto.product.*;

import com.green.project.Leo.entity.User;
import com.green.project.Leo.entity.product.*;

import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService{
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
    @Override
    public String addCart(RequestCartDTO cartDTO) {
        ProductCart result = cartRepository.selectDuplicate(cartDTO.getUserId(), cartDTO.getPNo());
        if(result == null) {
            ProductCart productCart = ProductCart.builder()
                    .product(productRepository.findById(cartDTO.getPNo()).orElse(null))
                    .user(userRepository.seletByUserId(cartDTO.getUserId()))
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
    public String addOrder(ProductOrderDTO orderDTO) {
        System.out.println(orderDTO);
        User user = new User();
        user.uId(orderDTO.getUserdto().getUid());
        ProductOrder productOrder = new ProductOrder();
        productOrder.setUser(user);
        productOrder.setPayment(orderDTO.getPayment());
        productOrder.setStatus(OrderStatus.PAY_COMPLETED);
        productOrder.setShippingAdress(orderDTO.getShippingAdress());
        productOrder.setOrderDate(LocalDateTime.now());
        productOrder.setNote(orderDTO.getNote());
        productOrder.setTotalPrice(orderDTO.getTotalPrice());


        List<OrderItemDTO> itemListDto = orderDTO.getOrderItems();
        List<OrderItem> itemlist = new ArrayList<>();
        for(OrderItemDTO i : itemListDto){
            Product product = new Product();
            product.pNo(i.getPno());
            OrderItem orderItem = OrderItem.builder()
                    .numOfItem(i.getNumOfItem())
                    .product(product)
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
        return "주문번호:"+ordercode;
    }




}

package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.UserDTO;
import com.green.project.Leo.dto.product.ProductCartDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;

import com.green.project.Leo.entity.product.Product;
import com.green.project.Leo.entity.product.ProductCart;

import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.ProductCartRepository;
import com.green.project.Leo.repository.product.ProductImageRepository;
import com.green.project.Leo.repository.product.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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


}

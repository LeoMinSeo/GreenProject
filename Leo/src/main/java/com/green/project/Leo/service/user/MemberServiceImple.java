package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.user.MypageRequestOrderDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.User;
import com.green.project.Leo.entity.product.OrderItem;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.OrderItemRepository;
import com.green.project.Leo.repository.product.ProductOrderRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class MemberServiceImple implements MemberService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductOrderRepository productOrderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public void registerMember(UserDTO userDTO) {
        System.out.println("서비스 : " +userDTO);
        User user = userRepository.convertToEntity(userDTO);
        userRepository.save(user);
    }

    //아이디 중복 확인
    @Override
    public Boolean checkUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }


    // 로그인 처리
    @Override
    public UserDTO login(String userId, String userPw) {
        User user = userRepository.findByUserId(userId);
        if (user != null && user.userPw().equals(userPw)) {

            // 비밀번호와 아이디 일치하면, UserDTO 반환
            return modelMapper.map(user, UserDTO.class);
        }
        return null; // 아이디 또는 비밀번호 안 맞으면 null
    }

    //마이페이지 정보 조회
    @Override
    public UserDTO getProfile(String userId) {
        User user = userRepository.findByUserId(userId);

        // 사용자가 존재하면 DTO로 변환하여 반환
        if (user != null) {
            return modelMapper.map(user, UserDTO.class);
        }
        // 사용자 없으면 null 반환
        return null;
    }

    //마이페이지 정보 수정
    @Override
    public UserDTO updateProfile(String userId, UserDTO userDTO) {

        User existingMember = userRepository.findByUserId(userId);

        existingMember.userName(userDTO.getUserName()); // fluent 방식으로 setter 사용
        existingMember.userEmail(userDTO.getUserEmail());
        existingMember.userAdress(userDTO.getUserAdress());

        User updatedMember = userRepository.save(existingMember);
        UserDTO updatedUserDTO = modelMapper.map(updatedMember, UserDTO.class);

        return updatedUserDTO;
    }

    //아이디 비밀번호 찾기
    @Override
    public Optional<String> findId(String userName, String userEmail) {
       Optional<User> user = userRepository.findByUserNameAndUserEmail(userName,userEmail);
       return user.map(User::userId);

    }

    @Override
    public Optional<String> findPw(String userName, String userId) {
        Optional<User> user = userRepository.findByUserNameAndUserId(userName, userId);
        return user.map(User::userPw);
    }

    @Override
    public List<MypageRequestOrderDTO> findOrderByUid(Long uid) {
        List<ProductOrder> orderList = productOrderRepository.getOrderList(uid);
        System.out.println("오더리스트는 가져옴");

                List<MypageRequestOrderDTO> result = new ArrayList<>();
            for(ProductOrder i : orderList) {
                List<OrderItem> orderItem = orderItemRepository.getOrderItemByOrderNum(i.getOrderNum());
                System.out.println("오더아이템"+orderItem.get(0));
                System.out.println("오더넘"+i.getOrderNum());
                MypageRequestOrderDTO myPageOrderDto = new MypageRequestOrderDTO();
                myPageOrderDto.setOrderDate(i.getOrderDate());
                System.out.println("오더아이템전");
                myPageOrderDto.setProductName(orderItem.get(0).getProduct().pName() + "외 " + (i.getOrderItems().size() - 1) + "건");
                System.out.println("오더아이템후");
                myPageOrderDto.setStatus(i.getStatus());
                myPageOrderDto.setShippingNum(i.getTrackingNumber() != null && !i.getShippingAdress().isEmpty() ? i.getShippingAdress() : "운송장 등록 전입니다");
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
                myPageOrderDto.setOrderNo(i.getOrderDate().format(formatter) + i.getOrderNum());

                result.add(myPageOrderDto);
            }


        return result;
    }

}
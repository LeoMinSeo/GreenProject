package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.product.OrderItemDTO;
import com.green.project.Leo.dto.user.MyPageRequestOrderDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.dto.user.userReviewDTO;
import com.green.project.Leo.entity.User;
import com.green.project.Leo.entity.product.OrderItem;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.product.ProductReview;
import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.OrderItemRepository;
import com.green.project.Leo.repository.product.ProductOrderRepository;
import com.green.project.Leo.repository.product.ProductReviewRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;

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

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Override
    public  ResponseEntity<Map<String, Object>> registerMember(UserDTO userDTO){
        System.out.println("서비스 : " + userDTO);
        User user = userRepository.convertToEntity(userDTO);
        userRepository.save(user);

        // 응답을 JSON 객체로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원 가입이 완료!!!!!.");

        return ResponseEntity.ok(response);
    }

    //아이디 중복 확인
    @Override
    public ResponseEntity<Map<String, Object>> checkUserId(String userId) {
        Boolean isUserIdExist = userRepository.existsByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        if (isUserIdExist) {
            System.out.println("중복된 아이디니까 사용 못해요");
            response.put("success", false);
            response.put("message", "아이디가 이미 존재합니다.");
        } else {
            System.out.println("사용 가능한 아이디니까 사용해요");
            response.put("success", true);
            response.put("message", "아이디가 사용 가능합니다.");
        }

        return ResponseEntity.ok(response);
    }


    // 로그인 처리
    @Override
    public ResponseEntity<Map<String, Object>> login(UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();

        // 입력값 검증
        if (userDTO.getUserId() == null || userDTO.getUserPw() == null) {
            response.put("success", false);
            response.put("message", "아이디와 비밀번호를 모두 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 사용자 정보 조회
        User user = userRepository.findByUserId(userDTO.getUserId());

        // 존재하지 않는 아이디인 경우
        if (user == null) {
            System.out.println("그런 아이디는 존재하지 않아요");
            response.put("success", false);
            response.put("data", "존재하지 않는 아이디입니다.");
            return ResponseEntity.ok(response);
        }

        // 비밀번호가 일치하지 않는 경우
        if (!userDTO.getUserPw().equals(user.userPw())) {
            System.out.println("비밀번호 틀렸어요.");
            response.put("success", false);
            response.put("data", "아이디 또는 비밀번호가 잘못되었습니다.");
            return ResponseEntity.ok(response);
        }

        // 탈퇴한 회원인 경우
        if (user.isDeleted()) {
            System.out.println("탈퇴한 회원이네요");
            response.put("success", false);
            response.put("data", "탈퇴하신분이에요");
            return ResponseEntity.ok(response);
        }

        // 로그인 성공 - UserDTO 변환
        UserDTO data = modelMapper.map(user, UserDTO.class);

        // 응답 생성
        System.out.println("올바른 로그인이네요.");
        response.put("success", true);
        response.put("data", data);
        return ResponseEntity.ok(response);
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
        existingMember.userAddress(userDTO.getUserAddress());

        User updatedMember = userRepository.save(existingMember);
        UserDTO updatedUserDTO = modelMapper.map(updatedMember, UserDTO.class);

        return updatedUserDTO;
    }

    //아이디 찾기
    @Override
    public ResponseEntity<Map<String, Object>> findId(String userName, String userEmail) {

        System.out.println(userName+"메일"+userEmail);
        Optional<User> user = userRepository.findByUserNameAndUserEmail(userName,userEmail);
        System.out.println(user.map(User::userId));

        Map<String, Object> response = new HashMap<>();

        if(user.isPresent()){
            if(user.get().isDeleted()){
                response.put("success", false);
                response.put("data","탈퇴한 계정입니다.");
            }else {
                response.put("success", true);
                response.put("data", user.get().userId());
            }
        }else {
            response.put("success", false);
            response.put("data", "사용자가 없습니다.");
        }

        return ResponseEntity.ok(response);
    }

    //비밀번호 찾기
    @Override
    public  ResponseEntity<Map<String, Object>> findPw(String userName, String userId) {
        Optional<User> user = userRepository.findByUserNameAndUserId(userName, userId);
        System.out.println(user.map(User::userPw));

        Map<String, Object> response = new HashMap<>();  // 응답을 담을 맵

        if(user.isPresent()){

            if(user.get().isDeleted()){
                response.put("success", false);
                response.put("data", "탈퇴한 계정");
            }else{
                response.put("success", true);
                response.put("data", user.get().userPw());
            }
        }else {
         response.put("success", false);
         response.put("data", "찾을 수 없는 사용자");
        }
        return ResponseEntity.ok(response);

    }

    //주문내역 조회(order)
    @Override
    public List<MyPageRequestOrderDTO> findOrderByUid(Long uid) {
        System.out.println("오더가져오러옴");

        // 사용자의 주문 목록 가져오기
        List<ProductOrder> orderList = productOrderRepository.getOrderList(uid);
        System.out.println("오더리스트는 가져옴");

        List<MyPageRequestOrderDTO> result = new ArrayList<>();

        for(ProductOrder i : orderList) {
            // 주문번호에 해당하는 상품 리스트 가져오기
            List<OrderItem> orderItems = orderItemRepository.getOrderItemByOrderNum(i.getOrderNum());
            System.out.println("오더넘버"+i.getOrderNum());

            // 상품 정보를 저장할 리스트 생성
            List<OrderItemDTO> orderItemDTOList = new ArrayList<>();

            // 상품 리스트를 DTO로 변환
            for (OrderItem orderItem : orderItems) {

                OrderItemDTO orderItemDTO = new OrderItemDTO();
                orderItemDTO.setPno(orderItem.getProduct().pNo()); // 상품 번호
                orderItemDTO.setProductName(orderItem.getProduct().pName());// 상품명
                orderItemDTO.setImgFileName(orderItem.getProduct().images().get(0).getFileName());
                orderItemDTO.setNumOfItem(orderItem.getNumOfItem()); // 구매 수량
                orderItemDTO.setProductPrice(orderItem.getProduct().pPrice());// 상품 가격
                orderItemDTO.setHasReview(productReviewRepository.existsByProduct_PNoAndProductOrder_OrderNum(orderItem.getProduct().pNo(),i.getOrderNum()));
                orderItemDTO.setRealOrderNum(i.getOrderNum());
                orderItemDTOList.add(orderItemDTO);
            }

            // 주문 정보 DTO 생성
                MyPageRequestOrderDTO myPageOrderDto = new MyPageRequestOrderDTO();
                myPageOrderDto.setOrderDate(i.getOrderDate());
                myPageOrderDto.setStatus(i.getStatus()); // 주문 상태 설정
                myPageOrderDto.setOrderItems(orderItemDTOList);// 상품 목록 추가

            // 운송장 정보 설정
            if (i.getTrackingNumber() != null && i.getShippingAdress() != null && !i.getShippingAdress().isEmpty()) {
                myPageOrderDto.setShippingNum(i.getShippingAdress());
            } else {
                myPageOrderDto.setShippingNum("운송장 등록 전입니다");
            }

            // 주문번호 생성 (주문 날짜 + 주문 번호 조합)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            String orderNum = i.getOrderNum() != null ? i.getOrderNum().toString() : "000000";
            myPageOrderDto.setOrderNo(i.getOrderDate().format(formatter) + orderNum);

            result.add(myPageOrderDto);
        }

        return result;
    }

    //내 리뷰 조회
    @Override
    public List<userReviewDTO> getMyReview(Long uid) {
        System.out.println("내 리뷰 조회 중");
        List<ProductReview> myReviewList = productReviewRepository.getReviewList(uid);
        List<userReviewDTO> userReviewList = new ArrayList<>();

        for(ProductReview p : myReviewList){
            userReviewDTO userReviewDTO = com.green.project.Leo.dto.user.userReviewDTO.builder()
                    .pReviewNo(p.getPReviewNo())
                    .reviewtext(p.getReviewtext())
                    .reviewRating(p.getReviewRating())
                    .dueDate(p.getDueDate())
                    .pname(p.getProduct().pName())
                    .pno(p.getProduct().pNo())
                    .build();

            userReviewList.add(userReviewDTO);
        }
        return userReviewList;
    }


    // 회원 탈퇴 삭제
    @Override
    public Boolean deleteUser(String userId, String userPw) {
        System.out.println("service :" +userId+", password:"+userPw);

        User user = userRepository.findByUserId(userId);
        System.out.println("user: 100) " +user);

        if (user == null || !user.userPw().equals(userPw)) {
            return false; // 사용자가 없거나 비밀번호가 일치하지 않음
        }
        user.isDeleted(true); // 사용자를 삭제 상태로 표시
        userRepository.save(user);
        return true;
    }

    @Override
    public User selectByUserId(String userId) {
        return userRepository.selectByUserId(userId);
    }



}
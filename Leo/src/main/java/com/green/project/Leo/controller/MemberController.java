package com.green.project.Leo.controller;

import com.green.project.Leo.dto.product.RequestProductReviewDTO;
import com.green.project.Leo.dto.user.MyPageRequestOrderDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.dto.user.userReviewDTO;
import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.ProductOrderRepository;
import com.green.project.Leo.repository.product.ProductReviewRepository;

import com.green.project.Leo.service.product.ProductService;
import com.green.project.Leo.service.user.MemberService;
import com.green.project.Leo.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j

public class MemberController {

    private final CustomFileUtil customFileUtil;

    @Autowired
    private ProductService productService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberService memberService;

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private ProductOrderRepository productOrderRepository;

    //회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody UserDTO userDTO) {
        log.info("register controller: "+userDTO);
        return  memberService.registerMember(userDTO);
    }

    // 아이디 중복 확인
    @PostMapping("/checkUserId")
    public ResponseEntity<Map<String, Object>> checkUserId(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        return memberService.checkUserId(userId);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDTO userDTO) {
            System.out.println("controller login : " + userDTO);
            return memberService.login(userDTO);
    }


    //마이페이지 정보 조회
    @GetMapping("/getprofile/{userId}")
    public ResponseEntity<UserDTO> getProfile(@PathVariable String userId) {
        System.out.println("정보조회들어옴");
        UserDTO userDTO = memberService.getProfile(userId);
        if (userDTO == null) {
            return ResponseEntity.notFound().build(); // 사용자 없음
        }
        System.out.println("정보조회 완료");
        return ResponseEntity.ok(userDTO); // 사용자 정보 반환
    }

    //마이페이지 정보 수정
    @PutMapping("/updateprofile/{userId}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable String userId, @RequestBody UserDTO userDTO) {

        System.out.println("받은 데이터: " + userDTO); // 값 확인
        if (userDTO == null) {
            throw new RuntimeException("Request body is null!");
        }
        UserDTO updateDTO = memberService.updateProfile(userId, userDTO);
        return ResponseEntity.ok(updateDTO);
    }

    // 이름과 이메일로 아이디 찾기
    @PostMapping("/findId")
    public ResponseEntity<Map<String, Object>> findUserId(@RequestBody UserDTO userDTO) {
    return memberService.findId(userDTO.getUserName(), userDTO.getUserEmail());
}

    //이름과 아이디로 비밀번호 찾기
    @PostMapping("/findPw")
    public ResponseEntity<Map<String, Object>> finduserPw(@RequestBody UserDTO userDTO) {
        return memberService.findPw(userDTO.getUserName(),userDTO.getUserId());
    }


    // 상품 리뷰
    @GetMapping("/review/{uId}")
    public List<userReviewDTO> getMyReview(@PathVariable(name = "uId")Long uid) {
        System.out.println("리뷰 제대로 출력이 되나요"+ uid);
        return memberService.getMyReview(uid);
    }

    // 상품 주문 내역 조회
    @GetMapping("/orders/{id}")
    public List<MyPageRequestOrderDTO> getProduct(@PathVariable Long id) {

        return memberService.findOrderByUid(id);
    }

    //회원탈퇴(삭제)
    @DeleteMapping("/delete/{userId}")
  public ResponseEntity<String> deleteUser(@RequestBody UserDTO userDTO){
        System.out.println("아이디 잘 들어오냐"+ userDTO);
        Boolean isDelete = memberService.deleteUser(userDTO.getUserId(), userDTO.getUserPw());


        if (isDelete) {
            return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("add/review")
    public void addReview(@RequestBody RequestProductReviewDTO reviewDTO){
       productService.addReview(reviewDTO);
    }

}


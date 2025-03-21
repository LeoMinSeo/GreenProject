package com.green.project.Leo.controller;

import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.product.ProductReview;
import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.ProductOrderRepository;
import com.green.project.Leo.repository.product.ProductReviewRepository;

import com.green.project.Leo.service.user.MemberService;
import com.green.project.Leo.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j

public class MemberController {

    private final CustomFileUtil customFileUtil;

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
        memberService.registerMember(userDTO);

        // 응답을 JSON 객체로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원 가입이 완료!!!!!.");

        return ResponseEntity.ok(response);
    }

    // 아이디 중복 확인
    @PostMapping("/checkUserId")
    public ResponseEntity<Map<String, Object>> checkUserId(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        Boolean isUserIdExist = memberService.checkUserId(userId);

        Map<String, Object> response = new HashMap<>();
        if (isUserIdExist) {
            response.put("success", false);
            response.put("message", "아이디가 이미 존재합니다.");
        } else {
            response.put("success", true);
            response.put("message", "아이디가 사용 가능합니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody  UserDTO userDTO) {
        System.out.println("contoller login : " +userDTO);

        // 아이디와 비밀번호 입력값 검증
        if (userDTO.getUserId() == null || userDTO.getUserPw() == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "아이디와 비밀번호를 모두 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse); // 400 Bad Request
        }

        // 사용자 정보 확인
        UserDTO data = memberService.login(userDTO.getUserId(), userDTO.getUserPw());
        System.out.println("data:" +data);
        Map<String, Object> response = new HashMap<>();
        if (userDTO != null) {
            response.put("data", data);
            return ResponseEntity.ok(response); // 200 OK
        } else {
            // 로그인 실패 시
            response.put("success", false);
            response.put("message", "아이디 또는 비밀번호가 잘못되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); // 401 Unauthorized
        }
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

    //이름과 이메일로 아이디 찾기
    @PostMapping("/findId")
    public ResponseEntity<String> finduserId(@RequestBody UserDTO userDTO){
        System.out.println("데이터 확인용1" + userDTO); // 값 들어오는지 확인.

        String findName = userDTO.getUserName();
        String findEmail = userDTO.getUserEmail();

        Optional<String> findId = memberService.findId(findName, findEmail);

        return   findId.map(id -> {
            System.out.println("확인용2: 찾은 ID = " + id);
            return ResponseEntity.ok().body(id);
        }) .orElseGet(() -> {
            System.out.println("확인용3: 해당 사용자를 찾을 수 없음");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("해당 사용자를 찾을 수 없습니다.");
        });
    }

    //이름과 아이디로 비밀번호 찾기
    @PostMapping("/findPw")
    public ResponseEntity<String> findUserPw(@RequestBody UserDTO userDTO){

        String findName = userDTO.getUserName();
        String findId = userDTO.getUserId();

        Optional<String> findPw = memberService.findPw(findName,findId);

        return findPw.map( pw -> {
            System.out.println("확인용: 찾은 PW: " + pw);
            return ResponseEntity.ok().body(pw);
        }).orElseGet(() -> {
            System.out.println("해당 사용자를 찾을 수 없음");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("해당 사용자를 찾을 수 없습니다.");
        });
    }
    @GetMapping("/review/{uId}")
    public ResponseEntity<List<ProductReview>> getReview(@PathVariable(name = "uId")Long uid) {

        System.out.println("리뷰조회"+uid);
        List<ProductReview> reviewList = productReviewRepository.getReviewList(uid);

        System.out.println("review controller list : "+reviewList);
        return ResponseEntity.ok(reviewList);
    }
    @GetMapping("/orders/{id}")
    public List<ProductOrder> getProduct(@PathVariable Long id) {
        System.out.println("주문내역조회로옴");
        return productOrderRepository.getOrderList(id);
    }

}


package com.green.project.Leo.service.user;


import com.green.project.Leo.dto.user.MypageRequestOrderDTO;
import com.green.project.Leo.dto.user.UserDTO;

import java.util.List;
import java.util.Optional;

public interface MemberService {
    public void registerMember(UserDTO userDTO); //회원가입
    public Boolean checkUserId(String userId); // 아이디 중복 확인
    public UserDTO login(String userId, String userPw); // 로그인
    public UserDTO getProfile(String userId); // 아이디로 마이페이지 - 회원정보 불러오기
    public UserDTO updateProfile(String userId, UserDTO userDTO); // 마이페이지 - 회원정보 수정
    public Optional<String> findId (String userName, String userEmail); // 아이디 찾기
    public Optional<String> findPw (String userName, String userId); // 비밀번호 찾기
    public List<MypageRequestOrderDTO> findOrderByUid(Long uid);

}

package com.green.project.Leo.repository;

import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query(value = "select * from user where user_id = :userId",nativeQuery = true)
    User seletByUserId(@Param("userId") String userId);

    boolean existsByUserId(String userId); //회원가입 할 때 아이디 중복 확인
    User findByUserId(String userId);  // 로그인 시 사용할 메서드
    Optional<User> findByUserNameAndUserEmail(String userName, String userEmail); // 아이디 찾기 메서드
    Optional<User> findByUserNameAndUserId(String userName, String userId); // 비밀번호 찾기 메서드
    Optional<User> findById(Long uid); // userId로 사용자를 찾는 쿼리 메서드
    // DTO -> Entity 변환 default 메서드
    default User convertToEntity(UserDTO userDTO) {
        return User.builder()
                .userId(userDTO.getUserId())
                .userPw(userDTO.getUserPw())
                .userName(userDTO.getUserName())
                .userEmail(userDTO.getUserEmail())
                .userAdress(userDTO.getUserAdress())
                .build();
    }

}

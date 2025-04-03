package com.green.project.Leo.dto.user;

import com.green.project.Leo.entity.user.UserRole;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long uid;

    private String userId;

    private String userPw;

    private String userName;

    private String userEmail;

    private String userAddress;

    private boolean isDeleted;

    private String userPhoneNum;

    private UserRole userRole;

    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("uid", uid);
        dataMap.put("userId", userId);
        dataMap.put("userPw", userPw);  // 주의: 보안상 비밀번호는 토큰에 포함시키지 않는 것이 좋습니다
        dataMap.put("userName", userName);
        dataMap.put("userEmail", userEmail);
        dataMap.put("userAddress", userAddress);
        dataMap.put("isDeleted", isDeleted);
        dataMap.put("userPhoneNum", userPhoneNum);
        dataMap.put("userRole", userRole != null ? userRole.toString() : null);

        return dataMap;
    }
}

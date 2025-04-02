package com.green.project.Leo.dto.user;

import lombok.*;

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

}

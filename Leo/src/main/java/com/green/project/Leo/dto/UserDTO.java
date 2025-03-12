package com.green.project.Leo.dto;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long uId;


    private String userId;


    private String userPw;


    private String userName;

    private String userEmail;

    private String userAdress;
}

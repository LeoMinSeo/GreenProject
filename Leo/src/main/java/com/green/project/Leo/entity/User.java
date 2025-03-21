package com.green.project.Leo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(fluent = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uId;

    @Column(nullable = false,unique = true)
    private String userId;

    @Column(nullable = false)
    private String userPw;


    private String userName;

    private String userEmail;

    private String userAdress;

    @Builder
    public User(String userId, String userPw, String userName, String userEmail, String userAdress) {
        this.userId = userId;
        this.userPw = userPw;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userAdress = userAdress;
    }
}

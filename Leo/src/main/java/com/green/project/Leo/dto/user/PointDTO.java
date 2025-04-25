package com.green.project.Leo.dto.user;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class PointDTO {

    private Long pointId ;
    private Long uId;
    private String reason;
    private int pointAmount;
    private String eventType;
    private LocalDate issueDate;

    private Integer totalPoint;

}

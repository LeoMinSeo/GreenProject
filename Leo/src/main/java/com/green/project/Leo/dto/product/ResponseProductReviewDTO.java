package com.green.project.Leo.dto.product;

import lombok.*;


import java.time.LocalDate;
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResponseProductReviewDTO {

    private Long pReivewNo;
    private String userId;
    private String reviewtext;
    private Double reviewRating;
    private LocalDate dueDate;
}

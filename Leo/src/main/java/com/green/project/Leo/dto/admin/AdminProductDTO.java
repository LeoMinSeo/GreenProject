package com.green.project.Leo.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminProductDTO {
    private Long pno;
    private String pname;
    private String price;
    private String imgFileName;
    private String category;
}

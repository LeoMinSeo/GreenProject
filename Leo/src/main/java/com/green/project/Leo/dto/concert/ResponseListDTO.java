package com.green.project.Leo.dto.concert;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ResponseListDTO {
    private Long cno;

    private String cname;

    private String cprice;

    private String cplace;

    private String uploadFileName;
}

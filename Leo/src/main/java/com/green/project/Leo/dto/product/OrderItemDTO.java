package com.green.project.Leo.dto.product;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.green.project.Leo.entity.product.Product;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderItemDTO {
    private Long pno;
    private int numOfItem;

//    @JsonCreator  // JSON 데이터를 처리할 때 사용 (변수이름때문에 게터가 정확하게 작동을 안해서 문제였었음 롬복에 규칙을 벗어나서)
//    public OrderItemDTO(@JsonProperty("pNo") Long pNo) {
//        this.pNo = pNo;
//    }
}

package com.green.project.Leo;

import com.green.project.Leo.entity.product.ProductReviewRating;
import com.green.project.Leo.repository.product.ProductReviewRatingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class RepositoryTest {
    @Autowired
    private ProductReviewRatingRepository repository;

    @Test
    public void test (){
        List<ProductReviewRating> result = repository.findAll();
        for(ProductReviewRating i : result){
            System.out.println("상품번호 :"+i.getPNo()+" 리뷰개수 :"+i.getReviewCount()+"평점 :"+i.getAvgRating());
        }

    }

}

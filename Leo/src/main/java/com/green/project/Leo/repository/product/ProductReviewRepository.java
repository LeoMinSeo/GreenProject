package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview,Long> {
    @Query(value = "select * from product_review where p_no = :pNo",nativeQuery = true)
    List<ProductReview> selectByPNo(@Param("pNo") Long pno);

    @Query(value = "select * from  product_review where u_id = :uId", nativeQuery = true)
    List<ProductReview> getReviewList(@Param("uId") Long uId);
}

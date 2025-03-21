package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductOrderRepository extends JpaRepository<ProductOrder,Long> {
    @Query(value = "select * from product_order p join order_item o on p.order_num = o.product_order_num where p.order_num = :orderNum ",nativeQuery = true)
    ProductOrder selectOrderByOrderNum(@Param("orderNum")Long orderNum);

    @Query(value = "select * from product_order where u_id = :uid ",nativeQuery = true)
    List<ProductOrder> getOrderList(@Param("uid") Long uid);
}

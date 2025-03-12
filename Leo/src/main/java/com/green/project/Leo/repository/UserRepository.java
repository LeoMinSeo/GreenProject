package com.green.project.Leo.repository;

import com.green.project.Leo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query(value = "select * from user where user_id = :userId",nativeQuery = true)
    User seletByUserId(@Param("userId") String userId);

}

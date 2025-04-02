package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.Concert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConcertRepository extends JpaRepository<Concert,Long> {
    Page<Concert> findByCategory(String category, Pageable pageable);
}

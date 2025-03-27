package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Concert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cNo;

    @Column(nullable = false)
    private String cName;

    @Column(nullable = false)
    private String cPrice;

    @Column(length = 500)
    private String cdesc;

    @Column(nullable = false)
    private String cPlace;

    private String category;

    // 콘서트가 삭제되면 관련 스케줄도 삭제되어야 함
    @OneToMany(mappedBy = "concert", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ConcertSchedule> schedules = new ArrayList<>();

    // 콘서트가 삭제되면 이미지도 삭제되어야 함
    @OneToMany(mappedBy = "concert", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ConcertImage> images = new ArrayList<>();

    // 콘서트가 삭제되면 리뷰도 삭제되어야 함
    @OneToMany(mappedBy = "concert", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ConcertReview> reviews = new ArrayList<>();
}

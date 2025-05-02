#AudiMew 프로젝트

**📌 프로젝트 소개** <br/>
AudiMew는 공연 예매 및 관련 굿즈 판매를 위한 통합 플랫폼입니다.<br> 사용자는 다양한 공연을 예매하고, 관련 상품을 구매할 수 있으며, 관리자는 공연과 상품을 관리할 수 있습니다. 결제는 아임포트(I'mport) API를 통해 이루어집니다.

**🛠️ 기술 스택**

**백엔드**
프레임워크: Spring Boot
언어: Java
데이터베이스: MySQL
ORM: JPA/Hibernate
보안: Spring Security, JWT
API 통신: RESTful API

**주요 라이브러리**
ModelMapper: DTO-Entity 변환
I'mport: 결제 시스템 연동
Discord Webhook: 로깅 및 알림
JavaMail: 이메일 전송

**🏗️ 시스템 아키텍처**
com.green.project.Leo/
├── config/                  # 설정 클래스
├── controller/              # REST 컨트롤러
├── dto/                     # 데이터 전송 객체
├── entity/                  # 데이터베이스 엔티티
├── repository/              # JPA 레포지토리
├── service/                 # 비즈니스 로직
└── util/                    # 유틸리티 클래스

**🔧 주요 기능**

**1. 사용자 관리 시스템**
회원가입, 로그인, 회원정보 관리
JWT 기반 인증 및 인가
비밀번호 재설정 (이메일 인증)
포인트 시스템

**2. 공연 관리 시스템**
공연 등록, 수정, 삭제
공연 스케줄 관리
이미지 업로드 및 관리
카테고리별 공연 목록 조회

**3. 공연 예매 시스템**
좌석 예약 (동시성 제어)
티켓 발급 및 관리
예매 취소 및 환불

**4. 상품 관리 시스템**
상품 등록, 수정, 삭제
상품 이미지 업로드 및 관리
재고 관리

**5. 장바구니 및 주문 시스템**
장바구니 기능
주문 처리 및 결제
주문 이력 조회
환불 처리

**6. 리뷰 시스템**
상품 및 공연 리뷰 작성
평점 시스템

**7. 관리자 대시보드**
판매 통계 및 데이터 시각화
사용자 관리
주문 및 환불 관리
공연 및 상품 관리

**📊 ERD (Entity Relationship Diagram)**
[User] 1---* [ConcertTicket] *---1 [ConcertSchedule] *---1 [Concert]
[User] 1---* [ProductReview] *---1 [Product]
[User] 1---* [ConcertReview] *---1 [Concert]
[User] 1---* [ProductCart] *---1 [Product]
[User] 1---* [ProductOrder] 1---* [OrderItem] *---1 [Product]
[User] 1---* [Point]
[Product] 1---* [ProductImage]
[Concert] 1---* [ConcertImage]


**🔐 보안 설계**

**JWT 인증 - 토큰 기반 사용자 인증 구현**

엑세스 토큰 (10분) 및 리프레시 토큰 (24시간) 관리
토큰 블랙리스트 관리 (로그아웃)


**권한 기반 접근 제어**

USER, ADMIN 역할 구분
관리자 전용 API 엔드포인트 보호


**비밀번호 관리**

BCrypt 인코딩으로 안전한 비밀번호 저장
비밀번호 재설정 토큰 발급 및 유효성 검증



**💰 결제 시스템**

아임포트(I'mport) API를 활용한 결제 시스템 구현:

다양한 결제 수단 지원 (신용카드, 계좌이체 등)
결제 검증 및 위변조 방지
환불 처리 자동화

**📨 알림 시스템**


**이메일 알림**

비밀번호 재설정 링크 발송
주문 확인 및 환불 처리 알림


**Discord Webhook 로깅**

시스템 에러 모니터링
결제 및 환불 처리 알림
주요 이벤트 로깅 (매진, 재고 부족 등)



**🔄 동시성 제어**


**공연 예매 시스템**

비관적 락(Pessimistic Lock)을 사용한 좌석 예약 충돌 방지
트랜잭션 관리로 데이터 일관성 유지


**재고 관리**

상품 주문 및 환불 시 재고 확인 및 조정


**📝 API 문서**

주요 API 엔드포인트:

**사용자 관리**

POST /api/member/register: 회원가입
POST /api/member/login: 로그인
GET /api/member/getprofile/{userId}: 사용자 정보 조회
PUT /api/member/updateprofile/{userId}: 사용자 정보 수정

**공연 관리**

GET /concert/list/{category}: 공연 목록 조회
GET /concert/read/{cno}: 공연 상세 조회
POST /admin/add/concert: 공연 등록 (관리자)
PUT /admin/modify/concert: 공연 수정 (관리자)

**상품 관리**

GET /product/list/{category}: 상품 목록 조회
GET /product/read/{pno}: 상품 상세 조회
POST /admin/add/product: 상품 등록 (관리자)
PUT /admin/modify/product: 상품 수정 (관리자)

**주문 및 결제**

POST /user/purchase/{imp_uid}: 상품 구매 처리
POST /user/reservation/{imp_uid}: 공연 예매 처리
POST /user/refund: 환불 요청

**🔜 향후 개발 계획**

**실시간 알림 시스템 구현**

WebSocket을 활용한 실시간 알림 기능


**추천 시스템 도입**

사용자 취향 및 구매 이력 기반 추천 알고리즘


**모바일 앱 지원**

모바일 애플리케이션용 API 확장



**👥 팀원**

백엔드 개발:김민서,김은혜
프론트엔드 개발: 김민서,김은혜
UI/UX 디자인: 백승호

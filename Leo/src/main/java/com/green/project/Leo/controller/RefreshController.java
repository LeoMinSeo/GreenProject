package com.green.project.Leo.controller;

import com.green.project.Leo.dto.token.RefreshTokenDTO;
import com.green.project.Leo.dto.token.TokenResponseDTO;
import com.green.project.Leo.util.CustomJWTException;
import com.green.project.Leo.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Log4j2
@RequiredArgsConstructor
public class RefreshController {

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDTO> refreshToken(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        log.info("Refresh token requested: {}", refreshTokenDTO);

        try {
            // 리프레시 토큰 유효성 검사
            if (refreshTokenDTO == null || refreshTokenDTO.getRefreshToken() == null) {
                throw new CustomJWTException("리프레시 토큰이 제공되지 않았습니다.");
            }

            String refreshToken = refreshTokenDTO.getRefreshToken();

            // 리프레시 토큰 검증
            Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
            if (claims == null) {
                throw new CustomJWTException("유효하지 않은 리프레시 토큰입니다.");
            }

            // 리프레시 토큰에서 사용자 정보 추출
            Integer uid = (Integer) claims.get("uid");
            String userId = (String) claims.get("userId");
            String userRole = (String) claims.get("userRole");

            if (uid == null || userId == null || userRole == null) {
                throw new CustomJWTException("리프레시 토큰에 필요한 사용자 정보가 없습니다.");
            }

            // 클레임 맵 생성
            Map<String, Object> newClaims = new HashMap<>();
            newClaims.put("uid", uid);
            newClaims.put("userId", userId);
            newClaims.put("userRole", userRole);

            // 새로운 액세스 토큰 생성 (10분 유효)
            String newAccessToken = JWTUtil.generateToken(newClaims, 10);

            // 응답 생성
            TokenResponseDTO responseDTO = TokenResponseDTO.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // 기존 리프레시 토큰 그대로 반환
                    .build();

            return ResponseEntity.ok(responseDTO);


        } catch (Exception e) {
            log.error("Unexpected error during token refresh: {}", e.getMessage());
            throw new CustomJWTException("토큰 갱신 중 예상치 못한 오류가 발생했습니다.");
        }
    }
}
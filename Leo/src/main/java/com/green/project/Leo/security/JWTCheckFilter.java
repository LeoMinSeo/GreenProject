package com.green.project.Leo.security;

import com.google.gson.Gson;
import com.green.project.Leo.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException{
        //PreFlight 요청은 체크안함
        if(request.getMethod().equals("OPTIONS")){
            return true;
        }
        String path = request.getRequestURI();
        log.info("check uri ----------------------"+path);
        //로그인경로 체크안함
        if(path.startsWith("/api/member/login")){
            return true;
        }
        //회원가입경로 체크 안함
        if(path.startsWith("/api/member/register")){
            return true;
        }
        //아이디 중복체크 경로 체크 안함
        if(path.startsWith("/api/member/checkUserId")){
            return true;
        }

        //프로덕트 컨트롤러 경로는 체크안함
        if(path.startsWith("/product/")){
            return true;
        }
        //콘서트 경로도 체크안함
        if(path.startsWith("/concert/")){
            return true;
        }



        return false;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("---------------------JWTCheckFilter-----------------------");
        String authHeaderStr = request.getHeader("Authorization");

        try{
            //Bearer accestoken
            String accessToken = authHeaderStr.substring(7);
            Map<String,Object> claims = JWTUtil.validateToken(accessToken);

            log.info("JWT claims:" + claims);

            filterChain.doFilter(request,response);

        }catch (Exception e){
            log.error("JWT Check Error--------------------");
            log.error(e.getMessage());

            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error","ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }





    }
}

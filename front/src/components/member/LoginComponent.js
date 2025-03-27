import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { loginPost } from "../../api/memberApi";

// 전역 스타일을 설정하기 위한 createGlobalStyle
const GlobalStyle = createGlobalStyle`
   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');    

   // CSS 변수(root) 정의: 색상, 폰트 등을 전역적으로 사용 가능하도록 설정
   :root {     
     --primary-color: #fb923c;     
     --secondary-color:#1D4ED8;     
     --black: #000000;     
     --white: #ffffff;     
     --gray: #efefef;     
     --gray-2: #757575;     
     --facebook-color: #4267B2;     
     --google-color: #DB4437;     
     --twitter-color: #1DA1F2;     
     --insta-color: #E1306C;   
   }    

   // 기본 스타일 초기화
   * {     
     font-family: 'Poppins', sans-serif;     
     margin: 0;     
     padding: 0;     
     box-sizing: border-box;   
   }    

   // html, body의 높이를 100vh로 설정하고 스크롤을 숨김
   html, body {     
     height: 100vh;     
     overflow: hidden;   
   }
`;

// 메인 컨테이너 스타일
const Container = styled.div`
  position: relative; // 자식 요소의 절대 위치 설정을 위해 필요
  min-height: 100vh; // 전체 화면 높이 유지
  overflow: hidden; // 넘치는 요소 숨김
  display: flex; // Flexbox 레이아웃 사용
  width: 100%;
  align-items: stretch; // 컨텐츠를 동일한 높이로 맞춤
  justify-content: flex-start; // 왼쪽 정렬
  transition: 0.5s ease-in-out; // 부드러운 애니메이션 효과 추가

  // 배경 효과 추가
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: linear-gradient(
      -45deg,
      var(--primary-color) 0%,
      var(--secondary-color) 100%
    ); // 대각선 그라디언트 배경
    transition: none;
    z-index: 1; // 다른 요소 위에 배치
    animation: ${({ showForm }) => (showForm ? shrinkBackground : "none")} 2.5s
      ease-in-out forwards;
    // showForm이 true일 때 shrinkBackground 애니메이션 적용
  }
`;

// 컬럼 스타일 (좌우 영역)
const Column = styled.div`
  display: flex;
  align-items: center; // 수직 중앙 정렬
  justify-content: center; // 수평 중앙 정렬
  width: 50%; // 화면의 반을 차지
  transition: 0.7s ease-in-out; // 애니메이션 효과
  z-index: 2; // 배경보다 위에 위치

  // 폼이 있는 컬럼 (애니메이션 효과 추가 가능)
  // &.form-column {
  //   opacity: ${({ showForm }) => (showForm ? 1 : 0)};
  //   transform: translateX(${({ showForm }) => (showForm ? "0" : "100%")});
  // } // 폼이 나타날 때 애니메이션 효과로 날아오게 설정 가능
`;

// 폼을 감싸는 Wrapper 스타일
const FormWrapper = styled.div`
  width: 100%;
  max-width: 28rem; // 최대 너비 제한
  text-align: center; // 텍스트 중앙 정렬
  margin-right: 35px; // 오른쪽 여백 추가
`;

// 로그인/회원가입 폼 스타일
const Form = styled.div`
  padding: 1rem;
  background-color: var(--white); // 배경색 흰색
  border-radius: 1.5rem; // 둥근 모서리
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; // 그림자 효과 추가
  transform: scale(1); // 기본 크기 유지
  transition: 0.7s ease-in-out; // 부드러운 애니메이션 효과
  transition-delay: 0.2s; // 0.2초 딜레이 후 애니메이션 실행
`;

// 입력 필드 그룹 스타일
const InputGroup = styled.div`
  position: relative; // 내부 요소 정렬을 위한 상대 위치 지정
  width: 100%;
  margin: 1rem 0; // 위아래 여백 추가
`;

// 입력 필드 스타일
const Input = styled.input`
  width: 100%;
  padding: 1rem 3rem; // 내부 여백 추가
  font-size: 1rem;
  background-color: var(--gray); // 입력 필드 배경색
  border-radius: 0.5rem;
  border: 0.125rem solid var(--white); // 기본 테두리 색상

  &:focus {
    border: 0.125rem solid var(--primary-color); // 포커스 시 테두리 색 변경
  }
`;

// 입력 필드 왼쪽 아이콘 스타일
const Icon = styled.i`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%); // 수직 중앙 정렬
  font-size: 1.4rem;
  color: var(--gray-2); // 아이콘 색상 설정
`;

// 버튼 스타일
const Button = styled.button`
  cursor: pointer; // 마우스 커서를 포인터로 변경
  width: 100%;
  padding: 0.6rem 0;
  border-radius: 0.5rem;
  border: none;
  background-color: var(--primary-color); // 기본 색상
  color: var(--white); // 텍스트 색상
  font-size: 1.2rem;
  outline: none;
`;

// 안내 텍스트 스타일
const Text = styled.p`
  text-align: center;
  margin: 1rem 0;
  font-size: 0.7rem;

  // 강조 텍스트 스타일
  b {
    margin-left: 4px; // "회원가입"만 오른쪽 정렬
    color: var(--primary-color); // 강조 색상 적용
    cursor: pointer;
  }
`;

// 로그인/회원가입 페이지의 콘텐츠 영역 스타일
const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--white);
  padding-left: 0;
  z-index: 3; // 배경보다 위에 배치
  margin-right: 70px;
  margin-bottom: 45px;
`;

// 텍스트 콘텐츠 스타일 (페이지의 설명 부분)
const TextContent = styled.div`
  margin: 4rem;
  color: inherit; // 부모 요소의 색상 상속
  transition: 0.7s ease-in-out;
  transform: translateX(0);
  text-align: left;
  z-index: 3; // 최상위 레이어에 위치

  h2 {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 2rem 0;
    transition: 0.7s ease-in-out;
  }

  p {
    font-weight: 600;
    transition: 0.7s ease-in-out;
    transition-delay: 0.2s;
  }
`;

// 배경 애니메이션 (회원가입/로그인 페이지 전환 시 배경이 줄어드는 효과)
const shrinkBackground = keyframes`
   25% {
     transform: translateX(0);
     width: 100%;
     left: 0;
     border-radius: 0;
   }
   75% {
     width: 100%;
     left: 0;
     border-radius: 0;
   }
   100% {
     transform: translateX(0);
     width: 50%;
     left: 0;
     border-bottom-right-radius: 100vh;
     border-bottom-left-radius: 0;
     border-top-left-radius: 0;
   }
`;

const LoginComponent = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기 상태
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleUserIdChange = (e) => setUserId(e.target.value);
  const handleUserPwChange = (e) => setUserPw(e.target.value);

  const handleLogin = async () => {
    if (!userId || !userPw) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    const loginParam = { userId, userPw };
    const response = await loginPost(loginParam);
    const { data } = response;

    if (response && data) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data));
      setIsAuthenticated(true);
      navigate(-1, { state: { isAuthenticated: true } });
    } else {
      setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <GlobalStyle />
      <Container showForm={showForm}>
        <Column>
          <ContentWrapper>
            <TextContent>
              <h2>AudiMew</h2>
            </TextContent>
          </ContentWrapper>
        </Column>
        <Column className="form-column" showForm={showForm}>
          <FormWrapper>
            <Form>
              <div className="flex justify-center items-center mb-5">
                <img src="/images/mainlogo.png" alt="logo" />
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm mb-1 text-center">
                  {errorMessage}
                </div>
              )}

              <InputGroup>
                <Icon className="bx bxs-user" />
                <Input
                  type="text"
                  placeholder="아이디를 입력해주세요."
                  value={userId}
                  onChange={handleUserIdChange}
                  style={{ paddingLeft: "1rem" }}
                />
              </InputGroup>
              <InputGroup>
                <Icon className="bx bxs-user" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요."
                  value={userPw}
                  onChange={handleUserPwChange}
                  style={{ paddingLeft: "1rem" }} // 여기서 padding-left 값을 줄여서 왼쪽에 텍스트가 더 붙도록 설정
                />
                {/* 비밀번호 보기/숨기기 아이콘 */}
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {/* 클릭 시 showPassword 상태에 따라 다른 이미지 표시 */}
                  <img
                    src={
                      showPassword ? "/images/hidePw.png" : "/images/showPw.png"
                    } // 상태에 맞는 이미지 경로
                    alt="아이콘"
                    width="24"
                    height="24"
                  />
                </span>
              </InputGroup>

              <Button onClick={handleLogin}>로그인</Button>

              <Text>
                계정이 없으신가요?{" "}
                <b>
                  <Link to="/member/signup">회원가입</Link>
                </b>
              </Text>
              <div className="flex justify-center items-center text-sm text-gray-600 mt-4 space-x-4">
                <Link to="/member/findid" className="hover:underline">
                  아이디 찾기
                </Link>
                <span>|</span>
                <Link to="/member/findpw" className="hover:underline">
                  비밀번호 찾기
                </Link>
              </div>
            </Form>
          </FormWrapper>
        </Column>
      </Container>
    </>
  );
};

export default LoginComponent;

import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginPost } from "../../api/memberApi";
import Signup from "../../components/member/SignupComponent";

// GlobalStyle 정의
const GlobalStyle = createGlobalStyle`
   // Google Fonts에서 'Poppins' 폰트를 불러옴
   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');    

   :root {     
     // 전역 색상 변수 설정
     --primary-color: #fb923c;     
     --secondary-color: #1D4ED8;     
     --black: #000000;     
     --white: #ffffff;     
     --gray: #efefef;     
     --gray-2: #757575;     
     --facebook-color: #4267B2;     
     --google-color: #DB4437;     
     --twitter-color: #1DA1F2;     
     --insta-color: #E1306C;   
   }    

   * {     
     margin: 0;     // 모든 요소에 기본 여백 제거
     padding: 0;    // 모든 요소에 기본 패딩 제거
     box-sizing: border-box; // 박스 모델을 border-box로 설정하여 padding과 border가 width, height에 포함되도록 설정
   }    

   html, body {     
     height: 100vh;     // 화면의 전체 높이를 차지하도록 설정
     overflow: hidden;   // 화면을 벗어나는 영역 숨김
   }
`;

// 전체 페이지의 컨테이너 스타일
const Container = styled.div`
  position: relative;
  min-height: 100vh; // 최소 높이를 화면 크기로 설정
  overflow: hidden; // 내용이 벗어나는 부분 숨김
  display: flex;
  width: 100%;
  align-items: stretch; // 자식 요소들이 높이를 맞추도록 설정
  justify-content: flex-start; // 요소들을 왼쪽 정렬
  transition: 0.5s ease-in-out; // 부드러운 전환 효과

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
    ); // 배경에 그라디언트 색상 적용
    transition: none;
    z-index: 1; // 다른 요소들 위에 배경이 보이도록 설정
    animation: ${({ showForm }) => (showForm ? shrinkBackground : "none")} 2.5s
      ease-in-out forwards; // 상태에 따라 애니메이션 설정
  }
`;

// 내부 컬럼 스타일
const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  transition: 0.7s ease-in-out; // 부드러운 전환 효과
  z-index: 2; // 컨텐츠가 이 요소 위에 보이도록 설정
`;

// 폼을 감싸는 wrapper 스타일
const FormWrapper = styled.div`
  width: 100%; // 화면 크기에 따라 조정
  max-width: 30rem; // 최대 너비
  text-align: center;
  margin-right: 90px; // 오른쪽 여백 추가
`;

// 폼 자체의 스타일
const Form = styled.div`
  padding: 1.8rem;
  background-color: var(--white);
  border-radius: 1.5rem;
  width: 100%;
  // max-width: 24rem;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 5px 15px;
  transform: scale(1);
  transition: 0.7s ease-in-out;
  transition-delay: 0.2s;

  margin-top: 80px; // 🔥 원하는 만큼 아래로 내릴 수 있음!
`;

// 입력 그룹을 감싸는 스타일 (입력 필드 길이 조정)
const InputGroup = styled.div`
  position: relative;
  width: 90%; // 입력 필드의 너비
  margin: 0.9rem 0;
`;

// 입력 필드 스타일 (더 작은 크기 적용)
const Input = styled.input`
  width: 100%; // InputGroup의 크기에 맞춤
  padding: 0.8rem 2rem; // 내부 여백 줄이기
  font-size: 0.9rem; // 글자 크기 살짝 줄이기
  background-color: var(--gray);
  border-radius: 0.4rem;
  border: 0.1rem solid var(--white);
  outline: none;
  margin-left: 1.2rem;

  &:focus {
    border: 0.1rem solid var(--primary-color);
  }
`;

// 입력 아이콘 스타일
const Icon = styled.i`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%); // 세로 중앙 정렬
  font-size: 1.4rem;
  color: var(--gray-2); // 아이콘 색상
`;

// 버튼 스타일
const Button = styled.button`
  cursor: pointer;
  width: 90%;
  padding: 0.5rem 0;
  border-radius: 0.5rem; // 둥근 모서리
  border: none;
  background-color: var(--primary-color); // 배경 색상
  color: var(--white); // 텍스트 색상
  font-size: 1.2rem;
  outline: none; // 포커스 시 외곽선 제거
`;

// 텍스트 스타일
const Text = styled.p`
  text-align: center;
  margin: 1rem 0; // 위아래 여백
  font-size: 0.7rem;

  // 강조 텍스트 스타일
  b {
    margin-left: 4px; // 강조 텍스트에 왼쪽 여백 추가
    color: var(--primary-color); // 강조 색상 적용
    cursor: pointer; // 클릭 가능한 느낌을 주기 위한 커서 변경
  }
`;

// 콘텐츠를 감싸는 wrapper 스타일
const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--white); // 글자 색상
  padding-left: 0;
  z-index: 3; // 다른 요소 위에 텍스트가 보이도록 설정
  margin-right: 100px;
  margin-bottom: 120px;
`;

// 텍스트 콘텐츠 스타일
const TextContent = styled.div`
  margin: 4rem;
  color: inherit; // 상속된 색상 사용
  transition: 0.7s ease-in-out;
  transform: translateX(0);
  text-align: left;
  z-index: 3;

  h2 {
    font-size: 4.2rem;
    font-weight: 800;
    margin: 0.5rem 0;
    transition: 0.7s ease-in-out;
  }

  p {
    font-weight: 600;
    color: white;
    transition: 0.7s ease-in-out;
    transition-delay: 0.2s; // 애니메이션 지연
    cursor: pointer;
    user-select: none;
    margin-top: 2px;
  }
`;

// 배경 애니메이션 정의
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
  const location = useLocation();
  const from = location.state?.from || "/";
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 전환 상태
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // 자동 로그인 상태
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  // 페이지 로드 시 자동 로그인 상태 확인
  useEffect(() => {
    const savedUserId = localStorage.getItem("username");
    const savedUserPw = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true"; // rememberMe 상태를 가져옴

    if (savedUserId && savedUserPw) {
      setUserId(savedUserId);
      setUserPw(savedUserPw);
    }
    setRememberMe(savedRememberMe); // rememberMe 상태 설정
  }, []);

  const handleUserIdChange = (e) => setUserId(e.target.value);
  const handleUserPwChange = (e) => setUserPw(e.target.value);

  const handleLogin = async () => {
    if (!userId || !userPw) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const loginParam = { userId, userPw };
      const response = await loginPost(loginParam);
      const { data } = response;
      console.log(data);
      if (data === "탈퇴하신분이에요") {
        setErrorMessage("존재하지 않는 계정입니다.");
      } else if (data === "존재하지 않는 아이디입니다.") {
        setErrorMessage("아이디를 확인해주세요.");
      } else if (data === "아이디 또는 비밀번호가 잘못되었습니다.") {
        setErrorMessage("비밀번호를 확인해주세요");
      } else if (data) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data));

        console.log(response.accessToken);

        console.log(data);
        navigate(from, { state: { isAuthenticated: true } });
      } else {
        setErrorMessage("로그인에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버 오류가 발생했습니다.");
      console.log(error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUserId("");
    setUserPw("");
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    localStorage.setItem("rememberMe", isChecked ? "true" : "false"); // 상태를 로컬스토리지에 저장
  };

  return (
    <>
      <GlobalStyle />
      <Container showForm={showForm}>
        <Column>
          <ContentWrapper>
            <TextContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginTop: "50px",
                userSelect: "none",
              }}
            >
              <h2>AudiMew</h2>
              <p
                style={{
                  marginTop: "5px",
                  userSelect: "none",
                  marginBottom: "10px",
                  cursor: "default",
                }}
              >
                {isLogin
                  ? "회원가입하고 AudiMew와 함께 더 나은 경험을 시작하세요!"
                  : "회원이신가요? AudiMew에 로그인하고 더 많은 서비스를 이용해보세요!"}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <Button
                  onClick={toggleForm}
                  style={{
                    border: "1px solid var(--white)",
                    borderWidth: "2px",
                    backgroundColor: "transparent",
                    color: "var(--white)",
                    padding: "0.6rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "1rem",
                    width: "250px",
                  }}
                >
                  {isLogin ? "SIGN UP" : "LOGIN"}
                </Button>
              </div>
            </TextContent>
          </ContentWrapper>
        </Column>
        <Column className="form-column" showForm={showForm}>
          <FormWrapper>
            <Form>
              {isLogin && (
                <div className="flex justify-center items-center mb-5">
                  <img src="/images/mainlogo.png" alt="logo" />
                </div>
              )}

              {errorMessage && (
                <div className="text-red-500 text-sm mb-1 text-center">
                  {errorMessage}
                </div>
              )}

              {isLogin ? (
                <>
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
                    <Icon className="bx bxs-lock-alt" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력해주세요."
                      value={userPw}
                      onChange={handleUserPwChange}
                      style={{ paddingLeft: "1rem" }}
                    />
                    <span
                      className="absolute -right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <img
                        src={
                          showPassword
                            ? "/images/showPw.png"
                            : "/images/hidePw.png"
                        }
                        alt="아이콘"
                        width="24"
                        height="24"
                      />
                    </span>
                  </InputGroup>

                  {/* 자동 로그인 체크박스 추가 */}
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                      />
                      자동 로그인
                    </label>
                  </div>

                  <Button onClick={handleLogin}>로그인</Button>
                </>
              ) : (
                <Signup /> // Signup 컴포넌트를 바로 렌더링
              )}

              <Text>
                {isLogin ? "계정이 없으신가요? " : "이미 계정이 있으신가요? "}
                <b onClick={toggleForm}>{isLogin ? "회원가입" : "로그인"}</b>
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

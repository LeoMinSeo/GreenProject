import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginPost } from "../../api/memberApi";

const LoginComponent = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // 페이지 이동

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
      console.log("로그인이 잘 되었어요: ", data);
      // 인증 토큰을 localStorage에 저장
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data));
      setIsAuthenticated(true); // 로그인 상태 업데이트
      navigate("/", { state: { isAuthenticated: true } }); // 메인 페이지 이동
    } else {
      setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    // <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow-md mx-auto mt-24 border border-gray-300">
    <div className="w-[580px] h-[650px] p-[26px] bg-white rounded-lg shadow-md mx-auto mt-24 border border-gray-300">
      {/* 이미지가 가운데 정렬되도록 하기 위해 flex, justify-center, items-center 사용 */}
      <div className="flex justify-center mb-6">
        <img
          src="/images/mainlogo.png"
          alt="Main Logo"
          className="w-38 h-auto"
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-xs mb-4 text-center">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-center items-center">
        <div className="mb-4 ">
          <label
            htmlFor="userid"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            아이디
          </label>
          <input
            type="text"
            id="userid"
            name="id"
            placeholder="아이디를 입력해주세요."
            className="w-[450px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userId}
            onChange={handleUserIdChange}
          />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="pw"
            placeholder="비밀번호를 입력하세요"
            className="w-[450px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userPw}
            onChange={handleUserPwChange}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={handleLogin}
          className="w-[450px] py-3 bg-gray-400  text-white text-lg font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
        >
          로그인
        </button>
      </div>

      <div className="flex justify-center items-center text-xs text-center mt-4 space-x-2">
        <Link to="/member/findid" className="text-gray-600 hover:underline">
          아이디 찾기
        </Link>
        <span>|</span>
        <Link to="/member/findpw" className="text-gray-600 hover:underline">
          비밀번호 찾기
        </Link>
        <span>|</span>
        <Link to="/member/signup" className="text-gray-600 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;

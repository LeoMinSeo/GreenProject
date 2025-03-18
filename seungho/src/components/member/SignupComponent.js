import React, { useState } from "react";
import SubMenubar from "../menu/SubMenubar";
import { Link } from "react-router-dom";

const SignUpComponent = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userid: "",
    address: "",
    agreeAll: false,
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100  ">
      <SubMenubar />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mt-20 border border-gray-300">
        <div className="flex justify-center items-center mb-7">
          <img src="/images/mainlogo.png" />
        </div>

        <input
          type="text"
          name="userid"
          placeholder="아이디를 입력해주세요"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 (영문, 숫자, 특수문자 포함 10자 이상)"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="이메일을 입력해주세요"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="주소를 입력해주세요"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />

        <div className="mb-4">
          <label className="flex items-center mb-1">
            <input
              type="checkbox"
              name="agreeAge"
              checked={formData.agreeAge}
              onChange={handleChange}
              className="mr-2"
            />
            [필수] 만 14세 이상입니다
          </label>
          <label className="flex items-center mb-1">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
            />
            [필수] 최종 이용약관에 동의합니다
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              className="mr-2"
            />
            [필수] 개인정보 수집 및 이용에 동의합니다
          </label>
        </div>

        <button className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-600">
          가입하기
        </button>

        <div className="text-center my-4 text-gray-500">or</div>
        <div className=" font-bold flex justify-center items-center">
          <button className="flex items-center w-36 bg-gray-200 p-2 rounded-lg mb-2 mr-5">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-7 h-7 mr-2 "
            />
            구글 계정
          </button>
          <button className="flex items-center w-36 bg-gray-200 p-2 rounded-lg mb-2 mr-5">
            <svg
              className="w-7 h-7 mr-2"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="256" height="256" fill="#03C75A" />
              <path
                d="M82.8 72.6h33.1l39.8 54.4V72.6h28.5v110.8h-33.1l-39.8-54.4v54.4H82.8V72.6z"
                fill="#fff"
              />
            </svg>
            네이버 계정
          </button>
          <button className="flex items-center w-36 bg-gray-200  p-2 rounded-lg mb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
              alt="Kakao"
              className="w-7 h-7 mr-2 "
            />
            카카오 계정
          </button>
        </div>
        <div className="mt-4 flex justify-center items-center text-gray-700">
          <span>이미 아이디가 있으신가요?</span>
          <Link
            to="/member/login"
            className="text-gray-700 font-bold ml-1 inline-block"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;

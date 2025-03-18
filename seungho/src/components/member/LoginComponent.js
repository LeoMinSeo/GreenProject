import React from "react";
import { Link } from "react-router-dom";

const LoginComponent = () => {
  return (
    <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow-md mx-auto mt-24 border border-gray-300">
      {/* 이미지가 가운데 정렬되도록 하기 위해 flex, justify-center, items-center 사용 */}
      <div className="flex justify-center mb-6">
        <img
          src="/images/mainlogo.png"
          alt="Main Logo"
          className="w-32 h-auto"
        />
      </div>

      <div className="mb-4">
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button className="w-full py-3 bg-gray-400 text-white text-lg font-semibold rounded-lg hover:bg-gray-600 transition duration-300">
        로그인
      </button>

      <div className="flex justify-center items-center text-xs text-center mt-4 space-x-2">
        <a href="#" className="text-gary-600 hover:underline">
          아이디 찾기
        </a>
        <span>|</span>
        <a href="#" className="text-gary-600 hover:underline">
          비밀번호 찾기
        </a>
        <span>|</span>
        <Link to="/member/signup" className="text-gary-600 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;

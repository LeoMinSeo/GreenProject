import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function FindpwComponent() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8089/user/send-reset-link`,
        {
          userId: id,
          userEmail: email,
        }
      );

      alert("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("서버 오류가 발생했습니다.");
      }
      console.error("error", error);
    }
  };

  return (
    <div className="max-w-lg w-full h-[500px] p-6 mx-auto mt-24 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">
        비밀번호 찾기
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 mt-12">
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="w-full py-3 px-4 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-400 rounded-lg"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-3 px-4 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-400 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-orange-400 text-white text-lg font-semibold rounded-lg hover:bg-orange-500 transition duration-300 mt-6"
        >
          비밀번호 재설정 링크 요청
        </button>
      </form>
      <div className="flex justify-center items-center text-xs text-center mt-4 space-x-2">
        <Link to="/member/findid" className="text-gray-600 hover:underline">
          아이디 찾기
        </Link>
        <span>|</span>
        <Link to="/member/login" className="text-gray-600 hover:underline">
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default FindpwComponent;

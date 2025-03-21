import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function FindidComponent() {
  const [email, setEmail] = useState(""); // 이메일
  const [name, setName] = useState(""); // 이름
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("이메일:", email);
    console.log("이름:", name);

    const response = await axios.post(
      `http://localhost:8089/api/member/findId`,
      {
        userName: name,
        userEmail: email,
      }
    );

    console.log("아이디 찾기:", response.data);
    const foundUserId = response.data;
    setUserId(foundUserId); // 상태 업데이트

    // userId 존재하면 alert로 출력
    if (foundUserId) {
      alert(`${name} 님의 아이디는 ${foundUserId} 입니다.`);
    } else {
      alert("아이디를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="max-w-sm w-full max-h-md p-6 bg-white rounded-lg shadow-md mx-auto mt-24 border border-gray-300">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
        아이디 찾기
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            이름 입력
          </label>
          <input
            type="text"
            id="name"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            이메일 주소
          </label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submits"
          className="w-full py-3 bg-gray-400 text-white text-lg font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
        >
          아이디 찾기
        </button>
      </form>

      <div className="flex justify-center items-center text-xs text-center mt-4 space-x-2">
        <Link to="/member/login" className="text-gray-600 hover:underline">
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default FindidComponent;

import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function FindidComponent() {
  const [email, setEmail] = useState(""); // 이메일
  const [name, setName] = useState(""); // 이름
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("이메일:", email);
    // console.log("이름:", name);

    try {
      const response = await axios.post(
        `http://localhost:8089/api/member/findId`,
        {
          userName: name,
          userEmail: email,
        }
      );

      // console.log("아이디 찾기:", response.data);

      // 성공적으로 아이디를 찾은 경우
      if (response.data.success) {
        alert(`${name} 님의 아이디는 ${response.data.data} 입니다.`);
        setUserId(response.data.data); // 상태 업데이트
      } else if (response.data.data === "탈퇴한 계정입니다.") {
        // 실패한 경우 (탈퇴한 계정이나 존재하지 않는 계정)
        alert("탈퇴한 계정"); // 에러 메시지 표시
      } else if (response.data.data === "사용자가 없습니다.") {
        alert("해당 사용자를 찾을 수 없습니다.");
      }
    } catch (error) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    // <div className="max-w-sm w-full max-h-md p-6 bg-white rounded-lg shadow-md mx-auto mt-24 border border-gray-300">
    <div className="max-w-lg w-full h-[500px] p-6 mx-auto mt-24 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">
        아이디 찾기
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6 mt-12">
          <div className="flex items-center pb-1 px-4">
            <input
              type="text"
              id="name"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
              className="w-full py-3 pl-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-400 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center pb-1 px-4">
            <input
              type="email"
              id="email"
              placeholder="사용하는 이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full py-3 pl-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-400 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-[430px] py-3 ml-4 bg-orange-400 text-white text-lg font-semibold rounded-lg hover:bg-orange-500 transition duration-300 mt-6"
        >
          아이디 찾기
        </button>
      </form>

      <div className="flex justify-center items-center text-xs text-center mt-4 space-x-2">
        <Link to="/member/findpw" className="text-gray-600 hover:underline">
          비밀번호 찾기
        </Link>
        <span>|</span>
        <Link to="/member/login" className="text-gray-600 hover:underline">
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default FindidComponent;

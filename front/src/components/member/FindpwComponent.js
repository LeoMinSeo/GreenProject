import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function FindpwComponent() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [userPw, setUserPw] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("아이디:", id);
    console.log("이름:", name);

    const res = await axios.post(`http://localhost:8089/api/member/findPw`, {
      userName: name,
      userId: id,
    });
    const findUserPw = res.data;
    console.log("비밀번호 찾기: ", findUserPw);
    setUserPw(findUserPw);

    if (findUserPw) {
      alert(`${name} 님의 비밀번호는 ${findUserPw} 입니다.`);
    } else {
      alert("비밀번호를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="max-w-sm w-full max-h-md p-6 bg-white rounded-lg shadow-md mx-auto mt-24 border border-gray-300">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
        비밀번호 찾기
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
            htmlFor="id"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            아이디
          </label>
          <input
            type="text"
            id="id"
            placeholder="아이디를 입력해주세요."
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gray-400 text-white text-lg font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
        >
          비밀번호 찾기
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

export default FindpwComponent;

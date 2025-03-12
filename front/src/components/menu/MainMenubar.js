import { Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MainMenubar = ({ currentIndex }) => {
  
  return (
    <div
      className={`absolute top-0 left-0 w-full h-[10vh] z-50 flex items-center px-5 transition-all duration-500 ${
        currentIndex === 0 ? "bg-transparent" : "bg-white bg-opacity-75"
      }`}
    >
      <div className="ml-4">
        <Link to={"/"} className="text-black font-bold">
          <img src="/images/mainlogo.png" className="w-20"></img>
        </Link>
      </div>
      <div className="mr-3 ml-4">
        <Link to={"/product"} className="text-black font-bold">
          product shop
        </Link>
      </div>
      <div>
        <Link to={"/reservation"} className="text-black font-bold">
          reservation
        </Link>
      </div>
      <div className="relative w-[40vh] ml-10">
        {/* 입력 필드 */}
        <input
          type="text"
          placeholder="상품명 및 품번"
          className={`w-full border border-black rounded-md py-2 pl-4 pr-10 text-black placeholder:text-black ${
            currentIndex === 0 ? "bg-transparent" : "bg-white bg-opacity-75"
          }`}
        />

        {/* 돋보기 아이콘 */}
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
      </div>
      <div className="ml-auto mr-10">
        <Link to={"/member/login"} className="text-black font-bold">
          로그인
        </Link>
      </div>
      <div>
        <Link to={"/member/signup"} className="text-black font-bold">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default MainMenubar;

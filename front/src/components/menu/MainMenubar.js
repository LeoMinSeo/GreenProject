import { text } from "framer-motion/client";
import { Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MainMenubar = ({ currentIndex }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-24 z-50 flex items-center px-5 transition-all duration-500 overflow-hidden ${
        currentIndex === 0 ? "bg-transparent " : "bg-[#f1efeb] "
      }`}
    >
      <div className="ml-4">
        <Link
          to={"/"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          <img
            src={`${
              currentIndex === 0
                ? "/images/1stpageLogo.png"
                : "/images/mainlogo.png"
            }`}
            className={`${currentIndex === 0 ? "w-32" : "w-20"}`}
          ></img>
        </Link>
      </div>
      <div className="mr-3 ml-4">
        <Link
          to={"/product"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          product shop
        </Link>
      </div>
      <div>
        <Link
          to={"/reservation"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          reservation
        </Link>
      </div>
      <div className="ml-auto mr-10">
        <Link
          to={"/shopping/basket"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          장바구니
        </Link>
      </div>
      <div className=" mr-10">
        <Link
          to={"/member/login"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          로그인
        </Link>
      </div>
      <div>
        <Link
          to={"/member/signup"}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default MainMenubar;

import { nav } from "framer-motion/client";
import { CookingPot, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MainMenubar = ({ currentIndex, currentPage }) => {
  const loginUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(loginUser);

  const navigate = useNavigate();
  // const location = useLocation();
  // console.log("location: ", location);
  // const { state } = location; // Link를 통해 전달된 state를 받음

  useEffect(() => {
    setUser(loginUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    navigate(currentPage ? currentPage : "/");
  };

  const handleMyPage = () => {
    if (!loginUser) {
      alert("로그인 해주세요");
      navigate("/member/login");
    } else {
      navigate(`/member/mypage/${loginUser.userId}`);
    }
  };

  const handleBasketPage = () => {
    if (loginUser) {
      navigate("/shopping/basket");
    } else {
      navigate("/member/login");
    }
  };

  const handleAdmin = () => {
    navigate("/admin");
  };

  return (
    <div
      className={`absolute top-0 left-0 w-full h-[10vh] z-50 flex items-center px-5 transition-all duration-500 ${
        currentIndex === 0
          ? "bg-transparent"
          : currentIndex === 3
          ? "bg-white"
          : "bg-[#f1efeb]"
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
          to={{ pathname: "/product", state: loginUser }}
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
          to={{ pathname: "/reservation", state: loginUser }}
          className={`${
            currentIndex === 0
              ? "text-[#EED9C4] font-bold"
              : "text-black font-bold"
          }`}
        >
          reservation
        </Link>
      </div>

      <div className="flex items-center ml-auto mr-5">
        {loginUser ? (
          <>
            {/* 로그인된 상태에서 admin일 경우 관리자 페이지 버튼, 아니면 MyPage 링크 표시 */}
            <button
              onClick={handleLogout}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              LogOut
            </button>

            {loginUser.userId === "admin" ? (
              // admin일 경우 관리자 페이지 버튼만 표시하고, Cart 버튼은 표시하지 않음
              <button
                onClick={handleAdmin}
                className={`${
                  currentIndex === 0
                    ? "text-[#EED9C4] font-bold"
                    : "text-black font-bold"
                } mx-2`}
              >
                Administrator
              </button>
            ) : (
              // admin이 아닌 경우 MyPage 링크 표시
              <Link
                to={`/member/mypage/${loginUser.userId}`}
                className={`${
                  currentIndex === 0
                    ? "text-[#EED9C4] font-bold"
                    : "text-black font-bold"
                } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
              >
                MyPage
              </Link>
            )}

            {/* admin이 아닌 경우에만 Cart 버튼 표시 */}
            {loginUser.userId !== "admin" && (
              <button
                onClick={handleBasketPage}
                className={`${
                  currentIndex === 0
                    ? "text-[#EED9C4] font-bold"
                    : "text-black font-bold"
                } mx-2`}
              >
                Cart
              </button>
            )}
          </>
        ) : (
          <>
            {/* 로그인되지 않은 상태에서는 Login, Join, MyPage, Cart 버튼 표시 */}
            <Link
              to="/member/login"
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              Login
            </Link>
            <Link
              to="/member/signup"
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              Join
            </Link>

            {/* 로그인되지 않았을 때는 MyPage와 Cart 버튼도 표시 */}
            <button
              onClick={handleMyPage}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2 relative after:content-['|'] after:absolute after:right-[-12px] after:text-gray-700`}
            >
              MyPage
            </button>
            <button
              onClick={handleBasketPage}
              className={`${
                currentIndex === 0
                  ? "text-[#EED9C4] font-bold"
                  : "text-black font-bold"
              } mx-2`}
            >
              Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainMenubar;

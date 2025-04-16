import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainMenubar from "../../components/menu/MainMenubar"; // 메뉴바 컴포넌트
import MyPageComponent from "../../components/member/MyPageComponent"; // 마이페이지 콘텐츠 컴포넌트
import { getProfile } from "../../api/memberApi";
import { jwtDecode } from "jwt-decode";

const MyPage = () => {
  const { userId } = useParams();
  const [data, setData] = useState("orders");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // 토큰이 없는 경우
      alert("로그인이 필요한 서비스입니다.");
      navigate("/");
      return;
    }

    try {
      // 토큰 디코딩하여 저장된 userId 추출
      const decodedToken = jwtDecode(token);
      const tokenUserId = decodedToken.userId; // JWT 토큰 내 userId 필드명에 맞게 수정

      // URL의 userId와 토큰의 userId 비교
      if (userId !== tokenUserId) {
        // 불일치할 경우 경고창 표시
        alert("접근 권한이 없습니다.");

        // 로컬 스토리지 데이터 모두 삭제
        localStorage.clear();

        // 홈페이지로 리다이렉트
        navigate("/");
        return;
      }
      // userId가 일치하면 프로필 정보 가져오기
      getProfile(userId).then((i) => {
        setUserData(i);
      });
    } catch (error) {
      console.error("토큰 검증 오류:", error);
      alert("인증 정보가 유효하지 않습니다.");
      localStorage.clear();
      navigate("/");
    }
  }, [userId, navigate]);

  const sidebar = [
    { id: "orders", label: "주문내역" },
    { id: "reservation", label: "예약내역" },
    { id: "reviews", label: "내 리뷰" },
    { id: "settings", label: "내 정보 수정" },
    { id: "deleteMember", label: "회원탈퇴" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <MainMenubar />

      <div className="flex bg-gray-100">
        <aside className="fixed left-[5%]  top-[110px] h-[84vh] w-1/5 lg:w-1/4 bg-white shadow-xl rounded-r-xl p-6">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-6 select-none">
            마이페이지
          </h2>
          {/* 사이드바에 프로필 정보 추가 */}
          <div className="mb-6 p-4 select-none">
            <div className="text-center mb-4 flex justify-center items-center">
              <img
                src="/images/mainlogo.png"
                alt="프로필 사진"
                className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-gray-500 transform transition-transform hover:scale-110"
              />
            </div>
            <h3 className="text-xl text-center font-semibold text-gray-800">
              {userData.userName}
            </h3>
            <p className="text-sm text-center text-gray-600">
              아이디: {userData.userId}
            </p>
            <p className="text-sm text-center text-gray-600">
              이메일: {userData.userEmail}
            </p>
          </div>

          {/* 사이드바 메뉴 */}
          <nav>
            <ul className="space-y-4 select-none">
              {sidebar.map((item) => (
                <li key={item.id}>
                  <button
                    className={`w-full text-left py-3 px-5 text-lg font-semibold relative ${
                      data === item.id ? "text-orange-400" : "text-gray-800"
                    }`}
                    onClick={() => setData(item.id)}
                  >
                    {item.label}
                    {data === item.id && (
                      <span className="absolute bottom-[0] left-5 w-3/5 h-[0.5px] bg-orange-400"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="ml-[20%] lg:ml-[25%] flex-grow bg-gray-100 p-8 min-h-screen">
          <MyPageComponent data={data} userId={userId}  />
        </main>
      </div>
    </div>
  );
};

export default MyPage;

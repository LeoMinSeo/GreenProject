import React, { useEffect, useState } from "react";
import MyPageComponent from "../../components/member/MyPageComponent";
import MainMenubar from "../../components/menu/MainMenubar";
import { useParams } from "react-router-dom";

const MyPage = () => {
  const { userId } = useParams(); // userId 받아오기
  const [data, setData] = useState("profile");

  const sidebar = [
    { id: "profile", label: "프로필" },
    { id: "orders", label: "주문 내역" },
    { id: "reviews", label: "내 리뷰" },
    { id: "points", label: "포인트" },
  ];

  useEffect(() => {
    // userId에 맞는 데이터 가져오기
    if (userId) {
      console.log(`사용자 ID: ${userId}`);
    }
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <MainMenubar />
      
      <div className="flex items-center justify-center flex-grow">
        <div className="container mx-auto px-4 py-12 my-8 flex flex-col md:flex-row gap-8 max-w-6xl">
          {/* 사이드바 */}
          <aside className="w-full md:w-1/4 bg-white shadow-lg rounded-xl p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">마이페이지</h2>
            <nav>
              <ul className="space-y-4">
                {sidebar.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`w-full text-left py-2 px-4 rounded-lg font-semibold ${
                        data === item.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setData(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="w-full md:w-3/4 bg-gray-100 p-6 md:p-8 rounded-xl shadow-lg">
            <MyPageComponent data={data} userId={userId} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
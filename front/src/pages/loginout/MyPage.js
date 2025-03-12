import React, { useState } from "react";
import MyPageComponent from "../../components/member/MyPageComponent";
import SubMenubar from "../../components/menu/SubMenubar";

const MyPage = () => {
  const [data, setData] = useState("profile");

  const sidebar = [
    { id: "profile", label: "프로필" },
    { id: "orders", label: "주문 내역" },
    { id: "reviews", label: "내 리뷰" },
    { id: "wishlist", label: "위시리스트" },
    { id: "points", label: "포인트" },
  ];

  return (
    <div className="flex max-w-screen-xl mx-auto p-8 space-x-8">
      <SubMenubar />
      <aside className="w-1/4 mt-24 bg-white shadow-lg rounded-xl p-6">
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
      <main className="w-3/4 mt-24 bg-gray-100 p-8 rounded-xl shadow-lg">
        <MyPageComponent data={data} />
      </main>
    </div>
  );
};

export default MyPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateProfile } from "../../api/memberApi";

const MyPageComponent = ({ data, userId }) => {
  const [modify, setModify] = useState(false);

  const loginUser = JSON.parse(localStorage.getItem("user"));
  console.log("마이페이지에서 확인", loginUser);
  console.log(JSON.parse(localStorage.getItem("user")).userId);

  const [userData, setUserData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    userAdress: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(
        `http://localhost:8089/api/member/getprofile/${userId}`
      );
      console.log("회원 정보 응답:", response.data);
      setUserData(response.data);
    };

    if (userId) {
      fetchUserData();
    }
    console.log(loginUser);
  }, [userId]);

  const toggleModify = () => {
    setModify(!modify);
  };

  //마이페이지 정보 수정

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지
    try {
      await updateProfile(userId, userData);
      alert("회원정보가 수정되었습니다.");
      setModify(false);
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  //주문 내역 확인
  const [orders, setOrders] = useState([]);

  // 주문 내역 조회 (id 사용)
  useEffect(() => {
    const fetchOrders = async () => {
      if (loginUser && loginUser.uid) {
        const response = await axios.get(
          `http://localhost:8089/api/member/orders/${loginUser.uid}` // id 사용
        );
        console.log(response.data);
        // 날짜 형식 변환
        const updatedOrders = response.data.map((order) => {
          const formattedDate = new Date(order.orderDate);
          const year = formattedDate.getFullYear();
          const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
          const day = String(formattedDate.getDate()).padStart(2, "0");
          const formattedOrderDate = `${year}-${month}-${day}`; // "2025-03-18" 형식으로 변환

          const OrderDate = `${year}${month}${day}`; // "20250318" 형식으로 변환

          const formattedOrderNum = `${OrderDate}${String(
            order.orderNum
          ).padStart(2, "0")}`; // "2025031801" 형태로 결합

          return { ...order, formattedOrderDate, formattedOrderNum };
        });
        setOrders(updatedOrders); // 변환된 데이터 상태 업데이트
      }
    };

    fetchOrders();
  }, [loginUser?.id]);

  //리뷰 확인
  const [review, setReview] = useState([]);

  useEffect(() => {
    const fetchReview = async () => {
      if (loginUser && loginUser.uid) {
        console.log("확인", loginUser);
        const response = await axios.get(
          `http://localhost:8089/api/member/review/${loginUser.uid}`
        );
        setReview(response.data);
      }
    };
    fetchReview();
  }, [loginUser.uid]);

  const renderContentModify = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        회원정보 수정
      </h2>
      <form>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700"
          >
            아이디(수정 X):
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={userData.userId}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700"
          >
            이름:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.userName}
            onChange={(e) =>
              setUserData({ ...userData, userName: e.target.value })
            }
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            이메일:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.userEmail}
            onChange={(e) =>
              setUserData({ ...userData, userEmail: e.target.value })
            }
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-700"
          >
            주소:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={userData.userAdress}
            onChange={(e) =>
              setUserData({ ...userData, userAdress: e.target.value })
            }
            placeholder="주소를 입력하세요"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          저장
        </button>
        <button
          type="button"
          onClick={toggleModify}
          className="w-full py-3 mt-4 bg-gray-300 text-white font-semibold rounded-md hover:bg-gray-400 transition"
        >
          취소
        </button>
      </form>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">프로필</h2>
      <img
        src="/images/mainlogo.png"
        alt="프로필 사진"
        className="w-36 h-36 rounded-full object-cover mb-6"
      />
      <h3 className="text-xl font-semibold">{userData.userName}</h3>
      <p className="text-sm text-gray-600">아이디: {userData.userId}</p>
      <p className="text-sm text-gray-600">이메일: {userData.userEmail}</p>
      <button
        className="mt-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        onClick={toggleModify}
      >
        프로필 수정
      </button>
    </div>
  );

  const renderContent = () => {
    switch (data) {
      case "profile":
        return modify ? renderContentModify() : renderProfile();
      case "orders":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주문 내역</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 py-2 px-4 text-left text-gray-700">
                    주문번호
                  </th>
                  <th className="border-b-2 py-2 px-4 text-left text-gray-700">
                    날짜
                  </th>
                  <th className="border-b-2 py-2 px-4 text-left text-gray-700">
                    상품
                  </th>
                  <th className="border-b-2 py-2 px-4 text-left text-gray-700">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderNum}>
                    <td className="border-b py-2 px-4">
                      {order.formattedOrderNum}
                    </td>
                    <td className="border-b py-2 px-4">
                      {order.formattedOrderDate}
                    </td>
                    <td className="border-b py-2 px-4">
                      {order.product.pname}
                    </td>
                    <td className="border-b py-2 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "reviews":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">내 리뷰</h2>
            <ul className="space-y-4">
              {review.length === 0 ? (
                <p className="text-gray-600">작성한 리뷰가 없습니다.</p>
              ) : (
                review.map((item) => (
                  <li key={item.id} className="bg-gray-100 p-4 rounded-md">
                    <h4 className="text-xl font-semibold">
                      {item.product.pname}
                    </h4>
                    <p className="text-sm text-gray-500">
                      별점: {`★`.repeat(item.reviewRating)}
                      {`☆`.repeat(5 - item.reviewRating)}
                    </p>
                    <p>{item.reviewtext}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        );

      case "points":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">포인트</h2>
            <p className="text-2xl font-semibold text-blue-600">
              총 포인트: 5,000점
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mt-4">
              포인트 내역
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between py-2 px-4 bg-gray-100 rounded-md">
                <span>2023-03-01</span>
                <span>상품 구매</span>
                <span className="text-red-500">-1,000점</span>
              </li>
              <li className="flex justify-between py-2 px-4 bg-gray-100 rounded-md">
                <span>2023-02-15</span>
                <span>리뷰 작성</span>
                <span className="text-green-500">+500점</span>
              </li>
            </ul>
          </div>
        );

      default:
        return <div>선택된 섹션이 없습니다.</div>;
    }
  };

  return renderContent();
};

export default MyPageComponent;

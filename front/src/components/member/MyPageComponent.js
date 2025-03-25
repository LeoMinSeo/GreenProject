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

  // 주문 내역 조회 (id 사용) - 새로운 데이터 형식에 맞게 수정
  useEffect(() => {
    const fetchOrders = async () => {
      if (loginUser && loginUser.uid) {
        try {
          const response = await axios.get(
            `http://localhost:8089/api/member/orders/${loginUser.uid}`
          );
          console.log("주문 내역 응답:", response.data);
          
          // 데이터가 배열인지 확인하고, 배열이 아니거나 비어있으면 빈 배열로 설정
          const ordersData = Array.isArray(response.data) ? response.data : [];
          setOrders(ordersData);
        } catch (error) {
          console.error("주문 내역 조회 중 오류 발생:", error);
          setOrders([]);
        }
      }
    };

    if (loginUser) {
      fetchOrders();
    }
  }, [loginUser?.uid]);

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
  }, [loginUser?.uid]);

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

  // 주문 상태에 따른 표시 텍스트 및 스타일
  const getStatusText = (status) => {
    if (!status) return { text: "상태 미정", color: "text-gray-500" };
    
    switch (status) {
      case "PAY_COMPLETED":
        return { text: "결제완료", color: "text-green-500" };
      case "PREPARING":
        return { text: "상품준비중", color: "text-blue-500" };
      case "SHIPPING":
        return { text: "배송중", color: "text-purple-500" };
      case "DELIVERED":
        return { text: "배송완료", color: "text-blue-800" };
      case "CANCELED":
        return { text: "주문취소", color: "text-red-500" };
      default:
        return { text: status, color: "text-gray-500" };
    }
  };

  // 날짜 형식 변환 함수 (ISO 문자열 → YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderContent = () => {
    switch (data) {
      case "profile":
        return modify ? renderContentModify() : renderProfile();
      case "orders":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주문 내역</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-4">주문 내역이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-5 bg-gray-100 font-semibold text-gray-700 p-3 rounded-t-lg">
                    <div className="px-2">주문번호</div>
                    <div className="px-2">주문일자</div>
                    <div className="px-2">상품명</div>
                    <div className="px-2">운송장번호</div>
                    <div className="px-2 text-center">상태</div>
                  </div>
                  
                  {orders.map((order) => {
                    const statusInfo = getStatusText(order.status);
                    return (
                      <div key={order.orderNo} className="grid grid-cols-5 border-b py-3 hover:bg-gray-50">
                        <div className="px-2 break-all">{order.orderNo}</div>
                        <div className="px-2">{formatDate(order.orderDate)}</div>
                        <div className="px-2">{order.productName}</div>
                        <div className="px-2">{order.shippingNum}</div>
                        <div className={`px-2 font-medium text-center ${statusInfo.color}`}>
                          {statusInfo.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
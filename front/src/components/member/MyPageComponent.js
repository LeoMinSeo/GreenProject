import React, { useState, useEffect } from "react";
import MyPageModify from "../../components/mypage/MyPageModify";
import MyPageOrders from "../../components/mypage/MyPageOrders";
import MyPageReview from "../../components/mypage/MyPageReview";
import DeleteAccount from "../../components/mypage/MyPageDelete";

import axios from "axios";

const MyPageComponent = ({ userId, data }) => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8089/api/member/getprofile/${userId}`
        );
        setUserData(userResponse.data);

        const ordersResponse = await axios.get(
          `http://localhost:8089/api/member/orders/${loginUser.uid}`
        );
        setOrders(ordersResponse.data);

        const reviewsResponse = await axios.get(
          `http://localhost:8089/api/member/review/${loginUser.uid}`
        );
        setReviews(reviewsResponse.data || []);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchData();
  }, [userId, refreshTrigger]);
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1); // 값만 변경하면 useEffect가 다시 실행됨
  };

  // 각 섹션별 렌더링
  switch (data) {
    case "settings":
      return (
        <MyPageModify
          userData={userData}
          setUserData={setUserData}
          userId={userId}
        />
      );
    case "orders":
      return <MyPageOrders orders={orders} refreshData={refreshData} />;
    case "reviews":
      return <MyPageReview reviews={reviews} />;
    case "deleteMember":
      return <DeleteAccount userId={userId} />;
    default:
      return <div>선택된 섹션이 없습니다.</div>;
  }
};

export default MyPageComponent;

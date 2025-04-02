import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateProfile } from "../../api/memberApi";

const MyPageComponent = ({ data, userId }) => {
  const [modify, setModify] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    userAdress: "",
    userPw: "",
  });
  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState([]);
  const [password, setPassword] = useState(""); // password 상태 추가
  const [showModal, setShowModal] = useState(false); //회원탈퇴 시 모달창
  const [selectedReasons, setSelectedReasons] = useState([]); // 탈퇴 사유 반드시 하나는 선택

  const loginUser = JSON.parse(localStorage.getItem("user"));

  // 회원 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(
        `http://localhost:8089/api/member/getprofile/${userId}`
      );
      setUserData(response.data);
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // 주문 내역 조회
  useEffect(() => {
    const fetchOrders = async () => {
      if (loginUser && loginUser.uid) {
        try {
          const response = await axios.get(
            `http://localhost:8089/api/member/orders/${loginUser.uid}`
          );
          setOrders(response.data);
        } catch (error) {
          setOrders([]);
        }
      }
    };

    if (loginUser) {
      fetchOrders();
    }
  }, [loginUser?.uid]);

  // 주문일자 (예: 2025-03-27 PM12:54)
  const formatOrderDate = (orderDate) => {
    const date = new Date(orderDate);

    // YYYY-MM-DD 형식 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리로 맞춤
    const day = String(date.getDate()).padStart(2, "0");

    // 시간 변환 (12시간제 + AM/PM)
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12; // 0시는 12로 변환

    return `${year}-${month}-${day} ${period} ${formattedHours}:${minutes}`;
  };

  // 리뷰 확인
  useEffect(() => {
    const fetchReview = async () => {
      if (loginUser && loginUser.uid) {
        const response = await axios.get(
          `http://localhost:8089/api/member/review/${loginUser.uid}`
        );
        setReview(response.data);
      }
    };
    fetchReview();
  }, [loginUser?.uid]);

  // 회원 정보 수정
  const toggleModify = () => {
    setModify(!modify);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(userId, userData);
      alert("회원정보가 수정되었습니다.");
      setModify(false);
      window.location.reload();
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      setShowModal(false);
      return; // 종료
    }

    try {
      // 비밀번호를 포함한 데이터 전달
      console.log("확인", password);
      const response = await axios.delete(
        `http://localhost:8089/api/member/delete/${userId}`,
        { data: { userPw: password } } // 비밀번호를 서버로 전달
      );

      console.log("응답:", response.data);

      // 성공 응답 처리
      alert(response.data); // 서버에서 반환한 성공 메시지
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");

      // 페이지 새로고침 후 메인홈페이지로 이동
      window.location.href = "/";
    } catch (error) {
      // 서버의 에러 응답을 처리
      if (error.response) {
        if (error.response.status === 401) {
          alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
        } else {
          alert("회원탈퇴 중 오류가 발생했습니다.");
        }
      } else {
        alert("회원탈퇴 중 오류가 발생했습니다.");
      }
      setShowModal(false); // 모달 닫기
    }
  };

  // 모달 열기
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 탈퇴 사유 반드시 하나는 선택
  // 체크박스 클릭 시 상태 업데이트
  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reason)) {
        return prev.filter((item) => item !== reason);
      } else {
        // 최대 2개까지만 선택 가능
        if (prev.length < 2) {
          return [...prev, reason]; // 선택 추가
        }
        return prev; // 2개 이상 선택되지 않도록 제한
      }
    });
  };

  const renderContentModify = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mt-14">
      <h2 className="text-2xl font-bold text-left text-gray-800 mb-8">
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
            readOnly
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

  const renderContent = () => {
    switch (data) {
      case "settings":
        return renderContentModify();
      case "orders":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md mt-14">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주문 내역</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                주문 내역이 없습니다.
              </p>
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

                  {orders.map((order) => (
                    <div
                      key={order.orderNo}
                      className="grid grid-cols-5 border-b py-3"
                    >
                      <div className="px-2">{order.orderNo}</div>
                      <div className="px-2">
                        {formatOrderDate(order.orderDate)}
                      </div>
                      <div className="px-2">{order.productName}</div>
                      <div className="px-2">
                        {order.trackingNo
                          ? order.trackingNo
                          : "상품 배송 준비 중입니다"}
                      </div>
                      <div className="px-2 text-center">{order.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "deleteMember":
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mt-14">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-left">
              회원 탈퇴
            </h2>

            <p className="text-xl text-gray-800 mb-4 text-left">
              계정을 삭제하시려는 이유를 말씀해주세요. 사이트 개선에 중요 자료로
              활용됩니다.
              <p className="text-base text-gray-800 mb-4 text-left">
                (선택 이후 회원 탈퇴가 가능합니다. 최대 두 개까지 선택할 수
                있습니다.)
              </p>
            </p>
            <div>
              {[
                "기록 삭제 목적",
                "찾는 제품이 없어서",
                "상품의 가격과 품질이 불만족스러워서",
                "사용 빈도가 낮아서",
                "기타",
              ].map((reason, index) => (
                <label key={index} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    onChange={() => handleCheckboxChange(reason)}
                    checked={selectedReasons.includes(reason)}
                  />
                  <div
                    className="w-5 h-5 ml-1 border-2 border-blue-500 rounded-full flex items-center justify-center 
            transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:text-sm"
                  ></div>
                  <span className="ml-2 text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
            <div className="mb-2 mt-4 w-3/5 h-[130px]  text-left border border-red-500">
              <p className="text-sm text-red-500 mt-2">
                회원탈퇴 후에는 모든 개인 정보와 관련 데이터가 삭제되며, 적립금
                및 쿠폰도 함께 사라집니다.
                <p>
                  삭제된 데이터는 복구할 수 없으므로, 탈퇴를 신중히 고려해
                  주세요.
                </p>
              </p>
              <p className="text-sm text-red-500 mt-2">
                그 외의 이것저것 경고문 환불 진행 중에 계정 삭제하면 환불 안
                해줌 포인트 환불도 안 해줌 안 해주는 게 많다
                <p>기타 등등 자세한 내용은 나중에 씁시다 이거는</p>
              </p>
            </div>
            <p className="text-xl text-gray-800 mb-2 mt-4 text-left">
              사용 중인 비밀번호
            </p>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-3/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
            <button
              className={`w-3/5 py-2 mt-4  rounded ${
                selectedReasons.length > 0
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleOpenModal}
              disabled={selectedReasons.length === 0}
            >
              회원탈퇴
            </button>

            {/* 모달 */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-96">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    정말 탈퇴하시겠어요?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    탈퇴 버튼 선택 시, 계정은 삭제되며 <p>복구되지 않습니다.</p>
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                      탈퇴하기
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md mt-14">
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
          <div className="bg-white p-6 rounded-lg shadow-md mt-14">
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

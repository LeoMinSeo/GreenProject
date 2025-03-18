import React, { useState } from "react";

const MyPageComponent = ({ data }) => {
  const [modify, setModify] = useState(false);

  const toggleModify = () => {
    setModify(!modify);
  };

  const renderContentModify = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-auto ">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        프로필 수정
      </h2>
      <form>
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
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
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
            placeholder="이메일을 입력하세요"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700"
          >
            전화번호:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="전화번호를 입력하세요"
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
            placeholder="주소를 입력하세요"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
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
    <div className="flex flex-col items-center mb-8 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">프로필</h2>
      <img
        src="/images/mainlogo.png"
        alt="프로필 사진"
        className="w-36 h-36 rounded-full object-cover mb-6"
      />
      <h3 className="text-xl font-semibold">김이름</h3>
      <p className="text-sm text-gray-600">이메일: name@example.com</p>
      <p className="text-sm text-gray-600">전화번호: 010-1234-5678</p>
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
                <tr>
                  <td className="border-b py-2 px-4">1001</td>
                  <td className="border-b py-2 px-4">2023-03-01</td>
                  <td className="border-b py-2 px-4">기념품 세트</td>
                  <td className="border-b py-2 px-4">배송완료</td>
                </tr>
                <tr>
                  <td className="border-b py-2 px-4">1002</td>
                  <td className="border-b py-2 px-4">2023-03-05</td>
                  <td className="border-b py-2 px-4">휴대용 스피커</td>
                  <td className="border-b py-2 px-4">배송중</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "reviews":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">내 리뷰</h2>
            <ul className="space-y-4">
              <li className="bg-gray-100 p-4 rounded-md">
                <h4 className="text-xl font-semibold">스마트폰</h4>
                <p className="text-sm text-gray-600">별점: ★★★★☆</p>
                <p>좋은 제품입니다. 배터리 지속시간이 길어서 만족스럽습니다.</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md">
                <h4 className="text-xl font-semibold">노트북</h4>
                <p className="text-sm text-gray-600">별점: ★★★★★</p>
                <p>가볍고 성능도 좋아서 매우 만족합니다.</p>
              </li>
            </ul>
          </div>
        );
      case "wishlist":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              위시리스트
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center bg-gray-100 p-4 rounded-md">
                <img
                  src="https://via.placeholder.com/100"
                  alt="상품 이미지"
                  className="w-24 h-24 object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-semibold">무선 이어폰</h4>
                  <p className="text-sm text-gray-600">가격: 150,000원</p>
                  <button className="mt-2 py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition">
                    장바구니에 추가
                  </button>
                </div>
              </li>
              <li className="flex items-center bg-gray-100 p-4 rounded-md">
                <img
                  src="https://via.placeholder.com/100"
                  alt="상품 이미지"
                  className="w-24 h-24 object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-semibold">스마트워치</h4>
                  <p className="text-sm text-gray-600">가격: 250,000원</p>
                  <button className="mt-2 py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition">
                    장바구니에 추가
                  </button>
                </div>
              </li>
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

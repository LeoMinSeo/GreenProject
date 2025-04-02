import React, { useEffect } from "react";

const MyPageOrders = ({ orders }) => {
  // 주문일자 포맷 함수 (예: 2025-03-27 PM12:54)
  const formatOrderDate = (orderDate) => {
    const date = new Date(orderDate);

    // YYYY-MM-DD 형식 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 시간 변환 (12시간제 + AM/PM)
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12; // 0시는 12로 변환

    return `${year}-${month}-${day} ${period} ${formattedHours}:${minutes}`;
  };

  // 받은 주문 데이터 확인
  useEffect(() => {
    console.log("받은 주문 내역:", orders);
  }, [orders]);

  return (
    <div className="flex  justify-end ml-20 h-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mt-20 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 select-none">
          주문 내역
        </h2>

        {/* 주문 내역 컨테이너 */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {!orders || orders.length === 0 ? (
              <div className="text-center text-gray-600 py-4 select-none">
                주문 내역이 없습니다.
              </div>
            ) : (
              <>
                {/* 헤더 */}
                <div
                  className="grid grid-cols-5 bg-gray-100 font-semibold text-gray-700 p-3 rounded-t-lg select-none"
                  style={{ gridTemplateColumns: "2fr 2fr 2fr 2fr 2fr" }}
                >
                  <div className="px-2">주문번호</div>
                  <div className="px-2">주문일자</div>
                  <div className="px-2">상품명</div>
                  <div className="px-2">운송장번호</div>
                  <div className="px-2 text-center">상태</div>
                </div>

                {/* 주문 내역 리스트 */}
                {orders.map((order) => (
                  <div
                    key={order.orderNo}
                    className="grid grid-cols-5 border-b py-3 px-3"
                  >
                    <div className="px-2">{order.orderNo}</div>
                    <div className="px-2">
                      {formatOrderDate(order.orderDate)}
                    </div>
                    <div className="px-2">{order.productName}</div>
                    <div className="px-2">
                      {order.trackingNo
                        ? order.trackingNo
                        : "상품 배송 준비 중"}
                    </div>
                    <div className="px-2 text-center">{order.status}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageOrders;

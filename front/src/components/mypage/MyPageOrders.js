import React, { useState, useEffect } from "react";
import ReviewModal from "../customModal/ReviewModal";

const MyPageOrders = ({ orders, refreshData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 2;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };
  const handleReviewSuccess = () => {
    refreshData();
  };

  // 주문 날짜 및 시간 포맷 함수
  const formatOrderDate = (orderDate) => {
    const date = new Date(orderDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12;

    return {
      date: `${year}-${month}-${day}`,
      time: `${period} ${formattedHours}:${minutes}`,
    };
  };

  useEffect(() => {
    console.log("받은 주문 내역:", orders);
  }, [orders]);

  // 최신순 정렬
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  // 날짜별 그룹화
  const groupedOrders = sortedOrders.reduce((acc, order) => {
    const { date, time } = formatOrderDate(order.orderDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push({ time, ...order });
    return acc;
  }, {});

  // 날짜 기준으로 리스트 변환
  const groupedDateList = Object.entries(groupedOrders);

  // 페이지네이션
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const paginatedGroups = groupedDateList.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(groupedDateList.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex justify-end ml-20 h-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mt-20 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-4 select-none">
          주문 내역
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {!orders || orders.length === 0 ? (
              <div className="text-center text-gray-600 py-8 select-none">
                주문 내역이 없습니다.
              </div>
            ) : (
              <>
                {paginatedGroups.map(([date, orders]) => (
                  <div key={date} className="mb-2">
                    {/* 첫 번째 주문에서만 날짜를 왼쪽에, 주문 번호를 오른쪽에 표시 */}
                    <div className="flex justify-between mb-2">
                      {orders[0] && (
                        <>
                          <div className="text-lg font-bold">{date}</div>{" "}
                          {/* 날짜 왼쪽 */}
                          <div className="text-gray-500 text-sm">
                            주문번호: {orders[0].orderNo}
                          </div>{" "}
                          {/* 주문번호 오른쪽 */}
                        </>
                      )}
                    </div>

                    {/* 각 주문별로 개별적으로 표시 */}
                    {orders.map((order, orderIndex) => (
                      <div key={order.orderNo}>
                        <div className="flex justify-between items-center mb-2 mt-2">
                          <div className="flex items-center text-sm text-blue-600 font-semibold">
                            <p>{order.status}</p>
                          </div>

                          {/* 두 번째 이후 주문에서 주문 번호는 status의 위치에 맞춰 표시 */}
                          {orderIndex > 0 && (
                            <div className="text-gray-500 text-sm">
                              주문번호: {order.orderNo}
                            </div>
                          )}
                        </div>

                        {/* 주문 상태 및 상품 리스트 */}
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-start mt-2">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-28 h-28 ">
                                <img
                                  src={
                                    item.imgFileName
                                      ? `http://localhost:8089/product/view/s_${item.imgFileName}`
                                      : "/images/defalt.jpg"
                                  }
                                  alt={item.productName}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium mb-1">
                                {item.productName}
                              </div>
                              <div className="flex justify-left items-center">
                                <div className="text-sm">
                                  {item.numOfItem}개
                                </div>
                                <span className="mx-2"> / </span>
                                <div className="font-medium">
                                  {item.productPrice.toLocaleString()}
                                </div>

                                {!item.hasReview && (
                                  <button
                                    className="ml-auto px-2 py-1 text-xs text-[rgb(251,146,6)] bg-[rgba(251,146,6,0.1)] rounded-md hover:bg-[rgba(251,146,6,0.2)] transition-colors"
                                    onClick={() => handleReviewClick(item)}
                                  >
                                    리뷰 등록
                                  </button>
                                )}
                              </div>
                              <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
                                <div>
                                  {item.shippingNum
                                    ? `운송장번호: ${order.shippingNum}`
                                    : "상품 배송 준비 중"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}

                {/* 페이지네이션 */}
                <div className="flex justify-center mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`mx-1 px-3 py-1 rounded ${
                          currentPage === number
                            ? "bg-orange-400 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}
                </div>
                <ReviewModal
                  isOpen={isReviewModalOpen}
                  onClose={() => setIsReviewModalOpen(false)}
                  item={selectedItem}
                  orderNo={selectedOrderNo}
                  onSuccess={handleReviewSuccess}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageOrders;

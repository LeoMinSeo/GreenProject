import React, { useState, useEffect } from "react";
import ReviewModal from "../customModal/ReviewModal";
import CancelProductModal from "../customModal/CancelProductModal";
import { Link } from "react-router-dom";

const MyPageOrders = ({ orders, refreshData, uid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 2;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  //0415
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelPno, setCancelPno] = useState(null);
  const [cancelOrderNo, setCancelOrderNo] = useState(null);

  const handleCancelClick = (e, pno, orderNo) => {
    e.stopPropagation();
    setCancelPno(pno);
    setCancelOrderNo(orderNo);
    setIsCancelModalOpen(true);
  };

  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    refreshData();
  };

  // 상품 주문 상태 한글 변환
  const getStatusText = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "결제 완료";
      case "SHIPPING":
        return "배송 중";
      case "DELIVERED":
        return "배송 완료";

      default:
        return status;
    }
  };

  //상품 주문 상태에 따른 글자색
  const getStatusColor = (status) => {
    switch (status) {
      case "PAY_COMPLETED":
        return "text-black";
      case "SHIPPING":
        return "text-yellow-600";
      case "DELIVERED":
        return "text-green-600";
      default:
        return "text-gray-600 bg-gray-50";
    }
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
    <div className="flex justify-end ml-20 h-auto select-none">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-20 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none border-gray-200">
          주문 내역
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {!orders || orders.length === 0 ? (
              <div className="text-center text-gray-600 py-12 select-none text-lg">
                주문 내역이 없습니다.
              </div>
            ) : (
              <>
                {paginatedGroups.map(([date, orders]) => (
                  <div key={date} className="mb-8">
                    {/* 날짜 표시 */}
                    <div className="mb-4">
                      <div className="text-xl font-bold text-gray-700 border-l-4 border-orange-400 pl-3">
                        {date}
                      </div>
                    </div>

                    {/* 각 주문별로 개별적으로 표시 */}
                    {orders.map((order) => (
                      <div
                        key={order.orderNo}
                        className="mb-6 border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        {/* 주문 상태와 주문번호 */}
                        <div className="flex justify-between items-center mb-3">
                          <div
                            className={`flex items-center text-sm font-semibold px-3 py-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </div>
                          <div className="text-gray-500 text-sm">
                            주문번호:{" "}
                            <span className="text-gray-500">
                              {order.orderNo}
                            </span>
                          </div>
                        </div>

                        {/* 주문 상품 리스트 */}
                        {order.orderItems.map((item, index) => (
                          <div key={index}>
                            {/* 상품 사이에 구분선 추가 (첫 번째 상품 제외) */}
                            {index > 0 && (
                              <div className="border-b my-3 mt-2 mb-6"></div>
                            )}

                            <div className="flex items-start mt-2 p-3 rounded-md">
                              <div className="flex-shrink-0 mr-5">
                                <div className="w-36 h-36 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shadow-sm">
                                  <img
                                    src={
                                      item.imgFileName
                                        ? `http://localhost:8089/product/view/s_${item.imgFileName}`
                                        : "/images/defalt.png"
                                    }
                                    alt={item.productName}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-xl mb-2 text-gray-800">
                                  <Link
                                    to={`/product/read/${item.pno}`}
                                    className="text-black hover:text-orange-400"
                                  >
                                    {item.productName}
                                  </Link>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-3">
                                  <div className="text-sm flex items-center">
                                    <span>{item.numOfItem}개</span>
                                  </div>
                                  <span className="hidden md:block mx-2 text-gray-300">
                                    {" "}
                                    ❙{" "}
                                  </span>
                                  <div className="text-sm flex items-center mt-1 md:mt-0">
                                    <span className="font-medium">
                                      {(() => {
                                        // 가격 문자열에서 숫자 부분만 추출
                                        const price = parseInt(
                                          item.productPrice.replace(
                                            /[^0-9]/g,
                                            ""
                                          ),
                                          10
                                        );
                                        const totalPrice =
                                          price * item.numOfItem;
                                        return (
                                          totalPrice.toLocaleString() + "원"
                                        ); // 계산 후 원화 표시
                                      })()}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                  {order.shippingNum ? (
                                    <>
                                      운송장 번호:{" "}
                                      <span className="font-medium">
                                        {order.shippingNum}
                                      </span>
                                    </>
                                  ) : (
                                    "상품 배송 준비 중"
                                  )}
                                </div>

                                {/* 리뷰 등록 버튼 */}
                                {order.status === "DELIVERED" &&
                                  !item.hasReview && (
                                    <div className="flex justify-end mt-2">
                                      <button
                                        className="px-2 py-1  text-sm text-orange-500 bg-orange-100 rounded-lg hover:bg-orange-100 transition-colors"
                                        onClick={() => handleReviewClick(item)}
                                      >
                                        리뷰 등록
                                      </button>
                                    </div>
                                  )}
                                <div className="flex justify-end mt-2">
                                  {item.refundStatus === "WAITING" ? (
                                    <div className="flex justify-end mt-2 text-sm text-red-500">
                                      환불 요청 중
                                    </div>
                                  ) : (
                                    <div className="flex justify-end mt-2">
                                      <button
                                        className="px-2 py-1 text-sm text-red-500 bg-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-colors active:scale-105"
                                        onClick={(e) =>
                                          handleCancelClick(
                                            e,
                                            item.pno,
                                            item.realOrderNum
                                          )
                                        }
                                      >
                                        주문 취소
                                      </button>
                                    </div>
                                  )}
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
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`mx-1 px-4 py-2 rounded-md transition-colors duration-200 ${
                            currentPage === number
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}
                  </div>
                )}
                <ReviewModal
                  isOpen={isReviewModalOpen}
                  onClose={() => setIsReviewModalOpen(false)}
                  item={selectedItem}
                  orderNo={selectedOrderNo}
                  onSuccess={handleReviewSuccess}
                />
                <CancelProductModal
                  isOpen={isCancelModalOpen}
                  onClose={() => setIsCancelModalOpen(false)}
                  pNo={cancelPno}
                  orderNo={cancelOrderNo}
                  uid={uid}
                  refreshData={refreshData}
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

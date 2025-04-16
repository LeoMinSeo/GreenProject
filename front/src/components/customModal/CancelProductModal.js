import React, { useState } from "react";
import { refundProduct } from "../../api/memberApi";

const CancelProductModal = ({
  isOpen,
  onClose,
  pNo,
  orderNo,
  uid,
  refreshData,
}) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }

    const data = {
      pno: pNo,
      uid: uid,
      realOrderNum: orderNo,
      reason: reason,
    };
    refundProduct(data).then((i) => {
      alert(i);
      refreshData();
    });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl transform transition-all">
        <h2 className="text-xl font-bold mb-4">주문 취소</h2>
        <p className="mb-4 text-gray-700">주문을 정말 취소하시겠습니까?</p>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            취소 사유
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-colors"
            rows="3"
            placeholder="주문을 취소하시는 이유를 입력해주세요. (예: 배송 지연, 상품 변경 등)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              handleSubmit();
              onClose(); // 닫기
            }}
          >
            취소 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelProductModal;

import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import SubMenuber from "../menu/SubMenubar";
import { useNavigate } from "react-router-dom";
import { getCartlist } from "../../api/userApi"; // 백엔드 API 호출

const init = [
  {
    cartNo: null,
    userDTO: {
      userId: "",
      userPw: "",
      userName: "",
      userEmail: "",
      userAdress: "",
      uid: null,
    },
    productDTO: {
      pno: null,
      pname: "",
      price: "",
      pdesc: "",
      pstock: null,
      files: [],
      uploadFileNames: [],
    },
    numofItem: 0,
  },
];

const BasketComponent = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(init);

  // 컴포넌트 렌더링 시 로컬스토리지에서 데이터 확인
  useEffect(() => {
    const savedCartData = localStorage.getItem("cartData");

    if (savedCartData) {
      // 로컬스토리지에 데이터가 있으면 그 데이터를 사용
      setCartData(JSON.parse(savedCartData));
    } else {
      // 로컬스토리지에 데이터가 없으면 백엔드에서 가져오기
      getCartlist("leo1657").then((data) => {
        setCartData(data); // 받아온 데이터를 상태로 저장
        localStorage.setItem("cartData", JSON.stringify(data)); // 받아온 데이터를 로컬 스토리지에 저장
      });
    }
  }, []);

  // 수량 업데이트 함수
  const updateQuantity = (cartNo, amount) => {
    setCartData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.cartNo === cartNo
          ? { ...item, numofItem: Math.max(1, item.numofItem + amount) }
          : item
      );
      // 수량 변경 후 로컬스토리지에 데이터 저장
      localStorage.setItem("cartData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  // 아이템 제거 함수
  const removeItem = (cartNo) => {
    setCartData((prevData) => {
      const updatedData = prevData.filter((item) => item.cartNo !== cartNo);
      // 아이템 삭제 후 로컬스토리지에 데이터 저장
      localStorage.setItem("cartData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const totalPrice = cartData.reduce(
    (sum, item) =>
      sum +
      parseInt(item.productDTO.price.replace("원", "").replace(",", "")) *
        item.numofItem,
    0
  );

  // 숫자에 콤마 추가하기
  const formattedTotalPrice = new Intl.NumberFormat().format(totalPrice);

  const handlePayment = () => {
    // 결제하기 전에 로컬스토리지에 데이터를 저장
    localStorage.setItem("cartData", JSON.stringify(cartData));
    navigate(`/shopping/payment?totalPrice=${formattedTotalPrice}`); // 결제 완료 후 이동할 페이지
  };

  return (
    <div>
      <SubMenuber />
      <div className="mt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={32} /> 장바구니
        </h1>

        {cartData.length === 0 ? (
          <p className="text-gray-500 text-lg">장바구니가 비어 있습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 장바구니 리스트 */}
            <div className="md:col-span-2 space-y-4">
              {cartData.map((item) => (
                <div
                  key={item.cartNo}
                  className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg"
                >
                  <img
                    src={
                      item.productDTO.uploadFileNames.length > 0
                        ? `http://localhost:8089/product/view/s_${item.productDTO.uploadFileNames[0]}`
                        : "/images/defalt.jpg"
                    }
                    alt={item.productDTO.pname}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h2 className="text-lg font-semibold">
                      {item.productDTO.pname}
                    </h2>
                    <p className="text-gray-600">
                      {item.productDTO.price} ({item.numofItem}개)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.cartNo, -1)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.numofItem}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartNo, 1)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartNo)}
                    className="text-red-500 ml-4"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* 장바구니 요약 */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">최종 결제 금액</h2>
              <p className="text-lg font-semibold mb-2">
                총 가격: {formattedTotalPrice}원
              </p>
              <button
                className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                onClick={handlePayment}
              >
                결제하러가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketComponent;

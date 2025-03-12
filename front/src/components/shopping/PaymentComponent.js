import React, { useEffect } from "react";
import SubMenuber from "../menu/SubMenubar";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, Truck } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToss, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { useLocation } from "react-router-dom";

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

const PaymentComponent = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phonenumber: "",
    note: "",
    card: "",
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const totalPrice = queryParams.get("totalPrice");
  const [cartData, setCartData] = useState(init);

  useEffect(() => {
    const savedCartData = localStorage.getItem("cartData"); // 로컬 스토리지에서 cartData 가져오기

    if (savedCartData) {
      const parsedCartData = JSON.parse(savedCartData); // JSON 문자열을 객체로 변환
      setCartData(parsedCartData); // cartItems 상태에 저장

      // 사용자 정보를 form에 채우기
      const user = parsedCartData[0]?.userDTO; // 사용자 정보가 있을 경우
      if (user) {
        setForm({
          name: user.userName || "",
          address: user.userAdress || "",
          phonenumber: "010-9064-9217", // 전화번호 정보가 없으므로 빈값으로 처리
          note: "", // 요청사항은 빈값으로 처리
          card: "", // 카드정보는 아직 사용하지 않으므로 빈값
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isFormCompleted, setIsFormCompleted] = useState(false); // 기본정보 입력 완료 여부 상태
  const [canProceedToPayment, setCanProceedToPayment] = useState(false); // 결제 진행 가능 여부 상태
  const [isPaymentDIVOpen, setIsPaymentDIVOpen] = useState(false); // 결제 모달 상태

  // 기본정보 입력이 모두 완료되었는지 체크하는 함수
  const checkFormCompletion = () => {
    const { name, address, phonenumber, note } = form;
    if (name && address && phonenumber && note) {
      setIsFormCompleted(true);
    } else {
      setIsFormCompleted(false);
    }
  };

  // 기본정보 입력 완료 후 결제 진행 가능 여부 활성화
  const handleFormCompletion = () => {
    checkFormCompletion();
    if (isFormCompleted) {
      setCanProceedToPayment(true);
    }
  };

  const handlePayment = () => {
    setIsPaymentDIVOpen(true); // 결제 버튼 클릭 시 모달 열기
  };
  const clickSubmit = () =>{

  }
  return (
    <div>
      <SubMenuber />

      <div className="h-screen overflow-hidden mt-24 bg-gray-100 flex flex-col md:flex-row items-start justify-center p-6 gap-8">
        {/* 왼쪽 - 배송 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full md:w-2/3"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Truck size={24} /> 장바구니 내역
          </h2>
          <div className="mb-10">
            <div className="md:col-span-2 space-y-4">
              {cartData.map((item) => (
                <div
                  key={item.productDTO.pno} // pno를 key로 사용
                  className="flex items-center justify-between bg-white rounded-lg"
                >
                  <img
                    src={
                      item.productDTO.uploadFileNames.length > 0
                        ? `http://localhost:8089/product/view/s_${item.productDTO.uploadFileNames[0]}`
                        : "/images/defalt.jpg"
                    } // 이미지 URL 수정
                    alt={item.productDTO.pname}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h2 className="text-lg font-semibold">
                      {item.productDTO.pname}
                    </h2>
                    <p className="text-gray-600">{item.productDTO.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      수량 : {item.numofItem}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Truck size={24} /> 기본 배송 정보
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-600">이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => {
                  handleChange(e);
                  checkFormCompletion();
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="text-gray-600">전화번호</label>
              <input
                type="text"
                name="phonenumber"
                value={form.phonenumber}
                onChange={(e) => {
                  handleChange(e);
                  checkFormCompletion();
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="010-1234-5678"
              />
            </div>

            <div>
              <label className="text-gray-600">주소</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={(e) => {
                  handleChange(e);
                  checkFormCompletion();
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="서울특별시 강남구"
              />
            </div>

            <div>
              <label className="text-gray-600">요청사항</label>
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={(e) => {
                  handleChange(e);
                  checkFormCompletion();
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder="문앞에 두고 가주세요"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFormCompletion}
              disabled={!isFormCompleted}
              className={`mt-6 w-full ${
                isFormCompleted ? "bg-gray-400" : "bg-gray-300"
              } text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition`}
            >
              기본정보 입력 완료
            </motion.button>
          </div>
        </motion.div>

        <div className="w-full md:w-1/3 md:overflow-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md md:top-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard size={24} /> 결제 정보
            </h2>

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">총 결제 금액</p>
              <p className="text-2xl font-bold mt-2">{totalPrice}원</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!canProceedToPayment}
              onClick={handlePayment} // 결제하기 버튼 클릭 시 결제 모달 열기
              className={`mt-6 w-full ${
                canProceedToPayment ? "bg-gray-400" : "bg-gray-300"
              } text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition`}
            >
              결제하기
            </motion.button>

            <p className="text-gray-500 text-sm text-center mt-4 flex items-center justify-center gap-1">
              <CheckCircle size={16} className="text-green-500" /> 안전한 결제가
              보장됩니다.
            </p>
          </div>

          {/* 결제 방법 박스 (결제하기 버튼을 누르면 나타남) */}
          {isPaymentDIVOpen && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">결제 방법 선택</h2>
              <div className="flex flex-wrap gap-2">
                <button className="w-[calc(50%-4px)] py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2">
                  <img
                    src="/images/toss.png"
                    alt="Toss"
                    className="w-7 h-7 mr-2 "
                  />
                  토스
                </button>
                <button className="w-[calc(50%-4px)] py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg flex items-center justify-center gap-2">
                  <svg
                    className="w-7 h-7 mr-2"
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="256" height="256" fill="#03C75A" />
                    <path
                      d="M82.8 72.6h33.1l39.8 54.4V72.6h28.5v110.8h-33.1l-39.8-54.4v54.4H82.8V72.6z"
                      fill="#fff"
                    />
                  </svg>
                  네이버페이
                </button>
                <button className="w-[calc(50%-4px)] py-3 bg-red-400 hover:bg-red-500 text-white rounded-lg flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPaypal} />
                  PAYCO
                </button>
                <button className="w-[calc(50%-4px)] py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg flex items-center justify-center gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
                    alt="Kakao"
                    className="w-7 h-7 mr-2 "
                  />
                  카카오페이
                </button>
                <button className="w-[calc(50%-4px)] py-3 bg-[#9c7bc3] hover:bg-[#9c7bc3] text-white rounded-lg flex items-center justify-center gap-2">
                  <img
                    src="/images/sinyoung.png"
                    alt="Kakao"
                    className="w-7 h-7 mr-2 "
                  />
                  신용카드
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, Truck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrder } from "../../api/userApi";
import MainMenubar from "../menu/MainMenubar";

const PaymentComponent = () => {
  const [sendData, setSendData] = useState({});
  const [form, setForm] = useState({
    name: "",
    address: "",
    phonenumber: "",
    note: "",
  });
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const totalPrice = queryParams.get("totalPrice");
  const requestData = JSON.parse(queryParams.get("cartData"));

  useEffect(() => {
    setCartData(requestData);
    console.log(requestData);
    setForm({
      name: requestData[0].userDTO.userName || "",
      address: requestData[0].userDTO.userAdress || "",
      phonenumber: "010-9064-9217", // 전화번호 정보가 없으므로 빈값으로 처리
      note: "", // 요청사항은 빈값으로 처리
    });
  }, []);
  useEffect(() => {
    if (sendData && Object.keys(sendData).length > 0) {
      addOrder(sendData).then((i) => {
        console.log(i);
        navigate(`/member/success/${i}`);
      });
    }
  }, [sendData]);

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
    const send = {
      userdto: {
        uid: cartData[0].userDTO.uid,
      },
      shippingAdress: form.address,
      note: form.note,
      totalPrice: totalPrice,
      orderItems: cartData.map((i) => {
        return { pno: i.productDTO.pno, numOfItem: i.numofItem };
      }),
    };
    const realprice = parseInt(totalPrice.replace(/,/g, ""));
    const ProductCount = new Set(cartData.map((item) => item.productDTO.pno))
      .size;
    const imp = window.IMP; // 아이엠포트 객체

    imp.init("imp82633673"); // 가맹점 ID (확인 필요)

    imp.request_pay(
      {
        pg: "mobilians",
        pay_method: "card",
        name: `${cartData[0].productDTO.pname}외 ${ProductCount}건`,
        amount: realprice,
      },
      function (rsp) {
        if (rsp.success) {
          alert("결제가 완료되었습니다.");
          addOrder(rsp.imp_uid, send).then((i) => {
            navigate(`/member/success/${i}`);
          });
        } else {
          alert("결제에 실패하였습니다. 실패 사유: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div>
      <MainMenubar />

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
                    }
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
              onClick={handlePayment} // 여기에 지금 넣은거
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
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;

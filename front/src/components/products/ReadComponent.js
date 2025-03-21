import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOne } from "../../api/productsApi";
import ReviewComponent from "../menu/ReviewComponent";
import { addCart } from "../../api/userApi";
import ResultModal from "../common/ResultModal";
import MainMenubar from "../menu/MainMenubar";

const init = [
  {
    productDTO: {},
    reviewRatingDTO: {},
  },
];

const ReadComponent = () => {
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const pno = useParams();
  const navigate = useNavigate();
  const [returnMsg, setReturnMsg] = useState(null);
  const [product, setProduct] = useState(init);
  const [fetching, setFetching] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // 수량 증가/감소 함수
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // 상품 정보 불러오기
  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
      setFetching(false);
      console.log(data);
    });
  }, [pno]);

  // FormData 객체
  const formDataRef = useRef(new FormData());

  // 사용자 정보 및 상품, 수량 설정
  useEffect(() => {
    let userId;

    // 로그인한 사용자라면, 그 ID를 사용
    if (loginUser) {
      userId = loginUser.userId;
    } else {
      // 비회원이라면, 임시 사용자 ID를 생성하여 localStorage에 저장
      userId = localStorage.getItem("guestId");
      if (!userId) {
        const guestId = `guest_${Date.now()}`; // 고유한 ID 생성 (임시 사용자 ID)
        localStorage.setItem("guestId", guestId);
        userId = guestId;
      }
    }

    formDataRef.current.set("userId", userId);
    formDataRef.current.set("pNo", pno.pno);
    formDataRef.current.set("numOfItem", quantity);
  }, [pno, quantity, loginUser]);

  // 장바구니에 상품 추가
  const clickSubmit = () => {

    // 로그인한 경우
    if (loginUser) {
      addCart(formDataRef.current).then((data) => {
        setReturnMsg(data);
      });
    } else {
      // 비회원인 경우
      alert("비회원으로 장바구니에 담겼습니다.");

      // 비회원도 장바구니 담기는 완료됨
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productData = {
        pNo: pno.pno,
        quantity: quantity,
        productDTO: product.productDTO,
      };
      cart.push(productData);
      localStorage.setItem("cart", JSON.stringify(cart)); // 로컬 스토리지에 장바구니 담기
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setReturnMsg(null);
  };

  return (
    <div className="min-h-screen p-6">
      {returnMsg ? (
        <ResultModal content={returnMsg} callbackFn={closeModal} />
      ) : (
        <></>
      )}
      <MainMenubar />
      {/* 전체 컨테이너 */}
      {fetching ? (
        <div className="text-center text-2xl font-bold">로딩 중...</div> // 로딩 상태일 때 표시할 메시지
      ) : (
        <section className="bg-white p-6 border border-[#ad9e87] border-opacity-30 rounded-lg mt-24 flex flex-row w-full md:w-2/3 justify-between mx-auto">
          {/* 왼쪽: 상품 이미지 */}
          <div className="w-1/3 h-auto bg-white p-6 rounded-lg relative overflow-hidden">
            <img
              src={
                product.productDTO.uploadFileNames.length > 0
                  ? `http://localhost:8089/product/view/${product.productDTO.uploadFileNames[0]}`
                  : "/images/defalt.jpg"
              }
              alt="상품 이미지"
              className="h-auto rounded-md mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            />
          </div>

          {/* 오른쪽: 상품 정보 */}
          <div className="w-2/3 h-auto text-left ml-4 flex flex-col">
            <h2 className="text-2xl font-bold">{product.productDTO.pname}</h2>
            <p className="mt-2 text-xl font-bold text-red-600">
              {product.productDTO.price}
            </p>
            <div className="mt-4 p-3 border rounded-lg bg-gray-100">
              <p className="text-gray-600">쿠폰에 관한 정보를 입력하시오</p>
            </div>

            {/* 간단설명 */}
            <div className="mt-4 p-3 border rounded-lg">
              <p className="font-bold">상품설명</p>
              <p className="text-gray-600 text-sm mt-1">
                {product.productDTO.pdesc}
              </p>
            </div>

            {/* 상품 옵션 선택 */}
            <div className="mt-4 ml-auto">
              <label className="block font-bold">
                상품의 수량을 선택하세요
              </label>
              <div className="flex items-center space-x-3">
                <button
                  className="px-3 py-2 border rounded-lg text-lg ml-auto "
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  className="px-3 py-2 border rounded-lg text-lg"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* 장바구니 & 바로구매 버튼 */}
            <div className="mt-6 flex gap-2 ">
              <button
                className="w-1/2 p-3 bg-[#ad9e87] text-white rounded-lg"
                onClick={clickSubmit}
              >
                장바구니
              </button>
              <button className="w-1/2 p-3 bg-[#ad9e87] text-white rounded-lg">
                바로구매
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 리뷰 컴포넌트 */}
      {!fetching && (
        <ReviewComponent
          count={product.reviewRatingDTO.reviewcount}
          rating={product.reviewRatingDTO.avgrating}
          pno={pno.pno}
        />
      )}
    </div>
  );
};

export default ReadComponent;

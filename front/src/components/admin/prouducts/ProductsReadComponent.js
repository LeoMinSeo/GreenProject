import React, { useEffect, useRef, useState } from "react";
import SubMenubar from "../../menu/SubMenubar";
import { useParams } from "react-router-dom";
import { getOne } from "../../../api/productsApi";
import ReviewComponent from "../../menu/ReviewComponent";
import { addCart } from "../../../api/userApi";

const init = [
  {
    productDTO: {},
    reviewRatingDTO: {},
  },
];

const ProductsReadComponent = () => {
  const pno = useParams();
  const [returnMsg, setReturnMsg] = useState(null);
  const [product, setProduct] = useState(init);
  const [fetching, setFetching] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
      setFetching(false);
      console.log(data);
    });
  }, [pno]);
  const formDataRef = useRef(new FormData());
  useEffect(() => {
    formDataRef.current.set("userId", "leo1657");
    formDataRef.current.set("pNo", pno.pno);
    formDataRef.current.set("numOfItem", quantity);
    console.log(formDataRef.current.get("numOfItem"));
  }, [pno, quantity]);
  const clickSubmit = () => {
    addCart(formDataRef.current).then((data) => {
      setReturnMsg(data);
    });
  };
  return (
    <div className="min-h-screen p-6">
      {returnMsg ? alert(returnMsg) : <></>}
      <SubMenubar />
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
                  ? `http://localhost:8089/product/view/s_${product.productDTO.uploadFileNames[0]}`
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
              <p className="font-bold">간단설명</p>
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

export default ProductsReadComponent;

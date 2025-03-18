import { useNavigate } from "react-router-dom";
import { getList } from "../../api/productsApi";

import React, { useEffect, useRef, useState } from "react";
import MainMenubar from "../menu/MainMenubar";

const ListComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "앨범", "아티스트", "상품"];

  const [productData, setProductData] = useState({
    dtoList: [],
    pageRequestDTO: {},
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    totalPage: 1,
    current: 1,
  });

  // 제품 데이터를 가져오는 useEffect
  useEffect(() => {
    getList({ page: 1, size: 10 })
      .then((data) => {
        console.log(data); // data 확인

        // 페이지 관련 정보와 데이터 리스트를 모두 상태에 저장
        setProductData({
          dtoList: data.dtoList,
          pageRequestDTO: data.pageRequestDTO,
          totalCount: data.totalCount,
          pageNumList: data.pageNumList,
          prev: data.prev,
          next: data.next,
          prevPage: data.prevPage,
          nextPage: data.nextPage,
          totalPage: data.totalPage,
          current: data.pageRequestDTO.page, // 현재 페이지
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const navigate = useNavigate();
  const moveToRead = (pno) => {
    navigate({
      pathname: `../read/${pno}`,
    });
  };
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.play(); // 동영상이 자동 재생되도록 합니다.
  }, []);

  return (
    <div>
      <div>
        <MainMenubar />
      </div>
      <div className="mt-24  relative flex items-center justify-center h-[40vh] w-full bg-cover bg-center group overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="https://videos.pexels.com/video-files/6862376/6862376-uhd_2732_1440_25fps.mp4"
          loop
          playsInline
          autoPlay
          muted
        ></video>
        <div className="absolute inset-0 bg-[#ad9e87] opacity-30"></div>
        <div className="relative text-center z-10 flex flex-col items-center text-white font-bold text-3xl uppercase tracking-widest lg:text-4xl">
          PRODUCT
        </div>
        <br></br>
      </div>

      <div>
        <div className="bg-white min-h-screen p-6 ">
          {/* 카테고리 버튼 */}
          <div className="flex justify-center mb-6 space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? "bg-gray-500 text-white font-bold"
                    : "bg-gray-200 text-black font-bold"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 제품 목록 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto p-6">
            {productData.dtoList.map((product) => (
              <div
                key={product.pno}
                className="bg-white p-4 rounded-lg border border-[#ad9e87] shadow-lg" // 원래 스타일 적용
                onClick={() => moveToRead(product.pno)}
              >
                <div className="w-full h-52">
                  <img
                    src={
                      product.uploadFileNames.length > 0
                        ? `http://localhost:8089/product/view/s_${product.uploadFileNames[0]}`
                        : "/images/defalt.jpg"
                    }
                    alt={product.pname}
                    className="w-full h-full object-contain rounded-lg" // 원래 스타일 적용
                  />
                </div>
                <hr></hr>
                <h2 className="text-xl font-semibold mt-4">{product.pname}</h2>
                <p className="text-gray-500">{product.price}</p>
                <p className="text-gray-400">재고: {product.pstock}개</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;

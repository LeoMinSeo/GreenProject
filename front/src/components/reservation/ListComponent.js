import React, { useEffect, useRef, useState } from "react";
import MainMenubar from "../menu/MainMenubar";
import { getList } from "../../api/concertApi";
import { useNavigate } from "react-router-dom";

// 카테고리 목록 (실제 데이터의 category 값에 맞춤)
const categories = [
  { id: "all", name: "전체" },
  { id: "뮤지컬", name: "뮤지컬" },
  { id: "연극", name: "연극" },
  { id: "클래식", name: "클래식" },
  { id: "콘서트", name: "콘서트" },
];

const ListComponent = () => {
  const videoRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const video = videoRef.current;
    video.play();
  }, []);
  const navigate = useNavigate();
  const [concertData, setConcertData] = useState({
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

  useEffect(() => {
    getList().then((data) => {
      setConcertData(data);
    });
  }, []);

  // 선택된 카테고리에 따라 콘서트 필터링
  const filteredConcerts =
    selectedCategory === "all"
      ? concertData.dtoList
      : concertData.dtoList.filter(
          (concert) => concert.category === selectedCategory
        );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div>
        <MainMenubar />
      </div>

      {/* 헤더 비디오 섹션 */}
      <div className="mt-16 relative flex items-center justify-center h-64 md:h-80 lg:h-96 w-full overflow-hidden opacity-80">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="https://videos.pexels.com/video-files/7095842/7095842-uhd_2732_1440_25fps.mp4"
          loop
          playsInline
          autoPlay
          muted
        ></video>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative text-center z-10 flex flex-col items-center text-white font-bold text-3xl uppercase tracking-widest lg:text-4xl">
          Culture And Art
        </div>
      </div>

      {/* 카테고리 네비게이션 */}
      <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 border-b border-gray-200 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 text-sm md:text-base font-medium rounded-md transition-all duration-200 ${
                selectedCategory === category.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-purple-500"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 공연 카드 그리드 */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredConcerts.length > 0 ? (
            filteredConcerts.map((concert) => (
              <div
                onClick={() => {
                  navigate(`/reservation/read/${concert.cno}`);
                }}
                key={concert.cno}
                className="group bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={`http://localhost:8089/concert/view/s_${concert.uploadFileName}`}
                    alt={concert.cname}
                    className="w-full h-full object-fill group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className="text-base font-bold text-gray-800 mb-2 truncate"
                    title={concert.cname}
                  >
                    {concert.cname}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {concert.cplace || "공연장소"}
                  </p>

                  {/* 날짜 정보가 있으면 표시, 없으면 기본값 표시 */}
                  <p className="text-xs text-gray-400 mb-2">
                    {concert.startTime || "2023.00.00"} -{" "}
                    {concert.endTime || "2023.00.00"}
                  </p>

                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-sm font-bold text-[#2C3E50]">
                      좌석가격: {concert.cprice}
                    </p>
                    {concert.category === "뮤지컬" && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-sm">
                        인기공연
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                현재 이 카테고리의 공연이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListComponent;

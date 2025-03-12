import React, { useState } from "react";
import MainMenubar from "./menu/MainMenubar";

const sections = [
  { id: "firstPage", text: "첫번째", imgUrl: "/images/test1.png" },
  { id: "secondPage", text: "두번째", imgUrl: "/images/test5.png" },
  { id: "thirdPage", text: "세번째", imgUrl: "/images/test4.png" },
];

const sidesections = [
  { id: 1, text: "home title" },
  { id: 2, text: "product shop" },
  { id: 3, text: "reservation" },
];

const MainComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const showSection = (index) => {
    if (index >= 0 && index < sections.length) {
      setCurrentIndex(index);
    }
  };

  const handleScroll = (event) => {
    if (event.deltaY > 0) {
      showSection(currentIndex + 1);
    } else {
      showSection(currentIndex - 1);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onWheel={handleScroll}
    >
      <MainMenubar currentIndex={currentIndex} />
      {/* 페이지 섹션 */}
      <div className="relative w-full h-full">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="absolute top-0 left-0 w-full h-screen flex items-center justify-center text-white text-3xl font-bold transition-transform duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${section.imgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: `translateY(${(index - currentIndex) * 100}%)`, // Y축 애니메이션
            }}
          >
            <span className="relative z-10">{section.text}</span>
            <br />
          </div>
        ))}
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 flex flex-col items-end">
        {/* 세로선 (회색) */}
        <div className="absolute right-0 top-0 h-full w-[2px] bg-gray-400">
          {/* 현재 선택된 페이지에 해당하는 부분만 하얀색 */}
          <div
            className="absolute right-0 w-[2px] bg-white transition-all duration-500"
            style={{
              top: `${(currentIndex / sections.length) * 100}%`,
              height: `${100 / sections.length}%`,
            }}
          ></div>
        </div>

        {/* 네비게이션 버튼 */}
        <ul className="relative z-10 space-y-2 pr-4">
          {sidesections.map((section, index) => (
            <li key={section.id} className="text-right">
              <button
                onClick={() => showSection(index)}
                className={`text-lg font-bold transition-colors ${
                  index === currentIndex ? "text-white" : "text-gray-400"
                }`}
              >
                {section.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainComponent;

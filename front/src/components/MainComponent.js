import React, { useState } from "react";
import MainMenubar from "./menu/MainMenubar";

const sections = [
  { id: "firstPage", text: "첫번째", imgUrl: "/images/test4.png" },
];

// const sidesections = [
//   { id: 1, text: "home title" },
//   { id: 2, text: "product shop" },
//   { id: 3, text: "reservation" },
// ];

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
            className="absolute top-0 left-0 w-full h-screen flex items-center justify-center  text-3xl font-bold transition-transform duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${section.imgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: `translateY(${(index - currentIndex) * 100}%)`,
            }}
          >
            {index === 0 ? (
              <div
                className="absolute top-[40%] right-1/3 transform -translate-x-1/2 
                         text-center max-w-2xl"
              >
                <h1
                  className="text-6xl font-extrabold tracking-wider"
                  style={{
                    color: "#F5E6C8",
                    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  AudiMew
                </h1>

                <p
                  className="mt-4 text-lg leading-relaxed"
                  style={{
                    color: "#EED9C4",
                    textShadow: "1px 1px 6px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  최고의 사운드를 위한 헤드셋, 스피커 프리미엄 오디오 기기 를
                  제공하는 동시에
                  <br /> 콘서트, 오케스트라, 뮤지컬 등다양한 공연 티켓을 예약 할
                  수 있는<br></br>기존과 다른 새로운 패러다임의 음악 문화
                  플랫폼입니다.
                  <br></br>
                  듣고, 경험하고, 소유하는 새로운 방식 AudiMew에서 시작하세요.
                </p>
              </div>
            ) : (
              <span className="relative z-10 text-4xl font-bold">
                {section.text}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* 네비게이션 메뉴
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 flex flex-col items-end">
        <div className="absolute right-0 top-0 h-full w-[2px] bg-gray-400">
          <div
            className="absolute right-0 w-[2px] bg-white transition-all duration-500"
            style={{
              top: `${(currentIndex / sections.length) * 100}%`,
              height: `${100 / sections.length}%`,
            }}
          ></div>
        </div>

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
      </div> */}
    </div>
  );
};

export default MainComponent;

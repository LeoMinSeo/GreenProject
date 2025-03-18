import React, { useEffect, useRef } from "react";
import MainMenubar from "../menu/MainMenubar";

const Culture = [
  {
    id: 1,
    title: "Musical",
    description: "good",
    price: "$500~",
  },
  {
    id: 2,
    title: "Movie",
    description: "soso",
    price: "$400~",
  },
  {
    id: 3,
    title: "Drama",
    description: "not bad.",
    price: "$600~",
  },
  {
    id: 4,
    title: "Tour",
    description: "go",
    price: "$450~",
  },
];

const ListComponent = () => {
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
      {/* 로고 */}
      <div className="mt-24 mb-10 relative flex items-center justify-center h-[40vh] w-full bg-cover bg-center group overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="https://videos.pexels.com/video-files/7095842/7095842-uhd_2732_1440_25fps.mp4"
          loop
          playsInline
          autoPlay
          muted
        ></video>
        <div className="absolute inset-0 bg-[#ad9e87] opacity-30"></div>
        <div className="relative text-center z-10 flex flex-col items-center text-white font-bold text-3xl uppercase tracking-widest lg:text-4xl">
          CONCERT
        </div>
        
      </div>
      {/* 로고 끝  */}
      {/* 하단 DIV */}
      <div class="text-gray-600 relative text-center z-10 flex flex-col items-center font-bold text-3xl uppercase tracking-widest lg:text-3xl">
        Cultures
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto p-6">
        {Culture.map((Culture) => (
          <div
            key={Culture.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src="/images/music1.png"
              alt={Culture.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {Culture.title}
              </h2>
              <p className="text-gray-600 mt-2">{Culture.description}</p>
              <p className="text-lg font-semibold text-blue-600 mt-4">
                {Culture.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListComponent;

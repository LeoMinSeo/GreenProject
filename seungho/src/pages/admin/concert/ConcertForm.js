import React, { useState } from "react";
import axios from "axios";

function ConcertForm() {
  const [concert, setConcert] = useState({
    cno: 1, // 기존 공연 번호
    cname: "뮤지컬<도리안 그레이",
    cprice: "50,000원",
    cplace: "홍익대 대학로 아트센터",
    cdesc:
      "아름다움의 심연과 욕망을 고찰하는 솔직하고 아름다운 통렬의 수작! 9년만에 돌아오는 화제작, 뮤지컬<도리안 그레이> 오스카 와일드의 유일한 장편소설 '도리안 그레이의 초상' 원작",
    uploadFileName: null,
    schedulesDtoList: [
      {
        totalSeats: 100,
        startTime: "2025-04-01T19:00:00",
        endTime: "2025-04-01T21:00:00",
      },
      {
        totalSeats: 100,
        startTime: "2025-04-01T21:00:00",
        endTime: "2025-04-01T23:00:00",
      },
      {
        totalSeats: 100,
        startTime: "2025-04-01T17:00:00",
        endTime: "2025-04-01T19:00:00",
      },
    ],
  });

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // concertDTO를 JSON 문자열로 변환하여 FormData에 추가
    formData.append(
      "concertDTO",
      new Blob([JSON.stringify(concert)], { type: "application/json" })
    );

    // 파일이 있으면 FormData에 파일도 추가
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.put(
        "http://localhost:8089/admin/modify/concert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 반드시 multipart/form-data로 설정
          },
        }
      );
      console.log("서버 응답:", response.data);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>콘서트 이름: </label>
        <input
          type="text"
          value={concert.cname}
          onChange={(e) => setConcert({ ...concert, cname: e.target.value })}
        />
      </div>
      <div>
        <label>가격: </label>
        <input
          type="text"
          value={concert.cprice}
          onChange={(e) => setConcert({ ...concert, cprice: e.target.value })}
        />
      </div>
      <div>
        <label>설명: </label>
        <input
          type="text"
          value={concert.cdesc}
          onChange={(e) => setConcert({ ...concert, cdesc: e.target.value })}
        />
      </div>
      <div>
        <label>장소: </label>
        <input
          type="text"
          value={concert.cplace}
          onChange={(e) => setConcert({ ...concert, cplace: e.target.value })}
        />
      </div>
      <div>
        <label>파일 업로드: </label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button type="submit">등록</button>
    </form>
  );
}

export default ConcertForm;

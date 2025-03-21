import React, { useState } from "react";
import axios from "axios";

function ConcertForm() {
  const [concert, setConcert] = useState({
    cname: "",
    cprice: "",
    cdesc: "",
    cplace: "",
    schedulesDtoList: [], // 필요한 경우 입력 UI 구성
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // JSON 데이터를 Blob 객체로 감싸서 올바른 Content-Type 설정
    formData.append(
      "concertDTO",
      new Blob([JSON.stringify(concert)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:8089/admin/addconcert",
        formData
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
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button type="submit">등록</button>
    </form>
  );
}

export default ConcertForm;

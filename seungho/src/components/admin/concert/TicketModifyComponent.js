import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const TicketModifyComponent = () => {
  const { id } = useParams(); // URL 파라미터에서 티켓 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const location = useLocation(); // location 객체 가져오기

  // 폼 데이터 관리를 위한 state
  const [formData, setFormData] = useState({
    performanceTitle: "", // 공연 제목
    featuredArtist: "", // 주요 아티스트
    performanceVenue: "", // 공연 장소
    performanceDate: "", // 공연 날짜
    ticketDelivery: "", // 티켓 배송 방법
    runningTime: "", // 상영 시간
    viewingAge: "", // 관람 연령
    ticketPrice: "", // 티켓 가격
    reservationStartDate: "", // 예약 시작일
    reservationEndDate: "", // 예약 종료일
    performancePosterImage: "", // 공연 포스터 이미지 URL
    performanceArtistImage: "", // 공연 아티스트 이미지 URL
    performanceDescription: "", // 공연 설명
    performanceNotice: "", // 공연 공지
    performanceCast: "", // 공연 캐스팅
  });

  // 이미지 미리보기 URL 관리를 위한 state
  const [performancePosterPreview, setPerformancePosterPreview] = useState(""); // 공연 포스터 이미지 미리보기 URL
  const [performanceArtistPreview, setPerformanceArtistPreview] = useState(""); // 공연 아티스트 이미지 미리보기 URL

  // 컴포넌트 마운트 시 location.state 또는 localStorage에서 티켓 데이터 가져오기
  useEffect(() => {
    const ticket = location.state?.ticket; // location.state에서 티켓 정보 가져오기

    if (ticket) {
      // 티켓 정보가 있으면
      setFormData(ticket); // formData state 업데이트
      setPerformancePosterPreview(ticket.performancePosterImage || ""); // performancePosterPreview state 업데이트
      setPerformanceArtistPreview(ticket.performanceArtistImage || ""); // performanceArtistPreview state 업데이트
    } else {
      // 티켓 정보가 없으면
      const storedTickets =
        JSON.parse(localStorage.getItem("ticketList")) || []; // localStorage에서 티켓 목록 가져오기, 없으면 빈 배열
      const ticketToModify = storedTickets.find((ticket) => ticket.id === id); // 수정할 티켓 ID와 일치하는 티켓 찾기

      if (ticketToModify) {
        // 수정할 티켓이 있으면
        setFormData(ticketToModify); // formData state 업데이트
        setPerformancePosterPreview(
          ticketToModify.performancePosterImage || ""
        ); // performancePosterPreview state 업데이트
        setPerformanceArtistPreview(
          ticketToModify.performanceArtistImage || ""
        ); // performanceArtistPreview state 업데이트
      } else {
        // 수정할 티켓이 없으면
        alert("수정할 티켓을 찾을 수 없습니다."); // 알림 메시지 표시
        navigate("/admin/list/TicketList"); // 티켓 목록 페이지로 이동
      }
    }
  }, [id, navigate, location.state]); // id, navigate, location.state가 변경될 때마다 useEffect 실행

  // 폼 입력 값 변경 시 호출되는 함수
  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트가 발생한 input 요소의 name과 value 값을 가져옴
    setFormData((prev) => ({ ...prev, [name]: value })); // 기존 formData를 복사하고, 해당 name의 값을 새로운 value로 업데이트
  };

  // 이미지 업로드 시 호출되는 함수
  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0]; // 업로드된 파일 정보 가져오기

    if (!file) return; // 파일이 없으면 함수 종료

    const reader = new FileReader(); // FileReader API를 사용하여 파일 읽기

    reader.onloadend = () => {
      // 파일 읽기가 완료되면
      setFormData((prev) => ({ ...prev, [imageType]: reader.result })); // formData의 해당 imageType 필드 값을 FileReader 결과로 업데이트
      if (imageType === "performancePosterImage") {
        // imageType이 "performancePosterImage"인 경우
        setPerformancePosterPreview(reader.result); // performancePosterPreview state를 FileReader 결과로 업데이트
      } else if (imageType === "performanceArtistImage") {
        // imageType이 "performanceArtistImage"인 경우
        setPerformanceArtistPreview(reader.result); // performanceArtistPreview state를 FileReader 결과로 업데이트
      }
    };

    reader.readAsDataURL(file); // 파일을 Data URL로 읽기
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 막기

    // localStorage에서 기존 데이터 가져오기
    const storedTickets = JSON.parse(localStorage.getItem("ticketList")) || [];

    // 수정된 데이터를 기존 데이터에 반영
    const updatedTickets = storedTickets.map((ticket) =>
      ticket.id === id ? { ...formData, id: id } : ticket
    );

    // localStorage에 업데이트된 데이터 저장
    localStorage.setItem("ticketList", JSON.stringify(updatedTickets));

    alert("티켓 정보가 성공적으로 수정되었습니다.");

    // TicketList 페이지로 수정된 formData를 다시 전송
    navigate("/admin/list/TicketList", { state: { updatedTicket: formData } });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">티켓 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 공연 제목 및 주요 아티스트 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">공연 제목</label>
            <input
              type="text"
              name="performanceTitle"
              value={formData.performanceTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="공연 제목을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">주요 아티스트</label>
            <input
              type="text"
              name="featuredArtist"
              value={formData.featuredArtist}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="주요 아티스트를 입력하세요"
              required
            />
          </div>
        </div>

        {/* 공연 장소 및 공연 날짜 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">공연 장소</label>
            <input
              type="text"
              name="performanceVenue"
              value={formData.performanceVenue}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="공연 장소를 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">공연 날짜</label>
            <input
              type="datetime-local"
              name="performanceDate"
              value={formData.performanceDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* 티켓 배송 방법 및 상영 시간 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">티켓 배송 방법</label>
            <input
              type="text"
              name="ticketDelivery"
              value={formData.ticketDelivery}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="티켓 배송 방법을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">상영 시간</label>
            <input
              type="text"
              name="runningTime"
              value={formData.runningTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="상영 시간을 입력하세요"
              required
            />
          </div>
        </div>

        {/* 관람 연령 및 티켓 가격 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">관람 연령</label>
            <input
              type="text"
              name="viewingAge"
              value={formData.viewingAge}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="관람 연령을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">티켓 가격</label>
            <input
              type="text"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="티켓 가격을 입력하세요"
              required
            />
          </div>
        </div>

        {/* 예약 시작일 및 종료일 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">예약 시작일</label>
            <input
              type="datetime-local"
              name="reservationStartDate"
              value={formData.reservationStartDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">예약 종료일</label>
            <input
              type="datetime-local"
              name="reservationEndDate"
              value={formData.reservationEndDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 공연 포스터 이미지 */}
          <div>
            <label className="block mb-2 font-bold">공연 포스터 이미지</label>
            <input
              type="file"
              accept="image/*"
              name="performancePosterImage"
              onChange={(e) => handleImageUpload(e, "performancePosterImage")}
              className="w-full p-2 border rounded"
            />
            {performancePosterPreview && (
              <div className="mt-2">
                <img
                  src={performancePosterPreview}
                  alt="공연 포스터 미리보기"
                  className="w-full h-65 object-contain rounded"
                />
              </div>
            )}
          </div>

          {/* 공연 아티스트 이미지 */}
          <div>
            <label className="block mb-2 font-bold">공연 아티스트 이미지</label>
            <input
              type="file"
              accept="image/*"
              name="performanceArtistImage"
              onChange={(e) => handleImageUpload(e, "performanceArtistImage")}
              className="w-full p-2 border rounded"
            />
            {performanceArtistPreview && (
              <div className="mt-2">
                <img
                  src={performanceArtistPreview}
                  alt="공연 아티스트 미리보기"
                  className="w-full h-65 object-contain rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* 공연 설명 */}
        <div>
          <label className="block mb-2 font-bold">공연 설명</label>
          <textarea
            name="performanceDescription"
            value={formData.performanceDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="공연 설명을 입력하세요"
            required
          ></textarea>
        </div>

        {/* 공연 공지 */}
        <div>
          <label className="block mb-2 font-bold">공연 공지</label>
          <textarea
            name="performanceNotice"
            value={formData.performanceNotice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="공연 공지를 입력하세요"
            required
          ></textarea>
        </div>

        {/* 공연 캐스팅 */}
        <div>
          <label className="block mb-2 font-bold">공연 캐스팅</label>
          <textarea
            name="performanceCast"
            value={formData.performanceCast}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="공연 캐스팅을 입력하세요"
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketModifyComponent;

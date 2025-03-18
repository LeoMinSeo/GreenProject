import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 모의 업로드 함수 (실제 환경에서는 API 호출로 대체)
async function uploadImageToServer(file) {
  // 예시: 1초 후 URL.createObjectURL(file)로 시뮬레이션 URL 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 1000);
  });
}

const TicketAddComponent = () => {
  const [formData, setFormData] = useState({
    performanceTitle: "",
    featuredArtist: "",
    performanceVenue: "",
    performanceDate: "",
    ticketDelivery: "",
    runningTime: "",
    viewingAge: "",
    ticketPrice: "",
    reservationStartDate: "",
    reservationEndDate: "",
    performancePosterImage: "",
    performanceArtistImage: "",
    performanceDescription: "",
    performanceNotice: "",
    performanceCast: "",
  });

  // 이미지 미리보기 URL 관리
  const [performancePosterPreview, setPerformancePosterPreview] = useState("");
  const [performanceArtistPreview, setPerformanceArtistPreview] = useState("");

  // 제출 중 상태 (중복 제출 방지)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 입력 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 처리: 파일을 base64로 읽는 대신 서버에 업로드 후 URL만 저장
  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // 파일을 서버에 업로드하고 URL을 받아온다고 가정 (모의 업로드)
      const uploadedImageUrl = await uploadImageToServer(file);
      setFormData((prev) => ({ ...prev, [imageType]: uploadedImageUrl }));
      if (imageType === "performancePosterImage") {
        setPerformancePosterPreview(uploadedImageUrl);
      } else if (imageType === "performanceArtistImage") {
        setPerformanceArtistPreview(uploadedImageUrl);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  // 폼 제출 처리: localStorage에 티켓 데이터를 저장 (이미지 데이터는 URL로 저장)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newTicket = {
      id: uuidv4(),
      ...formData,
    };

    try {
      const existingTickets =
        JSON.parse(localStorage.getItem("ticketList")) || [];
      const updatedTickets = [...existingTickets, newTicket];
      localStorage.setItem("ticketList", JSON.stringify(updatedTickets));
      alert("티켓이 성공적으로 등록되었습니다.");

      // 폼 초기화
      setFormData({
        performanceTitle: "",
        featuredArtist: "",
        performanceVenue: "",
        performanceDate: "",
        ticketDelivery: "",
        runningTime: "",
        viewingAge: "",
        ticketPrice: "",
        reservationStartDate: "",
        reservationEndDate: "",
        performancePosterImage: "",
        performanceArtistImage: "",
        performanceDescription: "",
        performanceNotice: "",
        performanceCast: "",
      });
      setPerformancePosterPreview("");
      setPerformanceArtistPreview("");
    } catch (error) {
      console.error("티켓 저장 실패:", error);
      alert("티켓 저장 중 오류가 발생했습니다: " + error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">티켓 등록</h1>
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
              required
            />
            {performancePosterPreview && (
              <div className="mt-2">
                <img
                  src={performancePosterPreview}
                  alt="공연 포스터 미리보기"
                  className="w-full h-55 object-contain rounded"
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
              required
            />
            {performanceArtistPreview && (
              <div className="mt-2">
                <img
                  src={performanceArtistPreview}
                  alt="공연 아티스트 미리보기"
                  className="w-full h-55 object-contain rounded"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "티켓 등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketAddComponent;

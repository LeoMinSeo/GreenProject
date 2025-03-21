import { useEffect, useState } from "react";
import { getConcertByCno, modifyConcert } from "../../../api/adminApi"; // API 호출 함수 (가정)
import { useNavigate, useParams } from "react-router-dom";

const TicketModifyComponent = () => {
  const [concertData, setConcertData] = useState(null); // 초기값을 null로 설정
  const [file, setFile] = useState(null); // 파일 상태
  const [previewImageUrl, setPreviewImageUrl] = useState(""); // 미리보기 이미지 URL 상태 추가
  const [updatedConcertData, setUpdatedConcertData] = useState({
    cno: "", // cno 추가
    cname: "",
    cprice: "",
    cdesc: "",
    cplace: "",
    category: "",
    uploadFileName: "", // 이미지 파일명 추가
    schedulesDtoList: [],
  });
  const { cno } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getConcertByCno(cno)
      .then((data) => {
        setConcertData(data);
        // 스케줄 데이터에서 scheduleId 제거하고 나머지 정보만 사용
        const schedulesWithoutId =
          data.schedulesDtoList?.map((schedule) => ({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            totalSeats: schedule.totalSeats,
            status: schedule.status,
          })) || [];

        setUpdatedConcertData({
          cno: data.cno, // cno 추가
          cname: data.cname,
          cprice: data.cprice,
          cdesc: data.cdesc,
          cplace: data.cplace,
          category: data.category || "",
          uploadFileName: data.uploadFileName || "", // 이미지 파일명 저장
          schedulesDtoList: schedulesWithoutId,
        });
        console.log(data);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, [cno]);

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // 폼 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedConcertData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const formatDate = (dateString) => {
    // '2025-03-27T20:00' -> '2025-03-27T20:00:00'
    return dateString + ":00"; // 초를 추가
  };

  // 파일 선택 처리 - 미리보기 기능 추가
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 이전 미리보기 URL이 있으면 해제
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      // 새 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewImageUrl(previewUrl);
    }
  };

  // 스케줄 입력값 변경 처리
  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSchedules = [...updatedConcertData.schedulesDtoList];
    if (name === "startTime" || name === "endTime") {
      // 날짜에 초를 추가하여 포맷을 맞추기
      updatedSchedules[index][name] = formatDate(value);
    } else {
      updatedSchedules[index][name] = value;
    }
    setUpdatedConcertData((prev) => ({
      ...prev,
      schedulesDtoList: updatedSchedules,
    }));
  };
  // 새 스케줄 추가
  const handleAddSchedule = () => {
    setUpdatedConcertData((prev) => ({
      ...prev,
      schedulesDtoList: [
        ...prev.schedulesDtoList,
        {
          startTime: "",
          endTime: "",
          totalSeats: 0,
          status: "AVAILABLE",
        },
      ],
    }));
  };

  // 스케줄 삭제 기능 추가
  const handleDeleteSchedule = (index) => {
    const updatedSchedules = [...updatedConcertData.schedulesDtoList];
    updatedSchedules.splice(index, 1); // 해당 인덱스의 스케줄 삭제

    setUpdatedConcertData((prev) => ({
      ...prev,
      schedulesDtoList: updatedSchedules,
    }));
  };

  // 데이터 전송 함수 (API 호출)
  const handleSubmit = () => {
    const formData = new FormData();

    // JSON 데이터를 BLOB으로 감싸서 FormData에 추가
    const concertDTO = new Blob([JSON.stringify(updatedConcertData)], {
      type: "application/json",
    });
    formData.append("concertDTO", concertDTO);

    // 파일이 있다면 함께 추가
    if (file) {
      formData.append("file", file);
    }

    // 여기서 FormData 확인 (디버깅용)
    for (let [key, value] of formData.entries()) {
      if (value instanceof Blob && key === "concertDTO") {
        const reader = new FileReader();
        reader.onloadend = () => {
          const jsonContent = reader.result;
          console.log(key, JSON.parse(jsonContent)); // Blob을 JSON으로 출력
        };
        reader.readAsText(value);
      } else {
        console.log(key, value);
      }
    }

    try {
      modifyConcert(formData).then((i) => {
        alert(i);
        navigate("/admin/concert/list");
      });
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 실패. 다시 시도해 주세요.");
    }
  };

  if (concertData === null) {
    return <div>Loading...</div>; // 데이터를 받아오는 중일 때
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">공연 수정</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            공연명
          </label>
          <input
            type="text"
            name="cname"
            value={updatedConcertData.cname}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            가격
          </label>
          <input
            type="text"
            name="cprice"
            value={updatedConcertData.cprice}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            name="cdesc"
            value={updatedConcertData.cdesc}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full h-40 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            공연 장소
          </label>
          <input
            type="text"
            name="cplace"
            value={updatedConcertData.cplace}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            카테고리
          </label>
          <select
            name="category"
            value={updatedConcertData.category}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">선택</option>
            <option value="뮤지컬">뮤지컬</option>
            <option value="연극">연극</option>
            <option value="클래식">클래식</option>
            <option value="콘서트">콘서트</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 파일
          </label>
          <div className="mb-4">
            {/* 미리보기 이미지가 있으면 미리보기 표시, 없으면 기존 이미지 표시 */}
            {previewImageUrl ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  새 이미지 미리보기:
                </p>
                <img
                  src={previewImageUrl}
                  alt="새 공연 이미지"
                  className="w-48 h-auto object-cover border rounded-md"
                />
              </div>
            ) : updatedConcertData.uploadFileName ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                <img
                  src={`http://localhost:8089/concert/view/s_${updatedConcertData.uploadFileName}`}
                  alt="현재 공연 이미지"
                  className="w-48 h-auto object-cover border rounded-md"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">이미지 없음</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full text-sm text-gray-700 border border-gray-300 rounded-md"
          />
        </div>

        {/* 스케줄 추가 */}
        <div>
          <h2 className="text-lg font-medium text-gray-700">스케줄</h2>
          {updatedConcertData.schedulesDtoList.map((schedule, index) => (
            <div
              key={index} /* scheduleId 대신 index를 key로 사용 */
              className="border p-4 rounded-lg mb-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium">스케줄 #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleDeleteSchedule(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  삭제
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  시작 시간
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(index, e)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  끝 시간
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(index, e)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  좌석 수
                </label>
                <input
                  type="number"
                  name="totalSeats"
                  value={schedule.totalSeats}
                  onChange={(e) => handleScheduleChange(index, e)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 상태 선택 추가 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  상태
                </label>
                <select
                  name="status"
                  value={schedule.status}
                  onChange={(e) => handleScheduleChange(index, e)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="SOLD_OUT">SOLD_OUT</option>
                </select>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSchedule}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            스케줄 추가
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketModifyComponent;

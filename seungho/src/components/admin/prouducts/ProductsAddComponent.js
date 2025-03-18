import React, { useState, useEffect } from "react";
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

const ProductsAddComponent = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    productcode: "",
    productComponents: "",
    age: "",
    barcode: "",
    date: "",
    time: "",
    runningTime: "",
    ageLimit: "",
    productPrice: "",
    soldStartDate: "",
    soldEndDate: "",
    coverImage: "",
    artistImage: "",
    description: "",
    componentsInfo: "",
    trackInfoSongDescription: "",
  });

  const [coverPreview, setCoverPreview] = useState("");
  const [artistImagePreview, setArtistImagePreview] = useState("");

  useEffect(() => {
    console.log("formData가 업데이트되었습니다:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드: FileReader 대신 서버 업로드를 통해 URL만 저장
  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedImageUrl = await uploadImageToServer(file);
      setFormData((prev) => ({ ...prev, [imageType]: uploadedImageUrl }));
      if (imageType === "coverImage") {
        setCoverPreview(uploadedImageUrl);
      } else if (imageType === "artistImage") {
        setArtistImagePreview(uploadedImageUrl);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: uuidv4(),
      ...formData,
    };

    const existingProducts =
      JSON.parse(localStorage.getItem("musicProducts")) || [];
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem("musicProducts", JSON.stringify(updatedProducts));

    console.log("저장된 데이터:", newProduct);
    alert("앨범이 성공적으로 등록되었습니다.");

    // 폼 초기화
    setFormData({
      title: "",
      artist: "",
      productcode: "",
      productComponents: "",
      age: "",
      barcode: "",
      date: "",
      time: "",
      runningTime: "",
      ageLimit: "",
      productPrice: "",
      soldStartDate: "",
      soldEndDate: "",
      coverImage: "",
      artistImage: "",
      description: "",
      componentsInfo: "",
      trackInfoSongDescription: "",
    });
    setCoverPreview("");
    setArtistImagePreview("");
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">음원 상품 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 음원 제목 및 아티스트 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">음원 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="예: Ezeihq 메인 앨범 5집 "
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">아티스트</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="예: Ezeihq"
              required
            />
          </div>
        </div>
        {/* 바코드 및 발매일 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">음원 바코드</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="예: SCM684712"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">음원 발매일</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        {/* 제품코드 및 구매가능 연령대 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">제품코드</label>
            <input
              type="text"
              name="productcode"
              value={formData.productcode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="예: KCTC4563"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">구매가능 연령대</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="예: 20세 이상"
              required
            />
          </div>
        </div>
        {/* 음원 가격 및 구성품 */}
        <div>
          <label className="block mb-2 font-bold">음원 가격</label>
          <input
            type="text"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="예: Album : 115,000원"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">음원 구성품</label>
          <input
            type="text"
            name="productComponents"
            value={formData.productComponents}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="예: Standard Album : 55,000원"
            required
          />
        </div>
        {/* 판매 시작일 및 종료일 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">음원 판매 시작일</label>
            <input
              type="datetime-local"
              name="soldStartDate"
              value={formData.soldStartDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">음원 판매 종료일</label>
            <input
              type="datetime-local"
              name="soldEndDate"
              value={formData.soldEndDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        {/* 이미지 업로드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 앨범 커버 이미지 */}
          <div>
            <label className="block mb-2 font-bold">앨범 커버 이미지</label>
            <input
              type="file"
              accept="image/*"
              name="coverImage"
              onChange={(e) => handleImageUpload(e, "coverImage")}
              className="w-full p-2 border rounded"
              required
            />
            {coverPreview && (
              <div className="mt-2">
                <img
                  src={coverPreview}
                  alt="앨범 커버 미리보기"
                  className="w-full h-48 object-contain rounded"
                />
              </div>
            )}
          </div>
          {/* 아티스트 이미지 */}
          <div>
            <label className="block mb-2 font-bold">아티스트 이미지</label>
            <input
              type="file"
              accept="image/*"
              name="artistImage"
              onChange={(e) => handleImageUpload(e, "artistImage")}
              className="w-full p-2 border rounded"
              required
            />
            {artistImagePreview && (
              <div className="mt-2">
                <img
                  src={artistImagePreview}
                  alt="아티스트 이미지 미리보기"
                  className="w-full h-48 object-contain rounded"
                />
              </div>
            )}
          </div>
        </div>
        {/* 추가 정보 */}
        <div>
          <label className="block mb-2 font-bold">앨범 설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="12"
            placeholder={`예:
[앨범명]
Ezeihq 메인 앨범 5집
//
[앨범 소개]
뒤늦은 나의 바람 그 사이로 스미는 차가운 바람
//
바람처럼 스쳐 지나간 그 시간들을
당신도 나와 같이 기억하기를 바랍니다`}
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-2 font-bold">구성 요소 정보</label>
          <textarea
            name="componentsInfo"
            value={formData.componentsInfo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="예: CD, 가사집, 한정판 포토 카드, 앨범 커버 컨셉 사진집"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-2 font-bold">
            관련 분류 / 수록곡 설명
          </label>
          <textarea
            name="trackInfoSongDescription"
            value={formData.trackInfoSongDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="20"
            placeholder={`예: 
[===관련 분류===]
CD/LP > 가요 > 힙합
//
[===수록곡 설명===]
01. 내가 더 나빠 - Title :
네가 말한대로 나 잘 버텨냈으니,
네가 말한 그 미래에 왔으니,
이제 그만 다시 돌아와 줬으면 하는 바람
//
02. 은혜킴의 송 :
두르르르 르르르
//
03. 은혜킴 :
따르 르르릉`}
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            음원 상품 등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsAddComponent;

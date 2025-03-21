import React, { useState } from "react";
import { postAdd } from "../../../api/adminApi";

const ProductsAddComponent = () => {
  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    pdesc: "",
    pstock: 0,
    category: "",
    uploadFileNames: [],
  });
  const [productImage, setProductImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const formDataToSend = new FormData();
    formDataToSend.append("pname", formData.pname);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("pdesc", formData.pdesc);
    formDataToSend.append("pstock", formData.pstock);
    formDataToSend.append("category", formData.category);
    if (productImage) {
      formDataToSend.append("files", productImage);
    }
    postAdd(formDataToSend)
      .then((i) => {
        alert(i);
        setFormData({
          pname: "",
          price: "",
          pdesc: "",
          pstock: 0,
          category: "",
          uploadFileNames: [],
        });

        setCoverPreview(""); // 미리보기 초기화
        setProductImage(null);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("상품 등록 중 오류가 발생했습니다.");
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // 사용자가 선택한 파일
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); // 미리보기 URL 저장
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          음원 상품 등록
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col items-center"
        >
          {/* 음원 제목 및 상품 가격 */}
          <div className="w-full flex flex-col space-y-4">
            <div className="flex flex-col items-start w-full">
              <label className="mb-2 text-sm font-medium text-gray-700">
                상품명
              </label>
              <input
                type="text"
                name="pname"
                value={formData.pname}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 삼성스피커"
                required
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="mb-2 text-sm font-medium text-gray-700">
                상품 가격
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: Album : 115,000원"
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="mb-2 text-sm font-medium text-gray-700">
              카테고리
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">카테고리 선택</option>
              <option value="헤드셋">헤드셋</option>
              <option value="이어폰">이어폰</option>
              <option value="스피커">스피커</option>
              <option value="앰프">앰프</option>
              <option value=" ">없음</option>
            </select>
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="mb-2 text-sm font-medium text-gray-700">
              재고
            </label>
            <input
              type="number"
              name="pstock"
              value={formData.pstock}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="재고 수량 입력"
              required
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="flex flex-col items-start w-full">
            <label className="mb-2 text-sm font-medium text-gray-700">
              상품 이미지
            </label>
            <input
              type="file"
              name="coverImage"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* 미리보기 이미지 */}
          {coverPreview && (
            <div className="mt-4 w-full flex justify-center">
              <img
                src={coverPreview}
                alt="상품 이미지 미리보기"
                className="w-48 h-48 object-contain rounded-lg"
              />
            </div>
          )}

          {/* 상품 설명 */}
          <div className="flex flex-col items-start w-full">
            <label className="mb-2 text-sm font-medium text-gray-700">
              상품 설명
            </label>
            <textarea
              name="pdesc"
              value={formData.pdesc}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="상품에 대한 설명을 입력하세요."
              required
            ></textarea>
          </div>

          {/* 제출 버튼 */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg "
            >
              음원 상품 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsAddComponent;

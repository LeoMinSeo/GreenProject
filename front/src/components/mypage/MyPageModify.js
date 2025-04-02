import React, { useState, useEffect } from "react";
import { updateProfile } from "../../api/memberApi";

const MyPageModify = ({ userData, setUserData, userId }) => {
  const [modifiedUserData, setModifiedUserData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    userAddress: "",
  });

  // userData가 변경될 때 modifiedUserData 업데이트
  useEffect(() => {
    if (userData) {
      setModifiedUserData({
        userId: userData.userId || "",
        userName: userData.userName || "",
        userEmail: userData.userEmail || "",
        userAddress: userData.userAddress || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifiedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(userId, modifiedUserData);
      setUserData(modifiedUserData);
      alert("회원정보가 수정되었습니다.");
      window.location.reload();
    } catch (error) {
      alert("수정중에 오류가 발생했습니다");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-end ml-20 min-h-[92vh] ">
      <div className="bg-white pl-32 pt-5 rounded-lg shadow-lg mt-20 w-full ">
        <h2 className="text-2xl font-bold  text-gray-800 mb-6 border-b pb-4 select-none ml-[-108px]">
          회원정보 수정
        </h2>
        <form>
          <div className="mb-6">
            <label
              htmlFor="userId"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              아이디(수정 X):
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={modifiedUserData.userId}
              className="w-3/5 p-3 mt-2 rounded-md border focus:outline-none cursor-default "
              readOnly
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="userName"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              이름:
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={modifiedUserData.userName}
              onChange={handleChange}
              className="w-3/5 p-3 mt-2 rounded-md  border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="userEmail"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              이메일:
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={modifiedUserData.userEmail}
              onChange={handleChange}
              className="w-3/5 p-3 mt-2 rounded-md  border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="userAddress"
              className="block text-sm font-semibold text-gray-700 select-none"
            >
              주소:
            </label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              value={modifiedUserData.userAddress}
              onChange={handleChange}
              className="w-3/5 p-3 mt-2 rounded-md  border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-3/5 py-3 mt-4 bg-orange-400 hover:bg-[#E87A2D] text-white font-semibold rounded-md select-none"
          >
            저장
          </button>
          {/* <button
          type="button"
          onClick={toggleModify}
          className="w-full py-3 mt-4 bg-gray-300 text-white font-semibold rounded-md hover:bg-gray-400 transition"
        >
          취소
        </button> */}
        </form>
      </div>
    </div>
  );
};

export default MyPageModify;

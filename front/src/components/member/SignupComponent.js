import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkId } from "../../api/memberApi";
import MainMenubar from "../menu/MainMenubar";
import { Link } from "react-router-dom";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
    confirmPassword: "",
    userName: "",
    userEmail: "",
    userAdress: "",
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [idChecked, setIdChecked] = useState(false); // 아이디 중복 확인 여부
  const [passwordValid, setPasswordValid] = useState(true); // 비밀번호 조건 추가
  const [passwordMatch, setPasswordMatch] = useState(true); // 비밀번호 일치 여부 확인
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 여부 상태 추가
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 표시 여부 상태 추가

  // 비밀번호 유효성 검사 정규식
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  //아이디 중복 확인
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "userId") {
      setIdChecked(false); // 아이디가 변경되면 다시 중복 확인하도록 설정
    }

    if (name === "userPw") {
      setPasswordValid(passwordRegex.test(value)); //비밀번호 유효성 검사
    }

    if (name === "confirmPassword") {
      setPasswordMatch(value === formData.userPw);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!formData.agreeAge || !formData.agreeTerms || !formData.agreePrivacy) {
      alert("필수 약관에 동의해야 합니다.");
      return;
    }

    if (!passwordValid) {
      alert(
        "비밀번호는 6글자 이상, 영어(대소문자 구분 없음), 숫자, 특수문자가 포함되어야 합니다."
      );
      return;
    }

    if (!passwordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    const { confirmPassword, ...filteredData } = formData;
    const result = await registerUser(filteredData);

    console.log("회원가입 결과:", result);

    if (result && result.success === true) {
      alert("회원가입이 완료되었습니다!");
      navigate("/member/login");
    } else {
      setError(
        result?.message || "회원가입에 실패했습니다. 다시 시도해 주세요."
      );
    }

    setIsSubmitting(false);
  };

  const handleUserIdCheck = async () => {
    if (!formData.userId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    const result = await checkId(formData.userId);

    if (result.success) {
      alert("아이디가 사용 가능합니다.");
      setIdChecked(true); // 중복 확인 성공 true로 설정
    } else {
      alert("아이디가 중복되었습니다. 다른 아이디를 사용해주세요.");
      setFormData((prevState) => ({
        ...prevState,
        userId: "", //입력값을 초기화
      }));
      setIdChecked(false); // 실패 시 false 유지
    }
  };

  // 비밀번호 표시 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 비밀번호 확인 표시 토글
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <MainMenubar />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mt-20 border border-gray-300">
        <div className="flex justify-center items-center mb-7">
          <img src="/images/mainlogo.png" alt="logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative w-full mb-2">
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              value={formData.userId}
              required
            />
            <button
              type="button"
              className="absolute right-0 top-0 bottom-2 bg-gray-400 text-white p-1 rounded-r hover:bg-gray-600 transition duration-300"
              onClick={handleUserIdCheck}
            >
              중복 확인
            </button>
          </div>

          <div className="relative w-full mb-2">
            <input
              type={showPassword ? "text" : "password"} // 비밀번호 표시 여부에 따라 타입 변경
              name="userPw"
              placeholder="비밀번호"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              value={formData.userPw}
              required
            />
            <button
              type="button"
              className="absolute right-0 top-0 bottom-2 w-20 h-10 bg-gray-400 text-white p-1 rounded-r hover:bg-gray-600 transition duration-300"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "숨기기" : "보기"}
            </button>
          </div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요"
            className="w-full p-2 border rounded mb-2"
            onChange={handleChange}
          />
          <input
            type="text"
            name="userName"
            placeholder="이름"
            className="w-full p-2 border rounded mb-2"
            onChange={handleChange}
            value={formData.userName}
            required
          />
          <input
            type="email"
            name="userEmail"
            placeholder="이메일"
            className="w-full p-2 border rounded mb-2"
            onChange={handleChange}
            value={formData.userEmail}
          />
          <input
            type="text"
            name="userAdress"
            placeholder="주소"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            value={formData.userAdress}
            required
          />

          <div className="mb-4">
            <label className="flex items-center mb-1">
              <input
                type="checkbox"
                name="agreeAge"
                checked={formData.agreeAge}
                onChange={handleChange}
                className="mr-2"
              />
              [필수] 만 14세 이상입니다
            </label>
            <label className="flex items-center mb-1">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2"
              />
              [필수] 이용약관 동의
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
                className="mr-2"
              />
              [필수] 개인정보 수집 동의
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-600 transition duration-300"
            disabled={isSubmitting}
          >
            가입하기
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <div className="mt-4 flex justify-center items-center text-gray-700">
          <span>이미 아이디가 있으신가요?</span>
          <Link
            to="/member/login"
            className="text-gray-700 font-bold ml-1 inline-block"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;

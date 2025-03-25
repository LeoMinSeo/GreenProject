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
    userEmailId: "",
    userEmailDomain: "",
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

    // 입력값을 상태에 업데이트
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };

      // 비밀번호나 확인 필드가 변경되었을 때 일치 여부 확인
      if (name === "userPw") {
        //비밀번호 조건 확인
        setPasswordValid(passwordRegex.test(value));
        // 비밀번호가 변경되었을 때, 비밀번호 확인란과 비교
        setPasswordMatch(value === prevState.confirmPassword);
      } else if (name === "confirmPassword") {
        // 비밀번호 확인란이 변경되었을 때, 비밀번호와 비교
        setPasswordMatch(value === prevState.userPw);
      }

      // 아이디가 변경되면 중복 확인 리셋
      if (name === "userId") {
        setIdChecked(false);
      }

      if (name === "userEmailId" || name === "userEmailDomain") {
        const domain = newState.userEmailDomain; // 'direct' 옵션을 제외하고 선택된 도메인만 사용
        newState.userEmail =
          domain && newState.userEmailId
            ? `${newState.userEmailId}@${domain}`
            : "";
      }

      return newState;
    });
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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <MainMenubar />
      <div className="p-8 w-1/3 mt-20">
        <div className="flex justify-center items-center mb-10">
          <img src="/images/mainlogo.png" alt="logo" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* 아이디 필드 */}
          <div className="mb-4">
            {/* <div className="text-sm text-gray-500 mb-1">아이디</div> */}
            <div className="flex items-center border-b border-gray-300 pb-1">
              <input
                type="text"
                name="userId"
                placeholder="아이디를 입력해주세요"
                className="w-full py-2 focus:outline-none focus:bg-transparent"
                autocomplete="off"
                onChange={handleChange}
                value={formData.userId}
                required
              />
              <button
                type="button"
                className="text-[#3c434b] whitespace-nowrap font-bold"
                onClick={handleUserIdCheck}
              >
                중복 확인
              </button>
            </div>
          </div>

          {/* 비밀번호 필드 */}
          <div className="mb-4">
            {/* <div className="text-sm text-gray-500 mb-1">비밀번호</div> */}
            <div className="flex items-center border-b border-gray-300 pb-1">
              <input
                type={showPassword ? "text" : "password"}
                name="userPw"
                placeholder="비밀번호를 입력해주세요"
                className="w-full py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.userPw}
                required
              />
              <button
                type="button"
                className="text-[#3c434b] whitespace-nowrap font-bold"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "숨기기" : "보기"}
              </button>
            </div>
            {!passwordValid && formData.userPw && (
              <div className="text-xs text-red-600 mt-1">
                영문, 특수문자, 숫자를 모두 포함해야 하며 6글자 이상입니다.
              </div>
            )}
          </div>

          {/* 비밀번호 확인 필드 */}
          <div className="mb-4">
            {/* <div className="text-sm text-gray-500 mb-1">비밀번호 확인</div> */}
            <div className="flex items-center border-b border-gray-300 pb-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="비밀번호를 재입력해주세요"
                className="w-full py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
              />
              <button
                type="button"
                className="text-[#3c434b] whitespace-nowrap font-bold"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "숨기기" : "보기"}
              </button>
            </div>
            {formData.confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  passwordMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordMatch
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          {/* 이름 필드 */}
          <div className="mb-4">
            {/* <div className="text-sm text-gray-500 mb-1">이름</div> */}
            <div className="border-b border-gray-300 pb-1">
              <input
                type="text"
                name="userName"
                placeholder="이름을 입력해주세요(띄어쓰기 없이 입력해주세요)"
                className="w-full py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.userName}
                autocomplete="off"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            {/* <div className="text-sm text-gray-500 mb-1">주소</div> */}
            <div className="border-b border-gray-300 pb-1">
              <input
                type="text"
                name="userAdress"
                placeholder="주소를 입력해주세요"
                className="w-full py-1 focus:outline-none"
                onChange={handleChange}
                value={formData.userAdress}
                autocomplete="off"
                required
              />
            </div>
          </div>

          {/* 이메일 필드 */}
          <div className="mb-4">
            {/* <div className="text-sm text-gray-500 mb-1">이메일</div> */}
            <div className="flex items-center border-b border-gray-300 pb-1">
              <input
                type="text"
                name="userEmailId"
                placeholder="이메일 아이디"
                className="w-2/5 py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.userEmailId}
                autocomplete="off"
                required
              />
              <span className="px-2">@</span>
              <select
                name="userEmailDomain"
                className="w-2/5 py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.userEmailDomain}
                required
              >
                <option value="">직접입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
          </div>

          {/* 약관 동의 섹션 */}
          <div className="mb-6 mt-8">
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                name="agreeAge"
                checked={formData.agreeAge}
                onChange={handleChange}
                className="mr-2 h-5 w-5 rounded-full border-gray-300"
              />
              <span className="text-sm">[필수] 만 14세 이상입니다</span>
            </label>

            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2 h-5 w-5 rounded-full border-gray-300"
              />
              <span className="text-sm">[필수] 이용약관 동의</span>
            </label>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
                className="mr-2 h-5 w-5 rounded-full border-gray-300"
              />
              <span className="text-sm">[필수] 개인정보 수집 동의</span>
            </label>
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-gray-300 text-white p-3 rounded-md hover:bg-orange-400 transition duration-300 mt-2"
            disabled={isSubmitting}
          >
            가입완료
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <div className="mt-4 flex justify-center items-center text-gray-700">
          <span className="text-sm">이미 아이디가 있으신가요?</span>
          <Link
            to="/member/login"
            className="text-gray-700 font-bold ml-1 inline-block text-sm"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;

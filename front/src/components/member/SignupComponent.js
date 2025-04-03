import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkId } from "../../api/memberApi";
import styled from "styled-components";

// 입력 필드와 아이콘을 감싸는 컨테이너
const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin: 0.5rem 0;
`;

// 사용자 입력 필드 스타일
const Input = styled.input`
  width: 100%;
  padding: 0.7rem 3rem;
  font-size: 0.9rem;
  background-color: var(--gray);
  border-radius: 0.5rem;
  border: 0.125rem solid var(--white);
  outline: none;

  &:focus {
    border: 0.1rem solid var(--primary-color);
  }
  &::placeholder {
    padding-right: 300rem; /* placeholder 텍스트가 왼쪽으로 이동 */
  }
`;

// 입력 필드 내 아이콘 스타일
const Icon = styled.i`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  font-size: 1.4rem;
  color: var(--gray-2);
`;

// 회원가입 버튼 스타일
const SignupButton = styled.button`
  cursor: pointer;
  padding: 0.5rem 2rem;
  background-color: var(--primary-color);
  font-size: 1.2rem;
  color: var(--white);
  border-radius: 0.5rem;
  border: none;
  outline: none;
  margin-top: 0rem; // 쓸 수도 있으므로 남겨두기
  width: 100%;
`;

//아이디 중복확인 버튼 스타일
const IdCheckButton = styled.button`
  cursor: pointer;
  padding: 0.7rem 0.2rem;
  background-color: var(--primary-color);
  font-size: 0.8rem;
  color: var(--white);
  border-radius: 0.5rem;
  border: none;
  outline: none;
  margin-top: 0.1rem;
  width: auto;
`;
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
    userAddress: "",
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeComercial: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [idChecked, setIdChecked] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "userPw") {
        setPasswordValid(passwordRegex.test(value));
        setPasswordMatch(value === prevState.confirmPassword);
      } else if (name === "confirmPassword") {
        setPasswordMatch(value === prevState.userPw);
      }

      if (name === "userId") {
        setIdChecked(false);
      }

      if (name === "userEmailId" || name === "userEmailDomain") {
        const domain = newState.userEmailDomain;
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

    if (result && result.success === true) {
      alert("회원가입이 완료되었습니다!");
      navigate("/member/login");
      window.location.reload(); // 페이지 새로고침 효과
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
      setIdChecked(true);
    } else {
      alert("아이디가 중복되었습니다. 다른 아이디를 사용해주세요.");
      setFormData((prevState) => ({
        ...prevState,
        userId: "",
      }));
      setIdChecked(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    setFormData((prevState) => ({
      ...prevState,
      agreeAge: isChecked,
      agreeTerms: isChecked,
      agreePrivacy: isChecked,
      agreeComercial: isChecked,
    }));
  };

  return (
    <div>
      {error && (
        <div className="text-red-500 text-sm mb-1 text-center">{error}</div>
      )}

      <InputGroup style={{ display: "flex", alignItems: "center" }}>
        <Icon className="bx bxs-user" />
        <Input
          type="text"
          name="userId"
          placeholder="아이디를 입력해주세요"
          value={formData.userId}
          onChange={handleChange}
          style={{
            paddingLeft: "1rem",
            flex: 8, // 아이디 입력 필드가 차지하는 비율을 8로 설정
          }}
        />
        <IdCheckButton
          type="button"
          onClick={handleUserIdCheck}
          style={{
            marginLeft: "1rem", // 버튼과 입력 필드 사이에 간격 추가
            flex: 2,
          }}
        >
          중복 확인
        </IdCheckButton>
      </InputGroup>

      <InputGroup>
        <Icon className="bx bxs-lock-alt" />
        <Input
          type={showPassword ? "text" : "password"}
          name="userPw"
          placeholder="비밀번호를 입력해주세요"
          value={formData.userPw}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          <img
            src={showPassword ? "/images/showPw.png" : "/images/hidePw.png"}
            alt="아이콘"
            width="24"
            height="24"
          />
        </span>
      </InputGroup>
      {!passwordValid && formData.userPw && (
        <div className="text-xs text-red-600 mb-2 text-left pl-1">
          영문, 특수문자, 숫자를 모두 포함해야 하며 6글자 이상입니다.
        </div>
      )}

      <InputGroup>
        <Icon className="bx bxs-lock-alt" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="비밀번호를 재입력해주세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={toggleConfirmPasswordVisibility}
        >
          <img
            src={
              showConfirmPassword ? "/images/showPw.png" : "/images/hidePw.png"
            }
            alt="아이콘"
            width="24"
            height="24"
          />
        </span>
      </InputGroup>
      {formData.confirmPassword && (
        <div
          className={`text-xs mb-2  text-left pl-1 ${
            passwordMatch ? "text-green-600" : "text-red-600"
          }`}
        >
          {passwordMatch
            ? "비밀번호가 일치합니다."
            : "비밀번호가 일치하지 않습니다."}
        </div>
      )}

      <InputGroup>
        <Icon className="bx bxs-user" />
        <Input
          type="text"
          name="userName"
          placeholder="이름을 입력해주세요"
          value={formData.userName}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>

      <InputGroup>
        <Icon className="bx bxs-map" />
        <Input
          type="text"
          name="userAddress"
          placeholder="주소를 입력해주세요"
          value={formData.userAddress}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>

      <InputGroup>
        <Icon className="bx bxs-envelope" />
        <div className="flex w-full">
          <Input
            type="text"
            name="userEmailId"
            placeholder="이메일 아이디"
            value={formData.userEmailId}
            onChange={handleChange}
            style={{
              paddingLeft: "1rem",
              width: "60%",
              marginRight: "10px",
            }}
          />
          <select
            name="userEmailDomain"
            value={formData.userEmailDomain}
            onChange={handleChange}
            className="w-2/5 border rounded-md p-3 bg-gray-100"
          >
            <option value="">직접입력</option>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
          </select>
        </div>
      </InputGroup>
      <div className="my-3">
        {/* 전체 동의 */}
        <label className="flex items-center mb-2 ml-1">
          <input
            type="checkbox"
            name="agreeAll"
            checked={
              formData.agreeAge &&
              formData.agreeTerms &&
              formData.agreePrivacy &&
              formData.agreeComercial
            }
            onChange={handleCheckAll}
            className="mr-2"
          />
          <span className="text-sm">전체 동의</span>
        </label>

        {/* 두 번째 줄: 필수 항목 */}
        <div className="flex flex-wrap ml-1">
          <label className="flex items-center w-full sm:w-1/2 mb-1">
            <input
              type="checkbox"
              name="agreeAge"
              checked={formData.agreeAge}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">[필수] 만 14세 이상입니다</span>
          </label>

          <label className="flex items-center w-full sm:w-1/2 mb-1">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">[필수] 이용약관 동의</span>
          </label>
        </div>

        {/* 세 번째 줄: 필수 + 선택 항목 */}
        <div className="flex flex-wrap ml-1">
          <label className="flex items-center w-full sm:w-1/2 mb-1">
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">[필수] 개인정보 수집 동의</span>
          </label>

          <label className="flex items-center w-full sm:w-1/2 mb-1">
            <input
              type="checkbox"
              name="agreeComercial"
              checked={formData.agreeComercial}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">[선택] 광고성 정보 수신 동의</span>
          </label>
        </div>
      </div>

      <SignupButton
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        가입완료
      </SignupButton>
    </div>
  );
};

export default SignUpComponent;

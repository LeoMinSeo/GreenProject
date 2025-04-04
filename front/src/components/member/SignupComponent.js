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

// 오류 메시지 스타일
const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
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
    userPhoneNum: "",
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
  const [customDomainInput, setCustomDomainInput] = useState(false);

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  // 휴대폰 번호 관련 상태 추가
  const [formattedPhone, setFormattedPhone] = useState("010");
  const [phoneError, setPhoneError] = useState("");

  // 휴대폰 번호 포맷팅 함수
  const formatPhoneNumber = (value) => {
    if (!value) return "";

    const numbers = value.replace(/[^\d]/g, "");

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  // 휴대폰 번호 유효성 검사
  const validatePhoneNumber = (number) => {
    if (!number) {
      return { isValid: true, message: "" }; // 빈 값은 일단 유효하게 처리
    }

    const validLength = number.length >= 11 && number.length <= 11;

    if (!validLength) {
      return { isValid: false, message: "휴대폰 번호는 11자리여야 합니다" };
    } else {
      return { isValid: true, message: "" };
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 휴대폰 번호 처리 로직
    if (name === "userPhoneNum") {
      let numbersOnly = value.replace(/[^\d]/g, "").slice(0, 11); // 숫자만 남기기

      // 사용자가 010을 지우지 못하게 보장
      if (!numbersOnly.startsWith("010")) {
        numbersOnly = "010";
      }

      const formatted = formatPhoneNumber(numbersOnly);
      const validation = validatePhoneNumber(numbersOnly);

      setFormattedPhone(formatted);

      setPhoneError(validation.message);

      setFormData((prevState) => ({
        ...prevState,
        userPhoneNum: formatted,
      }));

      return; // 휴대폰 번호는 별도 처리하므로 여기서 리턴
    }

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

      // 이메일 조합 로직 수정
      if (name === "userEmailDomain") {
        newState.userEmail = prevState.userEmailId
          ? `${prevState.userEmailId}@${value}`
          : "";
      } else if (name === "userEmailId") {
        newState.userEmail = prevState.userEmailDomain
          ? `${value}@${prevState.userEmailDomain}`
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

    // 휴대폰 번호 유효성 검사 추가
    if (!formData.userPhoneNum) {
      alert("올바른 형식의 휴대폰 번호를 입력해주세요.");
      return;
    }

    console.log(formData.userPhoneNum);
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

  // 컴포넌트 마운트 시 초기값이 있으면 포맷팅 적용
  React.useEffect(() => {
    if (formData.userPhoneNum) {
      setFormattedPhone(formatPhoneNumber(formData.userPhoneNum));
    }
  }, []);

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
        <div className="text-xs text-red-600 mb-2 text-start pl-1">
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
          className={`text-xs mb-2  text-start pl-1 ${
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
        <div className="flex w-full items-center">
          {/* 이메일 아이디 입력 */}
          <Input
            type="text"
            name="userEmailId"
            placeholder="이메일 아이디"
            value={formData.userEmailId}
            onChange={handleChange}
            style={{
              paddingLeft: "1rem",
              width: "35%",
              marginRight: "0",
            }}
          />
          <span>@</span>

          {/* 도메인 입력 필드 */}
          {customDomainInput ? (
            <Input
              type="text"
              name="userEmailDomain"
              placeholder="도메인 입력" // 직접 입력할 때 placeholder 적용
              value={formData.userEmailDomain}
              onChange={(e) =>
                handleChange({
                  target: { name: "userEmailDomain", value: e.target.value },
                })
              }
              style={{
                paddingLeft: "1rem",
                width: "35%",
              }}
            />
          ) : (
            <Input
              type="text"
              name="userEmailDomain"
              placeholder="도메인 선택"
              value={formData.userEmailDomain}
              readOnly
              style={{
                paddingLeft: "1rem",
                width: "35%",
              }}
            />
          )}

          <div className="ml-2" style={{ width: "30%" }}>
            <select
              name="userEmailDomain"
              value={customDomainInput ? "custom" : formData.userEmailDomain} // "직접 입력" 선택 시 값 비우기
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setCustomDomainInput(true);
                  handleChange({
                    target: { name: "userEmailDomain", value: "" },
                  }); // 값 초기화
                } else {
                  setCustomDomainInput(false);
                  handleChange(e);
                }
              }}
              className="w-full border rounded-md p-2.5 bg-gray-100"
            >
              <option value="">선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
        </div>
      </InputGroup>

      {/* 이메일 전체 필드 */}
      <Input
        type="email"
        name="userEmail"
        value={formData.userEmail}
        readOnly
        style={{ display: "none" }} // 실제 폼 제출 시 필요
      />

      {/* 휴대폰 번호 입력 필드 */}
      <InputGroup>
        <Icon className="bx bxs-phone" />
        <Input
          type="text"
          name="userPhoneNum"
          value={formattedPhone}
          onChange={handleChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>
      <div className="text-start">
        {formData.userPhoneNum && <ErrorMessage>{phoneError}</ErrorMessage>}
      </div>

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

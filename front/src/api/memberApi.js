import axios from "axios";

const host = `http://localhost:8089/api/member`;

// 공통 헤더 설정
const getHeaders = () => {
  return { headers: { "Content-Type": "application/json" } };
};

// 회원가입
export const registerUser = async (formData) => {
  const response = await axios.post(`${host}/register`, formData, getHeaders());
  console.log("회원가입 성공:", response.data);
  return response.data;
};

// 아이디 중복 확인
export const checkId = async (userId) => {
  const response = await axios.post(
    `${host}/checkUserId`,
    { userId },
    getHeaders()
  );
  console.log("아이디 중복 확인 성공: ", response.data);
  return response.data;
};

// 로그인
export const loginPost = async (loginParam) => {
  console.log("loginParam: ", loginParam);
  const res = await axios.post(
    `${host}/login`,
    {
      userId: loginParam.userId,
      userPw: loginParam.userPw,
    },
    getHeaders()
  );
  console.log("controller를 통과한 데이터:", res);
  return res.data;
};

// 마이페이지 사용자 정보 가져오기
export const getProfile = async (userId) => {
  const res = await axios.get(`${host}/getprofile/${userId}`, getHeaders());
  return res.data;
};

//마이페이지 사용자 정보 수정하기
export const updateProfile = async (userId, formData) => {
  const res = await axios.put(
    `${host}/updateprofile/${userId}`,
    formData,
    getHeaders()
  );
  return res.data;
};

//아이디 찾기
export const findID = async (userName, userEmail) => {
  const res = await axios.post(
    `${host}/findId`,
    { userName, userEmail },
    getHeaders()
  );
  return res.data;
};

//비밀번호 찾기
export const findPw = async (userName, userId) => {
  const res = await axios.post(
    `${host}/findPw`,
    { userName, userId },
    getHeaders()
  );
  console.log("비밀번호 찾기 성공", res.data);
  return res.data;
};

//주문 내역 불러오기
export const productOrders = async (id) => {
  const res = await axios.get(`${host}/orders/${id}`, getHeaders());
  console.log("주문 내역 불러오기 성공:", res.data);
  return res.data; // 주문 내역 데이터를 반환
};

// 리뷰 불러오기
export const productReview = async (id) => {
  const res = await axios.get(`${host}/review/${id}`, getHeaders());
  console.log("리뷰 불러오기 성공: ", res.data);
  return res.data; //리뷰 데이터 반환
};

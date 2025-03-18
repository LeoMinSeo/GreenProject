import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/todoApi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;
  const header = { headers: { Authorization: `Bearer ${accessToken}` } };
  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header
  );
  console.log("======================");
  console.log(res.data);

  return res.data;
};

const beforeReg = (config) => {
  console.log("befor request ........");
  const memberInfo = getCookie("member");
  if (!memberInfo) {
    console.log("Member Not Found");
    return Promise.reject({
      response: {
        data: {
          error: "REQUIRE_LOGIN",
        },
      },
    });
  }
  const { accessToken } = memberInfo;

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

const requestFail = (err) => {
  console.log("requestFail.....");
  return Promise.reject(err);
};
const beforeRes = async (res) => {
  console.log("befor return response....");
  console.log(res);
  const data = res.data;

  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberCookieValue = getCookie("member");
    const result = await refreshJWT(
      memberCookieValue.accessToken,
      memberCookieValue.refreshToken
    );
    console.log("refreshJWT RESULT", result);

    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;

    setCookie("member", JSON.stringify(memberCookieValue), 1);

    const originalRequest = res.config;
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

    return await axios(originalRequest);
  }

  return res;
};

const responseFail = (err) => {
  console.log("respons fail error.....");
  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReg, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;

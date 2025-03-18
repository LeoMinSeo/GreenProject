import axios from "axios";

const host = "http://localhost:8089/product";

export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

export const getOne = async (pno) => {
  console.log(pno);
  const res = await axios.get(`${host}/read/${pno.pno}`);
  return res.data;
};

export const getReview = async (pno) => {
  const res = await axios.get(`${host}/getreview/${pno}`);
  return res.data;
};
export const postAdd = async (product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await jwtAxios.post(`${host}/`, product, header);
  return res.data;
};

export const putProduct = async (pno, product) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.put(`${host}/${pno}`, product, header);
  return res.data;
};
export const deleteProduct = async (pno) => {
  const res = await jwtAxios.delete(`${host}/${pno}`);
  return res.data;
};

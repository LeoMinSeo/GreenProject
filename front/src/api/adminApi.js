import axios from "axios";

const host = "http://localhost:8089/admin";

export const postAdd = async (productData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.post(`${host}/add/product`, productData, header);
  return res.data;
};

export const getProductList = async () => {
  const res = await axios.get(`${host}/product/list`);
  return res.data;
};

export const getProductByPno = async (pno) => {
  const res = await axios.get(`${host}/product/read/${pno}`);
  return res.data;
};

export const modifyProduct = async (productData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.put(`${host}/modify/product`, productData, header);
  return res.data;
};

export const deleteProduct = async (pno) => {
  const res = await axios.delete(`${host}/remove/product/${pno}`);
  return res.data;
};

export const getConcertList = async () => {
  const res = await axios.get(`${host}/concert/list`);
  return res.data;
};

export const getConcertByCno = async (cno) => {
  const res = await axios.get(`${host}/concert/read/${cno}`);
  return res.data;
};

export const modifyConcert = async (concertData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.put(`${host}/modify/concert`, concertData, header);
  return res.data;
};

export const deleteConcert = async (cno) => {
  const res = await axios.delete(`${host}/remove/concert/${cno}`);
  return res.data;
};

export const getProductOrderList = async () => {
  const res = await axios.get(`${host}/product/order/list`);
  return res.data;
};

export const getProductOrderDetail = async (ono) => {
  const res = await axios.get(`${host}/product/order/detail/${ono}`);
  return res.data;
};

export const modifyProductOrder = async (orderData) => {
  const res = await axios.put(`${host}/product/order/modify`, orderData);
  return res.data;
};

export const getConcertTicketList = async () => {
  const res = await axios.get(`${host}/concert/ticket/list`);
  return res.data;
};

export const getConcertDetail = async (ticketNo) => {
  const res = await axios.get(`${host}/concert/ticket/detail/${ticketNo}`);
  return res.data;
};

export const modifyConcertTicket = async (ticketData) => {
  const res = await axios.put(`${host}/concert/ticket/modify`, ticketData);
  return res.data;
};

export const getSalesData = async (year) => {
  const res = await axios.get(`${host}/statistics/${year}`);
  return res.data;
};

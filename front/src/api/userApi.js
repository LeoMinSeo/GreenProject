import axios from "axios";
import { data } from "react-router-dom";

const host = "http://localhost:8089/user";

export const addCart = async (data) => {
  console.log(data.get("userId"));
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.post(`${host}/addcart`, data, header);
  return res.data;
};

export const getCartlist = async (userId) => {
  console.log(userId);
  const res = await axios.get(`${host}/cartlist/${userId}`);
  return res.data;
};

export const addOrder = async (data) => {
  console.log(data);
  const res = await axios.post(`${host}/purchase`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

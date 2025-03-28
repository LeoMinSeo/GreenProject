import axios from "axios";

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

export const addOrder = async (uid, data) => {
  console.log(data);
  const res = await axios.post(`${host}/purchase/${uid}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const deleteFromCart = async (cartNo) => {
  console.log(cartNo + "열로오고임");
  await axios.delete(`${host}/delete/cart/${cartNo}`);
};

export const addConcertOrder = async (uid) => {
  const res = await axios.post(`${host}/reservation/${uid}`);
  return res.data;
};

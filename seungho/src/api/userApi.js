import axios from "axios";

const host = "http://localhost:8089/user";

export const addCart = async (data) => {
  console.log(data.get("userId"));
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.post(`${host}/addcart`, data, header);
  return res.data;
};

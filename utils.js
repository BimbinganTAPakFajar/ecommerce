import axios from "axios";

export const fetchData = async (url) => {
  const res = await axios.get(url);
  const data = await res.data;
  console.log(data);
  return data;
};

export const generateImageUrl = (url) => {
  return `http://127.0.0.1:1337${url}`;
};

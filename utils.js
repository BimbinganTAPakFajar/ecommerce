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

export const formatPrice = (price) => {
  return Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

export function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
export function diffDay(date1, date2) {
  const diff = date1.getTime() - date2.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
}
export function applyDiscount(price, harvestDate, category) {
  const today = new Date();
  const harvested = new Date(harvestDate);
  const diff = today.getTime() - harvested.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  let discount = 0;
  if (category === "Buah") {
    if (diffDays > 2) {
      discount = 0.2;
    } else if (diffDays > 4) {
      discount = 0.3;
    }
  } else if (category === "Sayur") {
    if (diffDays > 1) {
      discount = 0.1;
    } else if (diffDays > 3) {
      discount = 0.2;
    }
  } else if (category === "Biji") {
    return 0;
  } else if (category === "Ternak") {
    if (diffDays > 1) {
      discount = 0.1;
    } else if (diffDays > 3) {
      discount = 0.2;
    }
  } else if (category === "Umbi") {
    if (diffDays > 7) {
      discount = 0.1;
    } else if (diffDays > 14) {
      discount = 0.3;
    }
  }
  return price - price * discount;
}

export function averageReview(reviews) {
  let total = 0;
  reviews.forEach((review) => {
    total += review.attributes.rating;
  });
  return total / reviews.length;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

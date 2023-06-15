import axios from "axios";

export default async function handler(req, res) {
  const data = {
    waybill: req.body.waybill,
    courier: req.body.courier,
  };
  console.log(data, "WAYBILL DATA");
  const params = new URLSearchParams(data);
  const config = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  try {
    const waybillres = await axios.post(
      "https://pro.rajaongkir.com/api/waybill",
      params,
      config
    );
    if (req.method === "POST") {
      res.status(200).json(waybillres.data);
    }
  } catch (err) {
    const { code, description } = err.response.data.rajaongkir.status;
    res.status(code).send({ error: description });
  }
}

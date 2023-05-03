import axios from "axios";

export default async function handler(req, res) {
  const config = {
    headers: {
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  const data = req.body;
  try {
    const costres = await axios.post(
      "https://pro.rajaongkir.com/api/cost",
      data,
      config
    );
    if (req.method === "POST") {
      res.status(200).json(costres.data);
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

import axios from "axios";

export default async function handler(req, res) {
  const config = {
    headers: {
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  const { province } = req.query;
  try {
    const cityres = await axios.get(
      `https://pro.rajaongkir.com/api/city?province=${province}`,
      config
    );
    if (req.method === "GET") {
      res.status(200).json(cityres.data);
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

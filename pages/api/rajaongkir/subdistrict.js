import axios from "axios";
export default async function handler(req, res) {
  const config = {
    headers: {
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  const { city } = req.query;
  try {
    if (req.method === "GET") {
      const subdistrictres = await axios.get(
        `https://pro.rajaongkir.com/api/subdistrict?city=${city}`,
        config
      );
      res.status(200).json(subdistrictres.data);
    }
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" });
  }
}

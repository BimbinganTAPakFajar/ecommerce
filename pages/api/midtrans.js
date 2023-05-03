import axios from "axios";

export default async function handler(req, res) {
  const data = req.body;
  console.log(data, "MIDTRANS DATA IN API ROUTE");
  try {
    const midtransres = await axios(
      `https://app.sandbox.midtrans.com/snap/v1/transactions`,
      {
        method: "POST",
        data: data,
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY
          ).toString("base64")}`,
        },
      }
    );
    if (req.method === "POST") {
      console.log("yes");
      res.status(200).json(midtransres.data);
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

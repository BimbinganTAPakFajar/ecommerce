import axios from "axios";

export default async function handler(req, res) {
  const midtransClient = require("midtrans-client");
  // Create Snap API instance
  let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: true,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
  });
  let snapToken;
  const data = req.body;
  console.log(data, "MIDTRANS DATA IN API ROUTE");
  try {
    // const midtransres = await axios(`https://app.midtrans.com/snap/snap.js`, {
    //   method: "POST",
    //   data: data,
    //   headers: {
    //     Authorization: `Basic ${Buffer.from(
    //       process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY
    //     ).toString("base64")}`,
    //   },
    // });
    await snap.createTransaction(data).then((transaction) => {
      // transaction token
      snapToken = transaction.token;
      console.log("transactionToken:", snapToken);
    });
    if (req.method === "POST") {
      console.log("yes");
      // res.status(200).json(midtransres.data);
      res.status(200).json({ snapToken });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

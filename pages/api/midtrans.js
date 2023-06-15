export default async function handler(req, res) {
  const midtransClient = require("midtrans-client");
  // Create Snap API instance
  const isProd = process.env.NODE_ENV === "production";
  let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: isProd,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
  });
  let snapToken;
  const data = req.body;
  console.log(data, "MIDTRANS DATA IN API ROUTE");
  try {
    await snap.createTransaction(data).then((transaction) => {
      // transaction token
      snapToken = transaction.token;
      console.log("transactionToken:", snapToken);
    });
    if (req.method === "POST") {
      console.log("yes");
      res.status(200).json({ snapToken });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

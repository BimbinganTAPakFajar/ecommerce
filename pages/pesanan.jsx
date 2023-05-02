import { getSession } from "next-auth/react";
import axios from "axios";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userID = session.user.user.id;
  const strapiJWT = session.user.jwt;
  const config = {
    headers: {
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  const packagingres = await axios.get(
    // `${process.env.NEXT_PUBLIC_STRAPI_URL_DEV}packagings`

    `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings`
  );
  const packagings = packagingres.data.data;
  const provinces = provinceres.data.rajaongkir.results;
  return {
    props: { provinces, packagings, userID, strapiJWT },
  };
}

export default function Pesanan() {
  return <div>Orders</div>;
}

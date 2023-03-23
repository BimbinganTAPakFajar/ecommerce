import axios from "axios";
import Image from "next/image";

export async function getServerSideProps(context) {
  const { id } = context.query;
  const [productres] = await Promise.all([
    axios.get(`${process.env.STRAPI_URL}product-details/${id}?populate=*`),
  ]);
  const product = productres.data.data;

  return {
    props: { product },
  };
}

export default function Product({ product }) {
  console.log(product);
  const {
    attributes: {
      image: {
        data: [
          {
            attributes: { url },
          },
        ],
      },
    },
  } = product;
  return (
    <div>
      <Image width={50} height={50} src={url} alt="" />
    </div>
  );
}

import axios from "axios";
import Image from "next/image";

export async function getServerSideProps(context) {
  const { id } = context.query;
  const data = await axios.get(`http://localhost:8080/products/${id}`);
  const product = data.data;
  return {
    props: { product },
  };
}

export default function Product({ product }) {
  return (
    <div>
      <Image src={product.image} alt="" />
    </div>
  );
}

import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import axios from "axios";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details?populate=*`
  );

  const products = await res.data.data;
  return {
    props: {
      products,
    },
  };
}
const Product = ({ products }) => {
  const [search, setSearch] = useState("");

  const filteredProducts = search
    ? products.filter(
        ({
          id,
          attributes: {
            name,
            image: {
              data: [
                {
                  attributes: { url },
                },
              ],
            },
            sold,
          },
        }) => {
          return name.toLowerCase().includes(search.toLowerCase());
        }
      )
    : products;

  const renderProducts = () => {
    return filteredProducts.map(
      ({
        id,
        attributes: {
          name,
          image: {
            data: [
              {
                attributes: { url },
              },
            ],
          },
          sold,
          slug,
        },
      }) => {
        return (
          <ProductCard
            id={id}
            key={name}
            src={url}
            name={name}
            amount={sold}
            slug={slug}
          ></ProductCard>
        );
      }
    );
  };
  return (
    <div className="w-full">
      <Header color={"black"}>Produk Kami</Header>
      <input
        onChange={(e) =>
          setTimeout(() => {
            setSearch(e.target.value);
            console.log(search);
          }, 500)
        }
        className="border-2 rounded-md p-1"
        placeholder="Temukan produk kami..."
        type="text"
      />
      <div className="w-full flex flex-wrap gap-4 pt-5">{renderProducts()}</div>
    </div>
  );
};

export default Product;

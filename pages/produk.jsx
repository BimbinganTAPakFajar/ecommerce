import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import axios from "axios";
import { useState } from "react";
import ProductCard from "@/components/produk/ProductCard";
import DefaultLayout from "@/components/layouts/DefaultLayout";

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
    <div className="w-full -mt-10">
      <Header color={"black"}>Produk Kami</Header>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          onChange={(e) =>
            setTimeout(() => {
              setSearch(e.target.value);
            }, 500)
          }
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-big focus:border-big"
          placeholder="Temukan produk kami"
        />
      </div>

      <div className="w-full flex flex-wrap gap-4 pt-5">{renderProducts()}</div>
    </div>
  );
};

export default Product;

Product.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

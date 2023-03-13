import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import axios from "axios";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
export async function getStaticProps() {
  const res = await axios.get("http://localhost:8080/products");
  const products = await res.data;
  return {
    props: {
      products,
    },
  };
}
const Product = ({ products }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = search
    ? products.filter((p) => {
        return p.name.toLowerCase().includes(search.toLowerCase());
      })
    : products;

  const renderProducts = () => {
    return filteredProducts.map((p) => {
      return (
        <ProductCard src={p.image} name={p.name} amount={p.sold}></ProductCard>
      );
    });
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
        className="border-2"
        placeholder="Temukan produk kami..."
        type="text"
      />
      {renderProducts()}
    </div>
  );
};

export default Product;

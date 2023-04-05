import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const fetchData = async () => {
    const blogres = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}blogs?pagination[page]=1&pagination[pageSize]=5`
    );

    const productres = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details?pagination[page]=1&pagination[pageSize]=5&sort=sold:desc`
    );
    setBlogs(blogres.data.data);
    setProducts(productres.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderBlogs = () => {
    return blogs.map(({ id, attributes: { title, author } }) => {
      return (
        <Link
          key={id}
          className="rounded-md hover:bg-[#DEDCD4] w-full px-4 py-2"
          href={`/blog/${id}`}
        >
          <div className="font-medium text-black text-base">{title}</div>
          <div className="text-sm">Oleh {author}</div>
        </Link>
      );
    });
  };

  const renderProducts = () => {
    return products.map(({ id, attributes: { name, sold } }) => {
      return (
        <Link
          key={id}
          className="rounded-md hover:bg-[#DEDCD4] w-full px-4 py-2"
          href={`/produk/${id}`}
        >
          <div className="font-medium text-black text-base">{name}</div>
          <div className="text-sm">Terjual {sold}</div>
        </Link>
      );
    });
  };
  return (
    <div className="w-full flex">
      <div className="w-[50%] flex flex-col items-start gap-y-3 p-2 ">
        <h2 className="w-full text-start border-b-[1px] p-1">Blog</h2>
        {renderBlogs()}
      </div>
      <div className="flex w-[25%] flex-col  items-start gap-y-3 p-2 border-l-[1px]">
        <h2 className="w-full text-start border-b-[1px] p-1">Produk Populer</h2>
        {renderProducts()}
      </div>
      <div className="flex w-[25%] flex-col items-start p-2 border-b-[1px] border-l-[1px]">
        <h2 className="w-full text-start border-b-[1px] p-1">Media Sosial</h2>
        <Link
          href={`/produk`}
          className="rounded-md hover:bg-[#DEDCD4] w-full px-4 py-2"
        >
          Twitter
        </Link>
        <Link
          href={`/produk`}
          className="rounded-md hover:bg-[#DEDCD4] w-full px-4 py-2"
        >
          Instagram
        </Link>
        <Link
          href={`/produk`}
          className="rounded-md hover:bg-[#DEDCD4] w-full px-4 py-2"
        >
          Facebook
        </Link>
      </div>
    </div>
  );
};

export default Footer;

import Header from "@/components/Header";
import axios from "axios";
import Image from "next/image";
import ItemCard from "@/components/produk/ItemCard";
import { useRef, useState } from "react";
import AddToCart from "@/components/produk/AddToCart";
import { applyDiscount, averageReview } from "@/utils";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import { useEffect } from "react";
export async function getServerSideProps(context) {
  const { id } = context.query;
  const [productres, itemres, backgroundres, revres] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details/${id}?populate=*`
    ),
    axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}products?populate=*&sort=harvested:desc&filters\[product_detail\][id][$eq]=${id}`
    ),
    axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}product-backgrounds/${id}?populate=*`
    ),
    axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}reviews?populate=*&filters\[product_detail\][id][$eq]=${id}`
    ),
  ]);
  const items = itemres.data.data;
  const product = productres.data.data;
  const background = backgroundres.data.data;
  const rev = revres.data.data;
  console.log(rev);
  // console.log(background.attributes.images.data, "background");
  return {
    props: { product, background, items, rev },
  };
}

export default function Product({ product, background, items, rev }) {
  const [isSelected, setIsSelected] = useState(false);
  const [currentTab, setCurrentTab] = useState("description");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  console.log("IS IT OPEN", isPopUpOpen);
  const togglePopUp = () => {
    setIsPopUpOpen(!isPopUpOpen);
  };

  const toggleTab = (tab) => {
    setCurrentTab(tab);
  };

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    name: "",
    finalPrice: 0,
    src: "",
    stock: 0,
    harvested: "",
  });
  const {
    attributes: {
      name,

      image: {
        data: [
          {
            attributes: { url },
          },
        ],
      },
      reviews,
      category,
      price,
      sold,
    },
  } = product;

  useEffect(() => {
    const {
      id,
      attributes: { stock, harvested },
    } = items[0];
    handleSelect(id, name, url, stock, harvested);
  }, []);
  const avgReview = averageReview(reviews.data);
  const reviewAmount = reviews.data.length;
  console.log(typeof price, "PRICE TYPE");
  const handleSelect = (id, name, src, stock, harvested) => {
    const finalPrice = applyDiscount(price, harvested, category);
    console.log(stock, "stock");
    setSelectedItem({
      id,
      name,
      src,
      finalPrice,
      stock,
      harvested,
    });
  };
  const renderProducts = () => {
    return items.map(({ id, attributes: { harvested, stock } }) => {
      return (
        <ItemCard
          onClick={() => {
            handleSelect(id, name, url, stock, harvested);
          }}
          selected={selectedItem.id === id}
          harvested={harvested}
        />
      );
    });
  };
  const {
    attributes: {
      descriptions,
      video: {
        data: [
          {
            attributes: { url: videourl },
          },
        ],
      },
      images: { data },
    },
  } = background;
  const renderBackground = () => {
    const article = (
      <article className="prose pr text-justify pt-5 flex flex-col items-center max-w-none">
        <h2 className="text-2xl self-baseline text-black font-semibold">
          Video Produk
        </h2>
        <iframe
          src={videourl}
          height={400}
          className="w-full"
          frameborder="0"
        ></iframe>
        {descriptions.map((desc, index) => {
          return (
            <div className="flex flex-col items-center w-full">
              <h2 className="text-2xl self-baseline text-black font-semibold">
                {desc.subheader}
              </h2>

              <Image
                width={400}
                height={200}
                className="object-contain rounded-md pt-7"
                src={data[index].attributes.url}
                alt=""
              />
              {desc.description}
            </div>
          );
        })}
      </article>
    );

    return article;
  };
  const renderReviews = () => {
    return rev.map(
      ({
        attributes: {
          rating,
          description,
          product_detail,
          users_permissions_user,
        },
      }) => {
        return (
          <ReviewCard
            description={description}
            rating={rating}
            product_detail={product_detail}
            users_permissions_user={users_permissions_user}
          />
        );
      }
    );
  };
  return (
    <div className="flex flex-col gap-y-20 w-full">
      <div
        className={`${
          isPopUpOpen ? "z-10 opacity-100" : "-z-10 opacity-0"
        } fixed top-20 left-1/2 -translate-x-1/2 w-[300px] h-[70px] bg-big shadow-lg rounded-md text-white  flex items-center justify-center gap-x-5 duration-300 ease-in-out`}
      >
        <span> Barang berhasil ditambahkan!</span>

        <button onClick={togglePopUp}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2  gap-x-10 w-full">
        <div className="flex flex-col w-full ">
          <div className="flex flex-col gap-y-3 ">
            <div className="aspect-square w-[500px] mx-auto my-auto rounded-md overflow-hidden">
              <Image width={500} height={500} src={url} alt="" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h1 className="text-semibold text-4xl text-black pb-4">{name}</h1>
          <div className="flex items-center gap-x-5 pb-4">
            <div>
              <StarRating number={avgReview} />
            </div>
            <div className=" border-l-[2px] border-r-[2px] px-5">
              {reviewAmount} Reviews
            </div>
            <div>{sold} Sold</div>
          </div>
          <h2 className="text-md font-semibold pb-2">Pilih umur produk</h2>
          <div className="flex flex-wrap h-fit gap-3 pb-2">
            {renderProducts()}
          </div>

          <AddToCart
            togglePopUp={togglePopUp}
            src={selectedItem.src}
            id={selectedItem.id}
            finalPrice={selectedItem.finalPrice}
            price={price}
            stock={selectedItem.stock}
            harvested={selectedItem.harvested}
            name={selectedItem.name}
            isSelected={isSelected}
          />
        </div>
      </div>
      <div className="flex flex-col w-full relative">
        <div className="grid grid-cols-2 w-full sticky top-0 z-0 bg-main border-b-[1px] border-[#DEDCD4] ">
          <button
            onClick={() => toggleTab("description")}
            className={`w-full py-3 text-xl border-r-[1px] ${
              currentTab === "description"
                ? "duration-300 ease-in-out text-big"
                : "text-black duration-300 ease-in-out hover:text-big"
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            onClick={() => toggleTab("review")}
            className={`w-full py-3 text-xl ${
              currentTab === "review"
                ? "duration-300 ease-in-out text-big"
                : "text-black duration-300 ease-in-out hover:text-big"
            }`}
          >
            Ulasan ({reviewAmount})
          </button>{" "}
        </div>
        <div className="flex flex-col items-center gap-y-4 pt-5">
          {currentTab === "description" ? renderBackground() : renderReviews()}
        </div>

        {/* <div className="w-fit h-full flex flex-col justify-center"></div> */}
      </div>
    </div>
  );
}

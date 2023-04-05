import Header from "@/components/Header";
import ProductCard from "@/components/produk/ProductCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ReviewCard from "@/components/ReviewCard";
import Image from "next/image";
import { sliceIntoChunks } from "@/utils";
export async function getServerSideProps(context) {
  const [productsres, landingres, reviewres] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details?populate=*`
    ),
    axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}landing-page?populate=*`),
    axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}reviews?pagination[page]=1&pagination[pageSize]=21&populate=*`
    ),
  ]);
  const products = productsres.data.data;
  const landing = landingres.data.data;
  const reviews = reviewres.data.data;
  // const reviews = reviewsres.data;

  return {
    props: { products, landing, reviews },
  };
}

export default function Home({ products, landing, reviews }) {
  const { data: session, status } = useSession();
  const {
    attributes: {
      description,
      slogan,
      image: {
        data: [
          {
            attributes: { url: landingurl },
          },
        ],
      },
      whyus,
    },
  } = landing;
  console.log(whyus, "whyus");
  const router = useRouter();
  const renderProducts = () => {
    return products.map(
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

  const generateWhyUs = () => {
    return whyus.map(({ title, description }) => {
      return (
        <div key={title} className="flex flex-col w-[25%] p-4 gap-y-2">
          <h1 className="text-lg w-full font-bold border-l-[2px] pl-4 border-lime-500 text-black ">
            {title}
          </h1>
          <p className="text-justify pl-4 text-text">{description}</p>
        </div>
      );
    });
  };
  const [rev1, rev2, rev3] = sliceIntoChunks(
    reviews,
    Math.floor(reviews.length / 3)
  );

  console.log(rev1, rev2, rev3, "rev");
  const renderReviews = (rev) => {
    return rev.map(
      ({
        id,
        attributes: {
          rating,
          description,
          product_detail,
          users_permissions_user,
        },
      }) => {
        return (
          <ReviewCard
            key={id}
            description={description}
            rating={rating}
            product_detail={product_detail}
            users_permissions_user={users_permissions_user}
          />
        );
      }
    );
  };
  // renderProducts();
  // const renderReviews = () => {
  //   return reviews.map((p) => {
  //     return (
  //       <ReviewCard
  //         key={p.name}
  //         src={p.image}
  //         name={p.name}
  //         desc={p.desc}
  //       ></ReviewCard>
  //     );
  //   });
  // };

  return (
    <div className="w-full flex flex-col flex-grow gap-y-32">
      <section className="grid grid-cols-2 w-full gap-x-10 p-4 bg-main rounded-md">
        <div className="flex flex-col h-full justify-center p-5 gap-y-7">
          <h1 className="text-5xl font-bold text-black leading-snug">
            {slogan}
          </h1>
          <p className="text-justify leading-normal">{description}</p>
          <button className="rounded-md px-4 py-2 bg-big text-white font-semibold hover:bg-[#5E7647] duration-300 ease-in-out w-fit">
            Lihat Produk
          </button>
        </div>
        <div className="flex mx-auto my-auto items-center aspect-square w-[400px] overflow-hidden rounded-md">
          <Image
            width={400}
            height={400}
            className="rounded-md "
            src={landingurl}
            alt=""
          />
        </div>
      </section>

      {/* why us */}
      <section className="">
        <h1 className="text-4xl font-semibold text-black pb-8">
          <span className="text-[#84CC16]">Mengapa </span> produk tani kami?
        </h1>
        <div className="flex flex-wrap">{generateWhyUs()}</div>
      </section>

      {/* produk */}
      <section className="flex flex-col items-center mt-3 rou w-full">
        <h1 className="text-4xl font-semibold text-black pb-12">
          Produk <span className="text-[#84CC16]">segar</span> kami hari ini!
        </h1>
        <div className="flex flex-wrap w-full gap-3">{renderProducts()}</div>
      </section>

      {/* blog */}
      {/* <section className="">
        <h1 className="text-4xl font-semibold text-black pb-8">
          Temukan <span className="text-[#84CC16]">cerita menarik</span> petani
          kami di blog!
        </h1>
        <div className="flex flex-wrap w-full gap-3"></div>
      </section> */}

      {/* review */}
      <section className="">
        <h1 className="text-4xl font-semibold text-black pb-8">
          Ulasan produk kami adalah{" "}
          <span className="text-[#84CC16]">bukti kualitas</span> kami.
        </h1>
        <div className="flex w-full p-3">
          <div className="flex w-[33%] flex-col gap-y-3 p-3">
            {renderReviews(rev1)}
          </div>
          <div className="flex w-[33%] flex-col gap-y-3 p-3 border-l-[1px] border-r-[1px]">
            {renderReviews(rev2)}
          </div>
          <div className="flex w-[33%] flex-col gap-y-3 p-3">
            {renderReviews(rev3)}
          </div>
        </div>
      </section>

      {/* <section className="flex flex-col items-center pt-10">
        <Header>Ulasan</Header>
        <div className="flex overflow-x-scroll gap-2">{renderReviews()}</div>
      </section> */}
    </div>
  );
}

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ReviewCard from "@/components/ReviewCard";
import Image from "next/image";
export async function getServerSideProps(context) {
  const [productsres, landingres] = await Promise.all([
    axios.get(`${process.env.STRAPI_URL}product-details?populate=*`),
    axios.get(`${process.env.STRAPI_URL}landing-page?populate=*`),
  ]);
  const products = productsres.data.data;
  const landing = landingres.data.data;
  // const reviews = reviewsres.data;

  return {
    props: { products, landing },
  };
}

export default function Home({ products, landing }) {
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
    },
  } = landing;
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
    <div className="w-full flex flex-col flex-grow">
      <section className="grid grid-cols-2 w-full gap-x-10 p-4 bg-main rounded-md">
        <div className="flex items-center">
          <p className="text-justify">{description}</p>
        </div>
        <div className="flex justify-center items-center">
          <Image
            clas
            width={500}
            height={500}
            className="rounded-md"
            src={landingurl}
            alt=""
          />
        </div>
      </section>

      <section className="flex flex-col items-center py-10 mt-3 bg-[#f5f5f5] rounded-md">
        <Header>Produk</Header>
        <div className="flex overflow-x-scroll gap-2 p-5">
          {renderProducts()}
        </div>
      </section>

      {/* <section className="flex flex-col items-center pt-10">
        <Header>Ulasan</Header>
        <div className="flex overflow-x-scroll gap-2">{renderReviews()}</div>
      </section> */}
    </div>
  );
}

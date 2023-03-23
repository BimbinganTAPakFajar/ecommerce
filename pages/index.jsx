import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ReviewCard from "@/components/ReviewCard";
import { useEffect } from "react";
import Image from "next/image";
export async function getServerSideProps(context) {
  const qs = require("qs");
  const config = {
    headers: {
      Authorization: "Bearer " + process.env.STRAPI_TOKEN,
    },
  };
  const query = qs.stringify(
    {
      populate: "image",
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  const [productsres, reviewsres, testres] = await Promise.all([
    axios.get("http://localhost:8080/products"),
    axios.get("http://localhost:8080/reviews"),
  ]);
  const products = productsres.data;
  const reviews = reviewsres.data;

  return {
    props: { products, reviews },
  };
}

export default function Home({ products, reviews }) {
  const { data: session, status } = useSession();
  // useEffect(() => {
  //   if (status !== "authenticated") {
  //     router.push("/login");
  //   }
  // });
  const router = useRouter();
  // console.log(test.data[0].attributes.image.data[0].attributes.url);
  const renderProducts = () => {
    return products.map((p) => {
      return (
        <ProductCard
          key={p.name}
          src={p.image}
          name={p.name}
          amount={p.sold}
        ></ProductCard>
      );
    });
  };

  const renderReviews = () => {
    return reviews.map((p) => {
      return (
        <ReviewCard
          key={p.name}
          src={p.image}
          name={p.name}
          desc={p.desc}
        ></ReviewCard>
      );
    });
  };

  console.log(products.length, "test");
  return (
    <div className="w-full flex flex-col flex-grow">
      <section className="grid grid-cols-2 w-full gap-x-10 p-4 mt-10 bg-main rounded-md">
        <div className="flex items-center">
          <p className="text-justify">
            Selamat datang di toko online produk pertanian kami! Kami adalah tim
            petani yang berdedikasi untuk menyediakan Anda dengan produk-produk
            segar dan lezat langsung dari ladang kami. Mulai dari apel yang
            renyah hingga tomat yang juicy, kami menawarkan berbagai macam
            buah-buahan dan sayuran musiman, serta produk-produk susu, telur,
            dan daging segar. Semua produk kami ditanam menggunakan praktik
            pertanian yang berkelanjutan dan ramah lingkungan, sehingga Anda
            dapat merasa tenang tentang apa yang Anda makan dan dari mana
            asalnya. Belanja sekarang dan rasakan perbedaan segar dari ladang ke
            meja makan!
          </p>
        </div>
        <div>
          <Image className="rounded-md" src="images/farmers.jpg" alt="" />
        </div>
      </section>

      <section className="flex flex-col items-center py-10 bg-[#f5f5f5]">
        <Header>Produk</Header>
        <div className="flex overflow-x-scroll gap-2 p-5">
          {renderProducts()}
        </div>
      </section>

      <section className="flex flex-col items-center pt-10">
        <Header>Ulasan</Header>
        <div className="flex overflow-x-scroll gap-2">{renderReviews()}</div>
      </section>
    </div>
  );
}

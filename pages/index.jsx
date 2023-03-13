import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import NavigationBar from "@/components/NavigationBar";
import axios from "axios";
import ReviewCard from "@/components/ReviewCard";

export async function getServerSideProps(context) {
  const [productsres, reviewsres] = await Promise.all([
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
  const renderProducts = () => {
    return products.map((p) => {
      return (
        <ProductCard src={p.image} name={p.name} amount={p.sold}></ProductCard>
      );
    });
  };

  const renderReviews = () => {
    return reviews.map((p) => {
      return (
        <ReviewCard src={p.image} name={p.name} desc={p.desc}></ReviewCard>
      );
    });
  };

  console.log(products.length, "test");
  return (
    <div className="w-full flex flex-col flex-grow">
      <section className="grid grid-cols-2 w-full gap-x-3 p-4 mt-10 bg-main rounded-md">
        <div className="flex items-center">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
            deleniti velit ex tempore accusantium laboriosam sed explicabo
            pariatur, blanditiis dolore, quibusdam alias exercitationem magni
            est! Illum, officiis beatae eligendi dolor incidunt hic consectetur!
            Expedita obcaecati iure neque consectetur animi, officiis repellat?
            Quisquam, perferendis. Error totam minus voluptatibus impedit rerum
            vel quo quas numquam explicabo consequatur sunt excepturi suscipit
            amet nobis tenetur, asperiores laborum eveniet. Dolorum repellendus
            veniam fuga, dolor iure magnam possimus autem odit fugit nam
            repudiandae accusantium placeat minima! Voluptatibus veritatis nisi
            assumenda, porro, eligendi officia nam possimus unde blanditiis eum
            dignissimos saepe beatae et omnis odio eos pariatur!
          </p>
        </div>
        <div>
          <img className="rounded-md" src="images/farmers.jpg" alt="" />
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

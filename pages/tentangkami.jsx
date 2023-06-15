import Header from "@/components/Header";
import axios from "axios";
import Image from "next/image";
import DefaultLayout from "@/components/layouts/DefaultLayout";
export async function getServerSideProps(context) {
  const aboutres = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}about-page?populate=*`
  );

  const about = aboutres.data.data;
  return {
    props: { about },
  };
}
const TentangKami = ({ about }) => {
  const {
    attributes: {
      content,
      images: { data },
    },
  } = about;
  const generateArticles = () => {
    const article = (
      <article className="prose text-justify pt-5 prose-img:py-10 flex flex-col items-center">
        {content.map((content, index) => {
          const image = data[index] ? (
            <Image
              key={index}
              width={600}
              height={800}
              className="object-cover rounded-md"
              src={data[index].attributes.url}
              alt=""
            />
          ) : (
            ""
          );
          return [content, image];
        })}
      </article>
    );

    return article;
  };
  return (
    <div className="w-full flex flex-col items-center">
      <Header color={"black"}>Tentang Kami</Header>
      {generateArticles()}
    </div>
  );
};

export default TentangKami;
TentangKami.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

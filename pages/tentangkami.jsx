import Header from "@/components/Header";
import axios from "axios";
import Image from "next/image";
// export async function getServerSideProps(context) {
//   const aboutres = await axios.get(`${process.env.STRAPI_URL}about-page?populate=*`),

//   const about = aboutres.data.data;

//   return {
//     props: { about },
//   };
// }
const TentangKami = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Header color={"black"}>Tentang Kami</Header>
      <article className="prose text-justify pt-5 prose-img:py-10">
        Kisah kami dimulai dengan peternakan keluarga kecil, di mana kami
        menanam dan menjual produk-produk kami di pasar petani lokal. Seiring
        reputasi kami yang terus berkembang untuk kualitas dan segar, kami
        menyadari bahwa kami dapat menjangkau lebih banyak orang dan memberikan
        produk yang lebih baik dengan memperluas bisnis kami ke toko online.
        Kami bangga mengatakan bahwa semua produk pertanian kami ditanam dengan
        menggunakan praktik pertanian yang berkelanjutan dan ramah lingkungan.
        <Image
          width={600}
          height={600}
          className=""
          src="/images/aboutus1.jpg"
          alt=""
        />
        Kami percaya bahwa dengan merawat tanah, kami dapat menyediakan makanan
        yang lebih baik untuk pelanggan kami dan generasi mendatang. Tim kami
        terdiri dari petani yang berdedikasi dan bersemangat tentang apa yang
        mereka lakukan. Kami bekerja keras untuk memastikan bahwa setiap produk
        yang kami jual adalah berkualitas tinggi dan memenuhi standar ketat kami
        untuk segar dan rasa. Kami berkomitmen untuk memberikan layanan
        pelanggan yang luar biasa dan ingin setiap pelanggan puas dengan
        pembelian mereka.
        <Image
          width={600}
          height={600}
          className=""
          src="/images/aboutus2.jpg"
          alt=""
        />
        Jika Anda memiliki pertanyaan atau masalah, jangan ragu untuk
        menghubungi kami. Kami menghargai umpan balik Anda dan selalu mencari
        cara untuk meningkatkan produk dan layanan kami. Terima kasih telah
        memilih toko produk pertanian online kami. Kami berharap dapat
        menyediakan Anda dengan yang terbaik dalam produk segar, lezat, dan
        berkelanjutan!
      </article>
    </div>
  );
};

export default TentangKami;

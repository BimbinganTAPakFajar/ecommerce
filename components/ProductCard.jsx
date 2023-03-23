import Image from "next/image";
import Link from "next/link";

const ProductCard = (p) => {
  return (
    <Link
      href={`/produk/${p.id}`}
      key={p.name}
      className="rounded-md aspect-square bg-white shadow-md hover:bg-bg hover:scale-105 duration-300 w-36 flex flex-col items-center  gap-y-1 p-1"
    >
      <div className="rounded-md aspect-square flex items-center">
        <Image
          width={100}
          height={100}
          src={p.src}
          alt=""
          className="rounded-md object-contain"
        />
      </div>
      <p className="text-big text-md">{p.name}</p>
      <p className="text-small text-sm">Terjual {p.amount}</p>
    </Link>
  );
};
export default ProductCard;

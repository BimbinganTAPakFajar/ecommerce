import Image from "next/image";
import Link from "next/link";

const FreshProductCard = (p) => {
  return (
    <Link
      href={`/produk/${p.id}`}
      key={p.name}
      className="rounded-lg bg-white border-[1px] border-[#DEDCD4] hover:bg-[#F2F0EA] hover:-translate-y-3  duration-300 w-fit flex flex-col  p-3"
    >
      <div className="flex mx-auto my-auto items-center aspect-square w-[200px] overflow-hidden rounded-lg">
        <Image width={200} height={200} src={p.src} alt="" className="" />
      </div>
      <p className="text-black text-md pt-2">{p.name}</p>
      <p className="text-text text-sm">Dipanen {p.harvested}</p>
    </Link>
  );
};
export default FreshProductCard;

import Link from "next/link";
import { useRouter } from "next/router";
export default function NavigationBar() {
  const router = useRouter();
  console.log(router.pathname);
  const className = (path) => {
    return router.pathname.substring(1) === path
      ? "text-big"
      : "hover:text-big";
  };
  const navItem = (string) => {
    if (string === "tentangkami") return "Tentang Kami";
    return string[0].toUpperCase() + string.substring(1);
  };

  const renderList = () => {
    const links = ["produk", "tentangkami", "login"];
    return links.map((l) => (
      <li className={className(l)}>
        <Link href={`/${l}`}>{navItem(l)}</Link>
      </li>
    ));
  };
  return (
    <div className="w-full flex justify-between items-center h-20">
      <h1 className="text-3xl flex flex-col font-bold text-big gap-y-2 h-10">
        <Link href="/">My Farm</Link>
      </h1>

      <ul className="h-10 flex gap-x-10 items-center font-bold ">
        {renderList()}
        <button className="w-10 p-2">
          <img src="icons/shopping-cart.png" alt="" />
        </button>
      </ul>
    </div>
  );
}

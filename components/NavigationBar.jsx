import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
export default function NavigationBar() {
  const { data: session, status } = useSession();
  console.log(session, "session");
  const router = useRouter();
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
    return links.map((l) => {
      if (l === "login") {
        if (status === "authenticated") {
          return (
            <li key={l} className={className(l)}>
              <button onClick={signOut}>Logout</button>
            </li>
          );
        }
        return (
          <li key={l} className={className(l)}>
            <button
              onClick={() => {
                signIn();
              }}
            >
              {navItem(l)}
            </button>
          </li>
        );
      } else
        return (
          <li key={l} className={className(l)}>
            <Link href={`/${l}`}>{navItem(l)}</Link>
          </li>
        );
    });
  };
  return (
    <div className="w-full flex justify-between items-center h-20 py-6">
      <h1 className="text-3xl flex flex-col font-bold text-big gap-y-2 h-10">
        <Link href="/">My Farm</Link>
      </h1>

      <ul className="h-10 flex gap-x-10 items-center font-bold ">
        {renderList()}
        <Link href="/keranjang" className="w-10 p-2">
          <Image width={10} height={10} src="/icons/shopping-cart.png" alt="" />
        </Link>
      </ul>
    </div>
  );
}

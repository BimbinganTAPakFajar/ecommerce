import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
export default function NavigationBar() {
  const { data: session, status } = useSession();
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
    <div className="w-full flex justify-between items-center h-fit  text-black py-5">
      <Link href="/">
        <Image
          className="object-contain"
          width={150}
          height={150}
          src={"/logo.png"}
          alt="logo"
        />
      </Link>

      <ul className="h-10 flex gap-x-10 items-center font-bold ">
        {renderList()}
        <Link href="/keranjang" prefetch={false} className="w-10 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </Link>
      </ul>
    </div>
  );
}

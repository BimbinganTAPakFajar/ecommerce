import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
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
    const links = ["produk", "tentangkami", "login", "pesanan"];
    return links.map((l) => {
      if (l === "login") {
        if (status === "authenticated") {
          return (
            <li key={l} className={className(l)}>
              <button
                className="block py-2 pl-3 pr-4 rounded"
                onClick={signOut}
              >
                Logout
              </button>
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
      } else if (l === "pesanan") {
        if (status === "authenticated") {
          return (
            <li key={l} className={className(l)}>
              <Link className="block py-2 pl-3 pr-4 rounded" href={`/${l}`}>
                {navItem(l)}
              </Link>
            </li>
          );
        }
        return null;
      } else
        return (
          <li key={l} className={className(l)}>
            <Link className="block py-2 pl-3 pr-4 rounded" href={`/${l}`}>
              {navItem(l)}
            </Link>
          </li>
        );
    });
  };
  return (
    // <div className="w-full flex justify-between items-center h-fit  text-black py-5">
    //   <Link href="/">
    //     <Image
    //       className="object-contain"
    //       width={150}
    //       height={150}
    //       src={"/logo.png"}
    //       alt="logo"
    //     />
    //   </Link>

    //   <ul className="h-10 flex gap-x-10 items-center font-bold ">
    //     {renderList()}
    //     <Link href="/keranjang" prefetch={false} className="w-10 p-2">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth={1.5}
    //         stroke="currentColor"
    //         className="w-6 h-6"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    //         />
    //       </svg>
    //     </Link>
    //   </ul>
    // </div>

    <nav class=" w-full">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/">
          <Image
            className="object-contain"
            width={150}
            height={150}
            src={"/logo.png"}
            alt="logo"
          />
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200     "
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul class="font-bold flex flex-col p-4 md:p-0 mt-4 border  md:flex-row md:items-center md:space-x-8 md:mt-0 md:border-0 ">
            {/* <li>
              <a
                href="#"
                class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0   md: "
                aria-current="page"
              >
                Home
              </a>
            </li> */}
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
      </div>
    </nav>
  );
}

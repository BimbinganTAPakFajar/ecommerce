import Header from "@/components/Header";
import Link from "next/link";
import CartItem from "@/components/keranjang/CartItem";
import { useLocalStorage } from "@/hooks";
import axios from "axios";
import { getSession } from "next-auth/react";
import { formatPrice } from "@/utils";
import CheckoutPanel from "@/components/keranjang/CheckoutPanel";
import Script from "next/script";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session, "SESSION");
  const userID = session.user.user.id;
  console.log(session.user.user.id, "INI USER");
  const strapiJWT = session.user.jwt;
  const config = {
    headers: {
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  const provinceres = await axios.get(
    "https://pro.rajaongkir.com/api/province",
    config
  );
  const packagingres = await axios.get(
    // `${process.env.NEXT_PUBLIC_STRAPI_URL_DEV}packagings`

    `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings`
  );
  const packagings = packagingres.data.data;
  const provinces = provinceres.data.rajaongkir.results;
  return {
    props: { provinces, packagings, userID, strapiJWT },
  };
}
export default function Keranjang({
  provinces,
  packagings,
  userID,
  strapiJWT,
}) {
  const [cart, setCart] = useLocalStorage("cart", []);

  const handleDelete = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
  };
  const handleOnChange = (id, value) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        if (value > item.stock) {
          return {
            ...item,
            amount: item.stock,
          };
        } else if (value < 1) {
          return {
            ...item,
            amount: 1,
          };
        }
        return {
          ...item,
          amount: value,
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const handleUpdate = (id, operation) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        if (item.amount === 1 && operation === -1) {
          return {
            ...item,
            amount: 1,
          };
        } else if (item.amount === item.stock && operation === 1) {
          return {
            ...item,
            amount: item.stock,
          };
        }
        return {
          ...item,
          amount: item.amount + operation,
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const generateCart = () => {
    return cart.map((item) => {
      return (
        <CartItem
          key={item.id}
          id={item.id}
          name={item.name}
          src={item.src}
          price={item.finalPrice}
          amount={item.amount}
          handleChange={handleOnChange}
          onPlus={() => handleUpdate(item.id, 1)}
          onMinus={() => handleUpdate(item.id, -1)}
          onDelete={() => handleDelete(item.id)}
        />
      );
    });
  };
  const calculateSubTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.amount * item.finalPrice;
    });
    return total;
  };
  return (
    <div className="w-full flex gap-x-5 p-3">
      <Script
        type="text/javascript"
        src="https://app.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      ></Script>
      <div className="w-2/3 flex flex-col">
        <h1 className="text-3xl font-semibold pb-5">Keranjang</h1>
        {cart.length !== 0 ? (
          <div className="flex gap-x-10">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-fit">
              <table className="w-full text-sm text-left ">
                <thead className="text-xs  uppercase bg-[#DEDCD4]">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Image</span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Qty
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{generateCart()}</tbody>
              </table>
            </div>
            {/* <h1 className="text-2xl">
            Subtotal: {formatPrice(calculateSubTotal())}
          </h1> */}
            {/* <Link
            href="/keranjang/checkout"
            className="rounded-md px-4 py-2 gap-x-5 text-white bg-big hover:bg-[#5E7647] flex justify-between items-center"
          >
            <p className="text-lg font-semibold">CHECKOUT</p>
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
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link> */}
          </div>
        ) : (
          "Keranjang anda kosong"
        )}
      </div>
      <CheckoutPanel
        provinces={provinces}
        packagings={packagings}
        userID={userID}
        itemSubTotal={calculateSubTotal()}
        strapiJWT={strapiJWT}
      />
    </div>
  );
}

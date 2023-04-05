import Header from "@/components/Header";
import Link from "next/link";
import CartItem from "@/components/keranjang/CartItem";
import { useLocalStorage } from "@/hooks";
import { formatPrice } from "@/utils";

export default function Keranjang() {
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
    console.log("asd");
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
    <div className="w-full flex flex-col items-center gap-y-12">
      <h1 className="text-4xl font-semibold">Keranjang</h1>
      {cart.length !== 0 ? (
        <>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
            <table class="w-full text-sm text-left ">
              <thead class="text-xs  uppercase bg-[#DEDCD4]">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Image</span>
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Product
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Qty
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{generateCart()}</tbody>
            </table>
          </div>
          <h1 className="text-2xl">
            Subtotal: {formatPrice(calculateSubTotal())}
          </h1>
          <Link
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
          </Link>
        </>
      ) : (
        "bye"
      )}
    </div>
  );
}

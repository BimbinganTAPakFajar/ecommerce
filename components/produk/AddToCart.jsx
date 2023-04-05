import Image from "next/image";
import moment from "moment";
import { useEffect, useState } from "react";
import "moment/locale/id";
import { diffDay, formatPrice } from "@/utils";
import { useLocalStorage } from "@/hooks";

export default function AddToCart({
  id,
  name,
  src,
  price,
  finalPrice,
  stock,
  harvested,
  togglePopUp,
}) {
  console.log(price === finalPrice, "PRICES");
  const days = moment().diff(harvested, "days");

  // console.log(id, name, src, price, amount, harvested, "PRICEEEEE");
  const [currentAmount, setCurrentAmount] = useState(1);

  const [cart, setCart] = useLocalStorage("cart", []);
  moment.locale("id");

  const handleAddToCart = (e) => {
    e.preventDefault();
    const newCart = [...cart];
    const item = newCart.find((item) => item.id === id);
    if (item) {
      if (item.amount + currentAmount > stock) {
        item.amount = stock;
      } else item.amount += currentAmount;
    } else {
      newCart.push({
        id,
        name,
        src,
        finalPrice,
        amount: currentAmount,
        stock,
      });
    }
    setCart(newCart);
    togglePopUp();
  };
  const onPlus = () => {
    // console.log("hi");
    if (currentAmount < stock) {
      // console.log("hi");
      setCurrentAmount(currentAmount + 1);
    }
  };
  const onMinus = () => {
    if (currentAmount === 1) {
      setCurrentAmount(1);
    } else {
      // console.log("bye");
      setCurrentAmount(currentAmount - 1);
    }
  };

  const handleOnChange = (value) => {
    if (value > stock) {
      setCurrentAmount(stock);
    } else if (value < 1) {
      setCurrentAmount(1);
    } else {
      setCurrentAmount(value);
    }
  };

  console.log(price, "oldprice");
  return (
    <div
      key={id}
      className="w-full  flex flex-col gap-y-5 h-full relative pt-10"
    >
      <div className="flex flex-col gap-y-10">
        {/* <h2 className="text-lg">{name}</h2> */}
        <h2 className="text-2xl font-bold">
          {days < 3 ? <span className="text-[#8BA76E]">SEGAR! </span> : ""}
          {price !== finalPrice ? (
            <span className="opacity-20 text-text line-through pr-1">
              {"Rp" + formatPrice(price)}
            </span>
          ) : (
            ""
          )}
          {"Rp" + formatPrice(finalPrice) + "/kg"}
        </h2>
        <p className="text-md">
          Dipanen{" "}
          <span className="font-bold">{moment(harvested).fromNow()}</span>
        </p>
        <div className="flex flex-col items-center gap-y-1 w-fit">
          <div className="w-[200px] h-[40px] rounded-md flex justify-between border-[#DEDCD4] border-[2px] items-center relative">
            <button
              className={`text-2xl absolute right-1 ${
                currentAmount === stock ? "cursor-not-allowed" : ""
              } `}
              onClick={onPlus}
            >
              +
            </button>
            <input
              onChange={(e) => {
                handleOnChange(Number(e.target.value));
              }}
              className="border-none focus:border-big text-center w-full h-full rounded-md"
              value={String(currentAmount).replace(/^0+/, "")}
              min={1}
              max={stock}
              type="number"
            />
            <button
              className={`text-3xl absolute left-1 ${
                currentAmount === 1 ? "cursor-not-allowed" : ""
              } `}
              onClick={onMinus}
            >
              -
            </button>
          </div>
          <p className="text-sm">{"Stok: " + stock + "kg"}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          handleAddToCart(e);
        }}
        className="bg-big text-base font-semibold rounded-md text-white p-2 absolute bottom-0 w-full hover:bg-[#5E7647]"
      >
        Tambahkan ke Keranjang
      </button>
    </div>
  );
}

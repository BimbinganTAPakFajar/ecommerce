import Image from "next/image";
import { useLocalStorage } from "@/hooks";
import { useEffect } from "react";
import { formatPrice } from "@/utils";
export default function CartItem({
  id,
  name,
  src,
  price,
  amount,
  stock,
  handleChange,
  onDelete,
  onPlus,
  onMinus,
}) {
  return (
    <tr className="bg-white border-b hover:bg-[#DEDCD4] h-fit">
      <td className="w-32 p-4 align-middle text-center">
        <div className="flex items-center rounded-lg overflow-hidden w-[100px] h-[100px] mx-auto">
          <Image width={100} height={100} src={src} alt="" />
        </div>
      </td>
      <td className="px-6 py-4 align-middle text-center font-semibold  dark:text-white">
        {name}
      </td>
      <td className="px-6 py-4  w-full ">
        <div className="w-[200px] h-[40px] rounded-md flex justify-between border-[#DEDCD4] border-[2px] mx-auto items-center relative">
          <button
            className={`text-2xl absolute right-1 ${
              amount === stock ? "cursor-not-allowed" : ""
            } `}
            onClick={onPlus}
          >
            +
          </button>
          <input
            onChange={(e) => {
              handleChange(id, Number(e.target.value));
            }}
            className="border-none focus:border-big text-center w-full h-full rounded-md"
            value={String(amount).replace(/^0+/, "")}
            min={1}
            max={stock}
            type="number"
          />
          <button
            className={`text-3xl absolute left-1 ${
              amount === 1 ? "cursor-not-allowed" : ""
            } `}
            onClick={onMinus}
          >
            -
          </button>
        </div>
      </td>
      <td className="px-6 py-4 align-middle  font-semibold  dark:text-white">
        {formatPrice(price)}
      </td>
      <td className="px-6 py-4 align-middle  font-semibold  dark:text-white">
        {formatPrice(price * amount)}
      </td>
      <td className="px-6 py-4 align-middle text-center flex items-center justify-center h-40">
        <button onClick={onDelete}>
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}

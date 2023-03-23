import CartItem from "@/components/CartItem";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { useCart, useLocalStorage } from "@/hooks";
import { useState } from "react";
import { useEffect } from "react";
export default function Keranjang() {
  const [cart, setCart] = useLocalStorage("cart", [
    {
      id: 1,
      name: "Baju",
      src: "https://picsum.photos/200",
      price: 10000,
      amount: 1,
    },
    {
      id: 2,
      name: "Baju",
      src: "https://picsum.photos/200",
      price: 10000,
      amount: 1,
    },
    {
      id: 3,
      name: "Baju",
      src: "https://picsum.photos/200",
      price: 10000,
      amount: 1,
    },
    {
      id: 4,
      name: "Baju",
      src: "https://picsum.photos/200",
      price: 10000,
      amount: 1,
    },
    {
      id: 5,
      name: "Baju",
      src: "https://picsum.photos/200",
      price: 10000,
      amount: 1,
    },
  ]);

  const handleDelete = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
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
        } else
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
          key={item.name}
          id={item.id}
          name={item.name}
          src={item.src}
          price={item.price}
          amount={item.amount}
          onPlus={() => handleUpdate(item.id, 1)}
          onMinus={() => handleUpdate(item.id, -1)}
          onDelete={() => handleDelete(item.id)}
        />
      );
    });
  };
  console.log(generateCart);
  return (
    <div>
      {cart.length !== 0 ? (
        <div>{generateCart()}</div>
      ) : (
        <div>
          <p>Keranjang kosong</p>
        </div>
      )}
    </div>
  );
}

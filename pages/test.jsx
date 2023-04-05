import AddToCart from "@/components/produk/AddToCart";

export default function Test() {
  const date = new Date();
  return (
    <AddToCart
      id={1}
      amount={100}
      harvested={date}
      price={10000}
      name={"Kentang"}
    />
  );
}

import Image from "next/image";

export default function CartItem({
  id,
  name,
  src,
  price,
  amount,
  onDelete,
  onPlus,
  onMinus,
}) {
  return (
    <div key={id} className="flex w-20 rounded-md">
      <div className="">
        <Image className="" src={src} alt="" />
      </div>
      <div>
        <h2 className="text-sm">{name}</h2>
        <p className="text-sm">{price}</p>
        <p className="text-sm">{amount}</p>
        <button onClick={onPlus}>+</button>
        <button onClick={onMinus}>-</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

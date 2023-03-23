import Image from "next/image";

export default function ReviewCard(p) {
  return (
    <div className="flex bg-bg rounded-md">
      <div className="">
        <Image className="" src={p.src} alt="" />
      </div>
      <div>
        <h2 className="text-sm">{p.name}</h2>
        <p className="text-sm">{p.desc}</p>
      </div>
    </div>
  );
}

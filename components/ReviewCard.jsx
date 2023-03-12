export default function ReviewCard(p) {
  return (
    <div className="flex bg-bg rounded-md">
      <div className="">
        <img className="" src={p.src} alt="" />
      </div>
      <div>
        <h2 className="text-sm">{p.name}</h2>
        <p className="text-sm">
          {p.desc}
        </p>
      </div>
    </div>
  )
}
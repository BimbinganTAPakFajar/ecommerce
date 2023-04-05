import moment from "moment";

const ItemCard = ({ harvested, onClick, selected }) => {
  const days = moment().diff(harvested, "days");
  // console.log(days);
  const selectedClass = selected ? "border-big" : "";
  return (
    <button
      onClick={onClick}
      className={`w-[50px] h-[50px] p-1 border-2 cursor-pointer hover:border-big ${selectedClass} rounded-md`}
    >
      <span>{days + "d"}</span>
    </button>
  );
};

export default ItemCard;

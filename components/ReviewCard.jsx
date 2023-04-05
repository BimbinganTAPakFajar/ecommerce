import { capitalize } from "@/utils";
import StarRating from "./StarRating";

const ReviewCard = ({
  product_detail,
  users_permissions_user,
  description,
  rating,
}) => {
  const {
    attributes: { username },
  } = users_permissions_user.data;
  const {
    attributes: { name },
  } = product_detail.data;
  return (
    <div className="flex flex-col gap-3 w-full justify-start col-span-1">
      <span className="font-bold">{name}</span>
      <StarRating number={rating} />
      <span className="text-justify font-medium">{description}</span>
      <div className="flex w-full justify-end">
        <span className="font-light">{capitalize(username)}</span>
      </div>
    </div>
  );
};

export default ReviewCard;

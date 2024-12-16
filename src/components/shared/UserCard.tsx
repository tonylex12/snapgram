import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
  isFollowing?: boolean;
  onFollow?: () => void;
};

const UserCard = ({ user, isFollowing, onFollow }: UserCardProps) => {
  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`} className="user-card_link items-center">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14 m-auto"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1 mt-4">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>

      <Button
        type="button"
        size="sm"
        className="shad-button_primary px-5 rounded"
        onClick={onFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;

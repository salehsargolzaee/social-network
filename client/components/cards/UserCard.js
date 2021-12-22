import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";

const { Meta } = Card;
const defaultFunction = () => {
  return;
};

function UserCard({ user, followOptions = defaultFunction, showPhoto = true }) {
  const { state: loggedUser } = useContext(UserContext);
  const [clickableStyle, setClickableStyle] = useState({ color: "black" });
  const router = useRouter();
  return (
    <Card
      hoverable
      cover={
        showPhoto && (
          <img
            alt={user && user.name}
            style={{ width: "23rem" }}
            src={
              user && user.photo && user.photo.url
                ? user.photo.url
                : "/images/defaultUser.png"
            }
          />
        )
      }
      actions={
        loggedUser &&
        loggedUser.user &&
        loggedUser.user._id !== user._id &&
        (loggedUser.user.following.includes(user._id)
          ? [followOptions("Unfollow")]
          : loggedUser.user.followers.includes(user._id)
          ? [followOptions("Follow back")]
          : [followOptions("Follow")])
      }
    >
      <Meta
        avatar={
          <Avatar
            size={showPhoto ? 40 : 80}
            src={user && user.photo && user.photo.url}
            icon={<UserOutlined />}
          ></Avatar>
        }
        title={
          user && user.name && showPhoto ? (
            user.name
          ) : (
            <Link href={`/user/profile/update`}>
              <a
                onMouseEnter={() => setClickableStyle({ color: "#1876D0" })}
                onMouseLeave={() => setClickableStyle({ color: "black" })}
                style={clickableStyle}
              >
                {user.name}
              </a>
            </Link>
          )
        }
        description={user && user.about}
      />
      {showPhoto ? (
        <p className="pt-3 ps-2 text-muted" style={{ fontSize: "11px" }}>
          Joined {moment(user.createdAt).fromNow()}
        </p>
      ) : (
        <div
          className="d-flex justify-content-between mt-3 ps-1 text-muted"
          style={{ fontSize: "12px", position: "relative", bottom: "-11px" }}
        >
          <p> Email: {user.email}</p>
          <p>Username : {user.username}</p>
        </div>
      )}

      {showPhoto ? (
        <div className="d-flex justify-content-between pt-4">
          <span className="btn btn-sm">
            {user && user.followers && user.followers.length} Followers
          </span>
          <span className="btn btn-sm">
            {user && user.following && user.following.length} Following
          </span>
        </div>
      ) : (
        <div className="d-flex justify-content-between pt-4">
          <Link href={`/user/followers`}>
            <a>{user.followers.length} Followers</a>
          </Link>
          <Link href={`/user/following`}>
            <a>{user.following.length} Following</a>
          </Link>
        </div>
      )}
    </Card>
  );
}

export default UserCard;

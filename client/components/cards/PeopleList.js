import { useContext } from "react";
import { UserContext } from "../../context";
import moment from "moment";
import { useRouter } from "next/router";
import { Avatar, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

function PeopleList({ people, handleFollow, followStatus }) {
  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      <List
        dataSource={people}
        renderItem={(user) =>
          user &&
          user.role !== "Admin" && (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={user.photo && user.photo.url && user.photo.url}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#577594" }}
                  />
                }
                title={
                  <Link href={`/user/${user.username}`}>
                    <a>{user.username}</a>
                  </Link>
                }
                description={
                  user.about ? user.about : user.name ? user.name : null
                }
              />

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  if (handleFollow) handleFollow(user);
                }}
              >
                {followStatus === "dashboard" ? "Follow" : `${followStatus}`}
              </button>
            </List.Item>
          )
        }
      />
    </>
  );
}

export default PeopleList;

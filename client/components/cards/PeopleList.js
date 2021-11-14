import { useContext } from "react";
import { UserContext } from "../../context";
import moment from "moment";
import { useRouter } from "next/router";
import { Avatar, List } from "antd";
import { UserOutlined } from "@ant-design/icons";

function PeopleList({ people }) {
  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      <List
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={user.photo && user.photo.url && user.photo.url}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#577594" }}
                />
              }
              title={<div>{user.username}</div>}
              description={user.about ? user.about : user.email}
            />
            <button className="btn btn-outline-primary btn-sm">Follow</button>
          </List.Item>
        )}
      />
    </>
  );
}

export default PeopleList;

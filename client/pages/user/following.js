import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context";
import PeopleList from "../../components/cards/PeopleList";
import UserRoute from "../../components/routes/UserRoute";
import { toast } from "react-toastify";
import axios from "axios";
import { LoadingOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Button, Menu } from "antd";
import Link from "next/link";

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Link href="/user/profile/update">Profile</Link>
    </Menu.Item>

    <Menu.Item key="2">
      <Link href="/user/dashboard">Dashboard</Link>
    </Menu.Item>

    <Menu.Item key="3">
      <Link href="/">Home</Link>
    </Menu.Item>
  </Menu>
);
function Following() {
  const [followedPeople, setFollowedPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);

  const fetchFollowedPeople = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/user-following");
      setFollowedPeople(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  const handleUnFollow = async (user) => {
    // console.log("unfollow =>", user);
    try {
      const { data } = await axios.put("/unfollow-user", { _id: user._id });

      const auth = JSON.parse(window.localStorage.getItem("auth"));

      auth.user = data;

      window.localStorage.setItem("auth", JSON.stringify(auth));

      setLoggedUser((prev) => ({ ...prev, user: data }));

      setFollowedPeople(
        followedPeople.filter((person) => person._id !== user._id)
      );
      toast.success(`Unfollowed ${user.name}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    if (loggedUser && loggedUser.token) fetchFollowedPeople();
  }, [loggedUser && loggedUser.token]);

  return (
    <UserRoute>
      {loading ? (
        <LoadingOutlined className="d-flex justify-content-center display-1 p-5 text-primary" />
      ) : (
        <>
          <div className="row" style={{ position: "relative", top: "60px" }}>
            <div className="col-md-10 offset-md-1 col-sm-10 offset-sm-1">
              <PeopleList
                people={followedPeople}
                handleFollow={handleUnFollow}
                followStatus="Unfollow"
              />
            </div>
          </div>
          <div
            className="d-flex justify-content-center m-4"
            style={{ position: "relative", top: "60px" }}
          >
            <Dropdown overlay={menu}>
              <Button>
                Go to <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </>
      )}
    </UserRoute>
  );
}

export default Following;

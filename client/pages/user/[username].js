import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context";
import { toast } from "react-toastify";
import axios from "axios";
import {
  LoadingOutlined,
  DownOutlined,
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Dropdown, Button, Menu, Avatar, Card } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";
import UserCard from "../../components/cards/UserCard";

const { Meta } = Card;

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
function UsernameProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);
  const router = useRouter();
  const [buttonStyle, setButtonStyle] = useState({
    width: "100%",
    height: "100%",
    color: "black",
  });

  const username = router.query.username;

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/user/${username}`);
      // console.log("received user => ", data);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log("Error in fetch user public profile => ", error);
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

      toast.success(`Unfollowed ${user.name}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };
  const handleFollow = async (user) => {
    // console.log("Want to follow this user =>", user._id);
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });

      // console.log(data);

      // update user in local storage
      const auth = JSON.parse(window.localStorage.getItem("auth"));
      auth.user = data;
      window.localStorage.setItem("auth", JSON.stringify(auth));

      // update context
      setLoggedUser((prev) => ({ ...prev, user: data }));

      // remove followed user from suggestion list

      toast.success(`You have followed ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (username) fetchUser();
  }, [username]);

  const followOptions = (kind) => {
    return (
      <div
        key={kind}
        className="btn btn-md p-0"
        style={buttonStyle}
        onMouseEnter={() =>
          setButtonStyle((prev) => ({
            ...prev,
            color: "#1876D1",
          }))
        }
        onMouseLeave={() =>
          setButtonStyle((prev) => ({
            ...prev,
            color: "black",
          }))
        }
        onClick={() => {
          if (kind !== "Unfollow") {
            handleFollow(user);
          } else {
            handleUnFollow(user);
          }
        }}
      >
        {kind !== "Unfollow" ? <UserAddOutlined /> : <UserDeleteOutlined />}
        {kind}
      </div>
    );
  };
  return (
    <>
      {loading ? (
        <LoadingOutlined className="d-flex justify-content-center display-1 p-5 text-primary" />
      ) : (
        <div className="row">
          <div className="container-fluid container-custom  ">
            {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}
            <div
              className="d-flex justify-content-center p-3 pb-2"
              style={{ marginTop: "4rem" }}
            >
              <UserCard user={user} followOptions={followOptions} />
            </div>
            <div className="d-flex justify-content-center m-2">
              <Dropdown overlay={menu}>
                <Button>
                  Go to <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsernameProfile;

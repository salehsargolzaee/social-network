import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

function UserRoute({ children }) {
  const [loginOk, setLoginOk] = useState(false);
  const router = useRouter();
  const { state: loggedUser } = useContext(UserContext);

  const checkCurrentUser = async () => {
    try {
      const { data } = await axios.get(`/current-user`);
      if (data.ok) {
        setLoginOk(true);
      }
    } catch (err) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, [loggedUser && loggedUser.token]);

  return loginOk ? (
    <>{children}</>
  ) : (
    <LoadingOutlined className="d-flex justify-content-center display-1 p-5 text-primary" />
  );
}

export default UserRoute;
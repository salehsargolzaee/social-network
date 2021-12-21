import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

function AdminRoute({ children }) {
  const [loginOk, setLoginOk] = useState(false);
  const router = useRouter();
  const { state: loggedUser } = useContext(UserContext);

  const checkCurrentAdmin = async () => {
    try {
      const { data } = await axios.get(`/current-admin`);
      if (data.ok) {
        setLoginOk(true);
      }
    } catch (err) {
      router.push("/");
    }
  };

  useEffect(() => {
    if (loggedUser && loggedUser.token) checkCurrentAdmin();
    return () => {
      setLoginOk(false);
    };
  }, [loggedUser && loggedUser.token]);

  process.browser &&
    !loggedUser &&
    setTimeout(() => {
      router.push("/");
    }, 1000);

  return loginOk ? (
    <>{children}</>
  ) : (
    <div className="d-flex justify-content-center display-1 p-5 text-primary">
      <LoadingOutlined style={{ marginTop: "10rem" }} />
    </div>
  );
}

export default AdminRoute;

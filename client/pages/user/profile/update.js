import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import UserRoute from "../../../components/routes/UserRoute";

function UpdateProfile() {
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);

  const fill = (property) => {
    return loggedUser && loggedUser.user && loggedUser.user[property]
      ? loggedUser.user[property]
      : "";
  };
  const [userInformation, setUserInformation] = useState({
    name: fill("name"),
    email: fill("email"),
    username: fill("username"),
    about: fill("about"),
    password: "",
    newPassword: "",
  });

  useEffect(() => {
    if (loggedUser && loggedUser.user) {
      setUserInformation({
        name: fill("name"),
        email: fill("email"),
        username: fill("username"),
        about: fill("about"),
        password: "",
        newPassword: "",
      });
    }
  }, [loggedUser && loggedUser.user]);
  // ok shows if is it ok to display modal or not
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name: inputType, value } = event.target;
    setUserInformation((prev) => {
      return { ...prev, [inputType]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(userInformation);
    try {
      setLoading(true);
      const { data } = await axios.put(`/profile-update`, userInformation);

      console.log("updated user=>", data);

      // update local storage user
      const auth = JSON.parse(window.localStorage.getItem("auth"));
      auth.user = data;
      window.localStorage.setItem("auth", JSON.stringify(auth));

      // update context
      setLoggedUser((prev) => ({ ...prev, user: data }));

      setLoading(false);
      setOk(true);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  const handleDisable = () => {
    if (loading) return true;
    for (const key in userInformation) {
      if (key === "about" || key === "password" || key === "newPassword")
        continue;
      if (!userInformation[key]) return true;
    }
    return false;
  };

  return (
    <UserRoute>
      <div className="container-fluid container-custom">
        <div className="row bg-default-image py-5 text-ligth box-shadow">
          <div className="col text-center">
            <h1 style={{ color: "#4A6984" }}>Profile</h1>
          </div>
        </div>
        <div className="row pt-5 pb-3">
          <div className="col-md-6 offset-md-3">
            <AuthForm
              userInformation={userInformation}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleDisable={handleDisable}
              loading={loading}
              pageKind="profile"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Modal
              title="Successful!"
              visible={ok}
              onCancel={() => setOk(false)}
              footer={null}
            >
              <p>Successfully updated information.</p>
            </Modal>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p className="text-center">
              Already registered?{" "}
              <Link href="/login">
                <a>Login</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}

export default UpdateProfile;

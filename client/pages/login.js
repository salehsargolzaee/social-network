import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";

function Login() {
  const [userInformation, setUserInformation] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);

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
      const { data } = await axios.post(`/login`, userInformation);
      setUserInformation({
        email: "",
        password: "",
      });
      setLoading(false);
      // update user context
      setLoggedUser({ user: data.user, token: data.token });
      // save in local storage
      window.localStorage.setItem("auth", JSON.stringify(data));
      router.push("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  const handleDisable = () => {
    for (const key in userInformation) {
      if (!userInformation[key]) return true;
    }
    return false;
  };

  if (loggedUser && loggedUser.token) {
    router.push("/");
  }
  return (
    <div className="container-fluid container-custom">
      <div className="row bg-default-image py-5 text-ligth box-shadow">
        <div className="col text-center">
          <h1 style={{ color: "#4A6984" }}>Login</h1>
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
            registerPage={false}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Not registered yet?{" "}
            <Link href="/register">
              <a>Register</a>
            </Link>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            <Link href="/forgot-password">
              <a>Forgot password</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

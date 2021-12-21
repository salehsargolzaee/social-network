import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

function Register() {
  const [userInformation, setUserInformation] = useState({
    name: "",
    email: "",
    password: "",
    question: "What is the name of your first teacher ?",
    answer: "",
  });
  // ok shows if is it ok to display modal or not
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();

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
      const { data } = await axios.post(`/register`, userInformation);
      setUserInformation({
        name: "",
        email: "",
        password: "",
        question: "What is the name of your first teacher ?",
        answer: "",
      });
      setLoading(false);
      setOk(data.ok);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  const handleDisable = () => {
    if (loading) return true;
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
          <h1 style={{ color: "white" }}>Register</h1>
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
            pageKind={"register"}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Modal
            title="Thank you!"
            visible={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <p>You have successfully registered.</p>
            <Link href="/login">
              <button className="btn btn-primary btn-sm">Login</button>
            </Link>
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
  );
}

export default Register;

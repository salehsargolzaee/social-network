import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";

function Register() {
  const [userInformation, setUserInformation] = useState({
    name: "",
    email: "",
    password: "",
    answer: "",
  });
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
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/register`,
        userInformation
      );
      setUserInformation({
        name: "",
        email: "",
        password: "",
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
    for (const key in userInformation) {
      if (!userInformation[key]) return true;
    }
    return false;
  };

  return (
    <div className="container-fluid container-custom-color">
      <div className="row bg-default-image py-5 text-ligth box-shadow">
        <div className="col text-center">
          <h1 style={{ color: "#4A6984" }}>Register</h1>
        </div>
      </div>
      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            userInformation={userInformation}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleDisable={handleDisable}
            loading={loading}
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
    </div>
  );
}

export default Register;

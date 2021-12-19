import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userInformation, setUserInformation] = useState({
    _id: "",
    question: "",
    answer: "",
    newPassword: "",
  });
  // ok shows if is it ok to display modal or not
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();

  const handleChange = (event) => {
    const { name: inputType, value } = event.target;
    if (inputType === "email") {
      setEmail(value);
    } else {
      setUserInformation((prev) => {
        return { ...prev, [inputType]: value };
      });
    }
  };
  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const {
        data: { question, _id },
      } = await axios.post("/find-question", { email });
      setLoading(false);
      setEmail("");
      setUserInformation((prev) => ({
        ...prev,
        question,
        _id,
      }));
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };
  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/forgot-password`, userInformation);
      setLoading(false);
      setOk(data.ok);
      setUserInformation({
        _id: "",
        question: "",
        answer: "",
        newPassword: "",
      });
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  if (loggedUser && loggedUser.token) {
    router.push("/");
  }

  return (
    <div className="container-fluid container-custom">
      <div className="row bg-default-image py-5 text-ligth box-shadow">
        <div className="col text-center">
          <h1>Change Password</h1>
        </div>
      </div>
      <div className="row pt-5 pb-3">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            userInformation={userInformation}
            email={email}
            handleSubmitAnswer={handleSubmitAnswer}
            handleSubmitEmail={handleSubmitEmail}
            handleChange={handleChange}
            loading={loading}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Modal
            title="Changed Successfully!"
            visible={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <p>
              You have successfully changed the password. You can login with
              your new password.
            </p>
            <Link href="/login">
              <button className="btn btn-primary btn-sm">Login</button>
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

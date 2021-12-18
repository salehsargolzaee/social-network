import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Avatar } from "antd";
import Link from "next/link";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import UserRoute from "../../../components/routes/UserRoute";
import { CameraTwoTone, LoadingOutlined } from "@ant-design/icons";

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

  // handle adding profile image
  const [userImage, setUserImage] = useState(fill("photo"));
  // handle showing spinner while uploading user image
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setUserImage({ url: data.url, public_id: data.public_id });
      setIsUploading(false);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };

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
      setUserImage(fill("photo"));
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
      const { data } = await axios.put(`/profile-update`, {
        ...userInformation,
        photo: userImage,
      });

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
            <h1 style={{ color: "white" }}>Profile</h1>
          </div>
        </div>
        <div className="row pt-5 pb-3">
          <div className="col-md-6 offset-md-3">
            {/* Change profile image */}
            <label className="d-flex justify-content-center">
              {isUploading ? (
                <LoadingOutlined className="h2" />
              ) : userImage && userImage.url ? (
                <Avatar
                  src={userImage.url}
                  size={200}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <span className="text-muted">
                  Add a profile picture
                  <CameraTwoTone
                    style={{
                      fontSize: "30px",
                      margin: "0 1rem",
                    }}
                  />
                </span>
              )}
              <input
                onChange={handleImageUpload}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
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

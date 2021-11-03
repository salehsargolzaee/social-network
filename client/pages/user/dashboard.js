import { useContext, useState } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import CreatePostForm from "../../components/forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

function Dashboard() {
  const { state: loggedUser } = useContext(UserContext);

  const [postContent, setPostContent] = useState("");

  const router = useRouter();

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/create-post", {
        postContent,
      });
      console.log("Post creation response => ", data);
      toast.success("Successfully created the post.");
      setPostContent("");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row bg-default-image py-5 text-ligth box-shadow">
          <div className="col text-center">
            <h1 style={{ color: "#4A6984" }}>
              Welcome Back, {loggedUser.user["name"]}
            </h1>
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8">
            <CreatePostForm
              postContent={postContent}
              setPostContent={setPostContent}
              handlePostSubmit={handlePostSubmit}
            />
          </div>
          <div className="col-md-4">SideBar</div>
        </div>
      </div>
    </UserRoute>
  );
}

export default Dashboard;

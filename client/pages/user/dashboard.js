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
  const [postImage, setPostImage] = useState({});

  // loading spinner for image uploading delay
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/create-post", {
        postContent,
        postImage,
      });
      console.log("Post creation response => ", data);
      toast.success("Successfully created the post.");
      setPostContent("");
      setPostImage({});
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    // console.log([...formData]);

    setIsLoading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      console.log("Uploaded image data => ", data);
      setPostImage({ url: data.url, public_id: data.public_id });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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
              handleImageUpload={handleImageUpload}
              isLoading={isLoading}
              postImage={postImage}
            />
          </div>
          <div className="col-md-4">SideBar</div>
        </div>
      </div>
    </UserRoute>
  );
}

export default Dashboard;

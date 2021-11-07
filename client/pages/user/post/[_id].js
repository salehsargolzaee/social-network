import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context";
import axios from "axios";
import { toast } from "react-toastify";
import PostForm from "../../../components/forms/PostForm";
import UserRoute from "../../../components/routes/UserRoute";

function EditPost() {
  const router = useRouter();
  const [post, setPost] = useState({});

  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState({});
  const { state: loggedUser } = useContext(UserContext);

  // loading spinner for image uploading delay
  const [isLoading, setIsLoading] = useState(false);

  //   console.log("router => ", router);

  // We can access _id from router.query.[name inside bracket in filename]
  const _id = router.query._id;

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      setPostImage(data.image);
      setPostContent(data.content);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    if (_id && loggedUser && loggedUser.token) fetchPost();
  }, [_id && loggedUser && loggedUser.token]);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put(`/update-post/${_id}`, {
        postContent,
        postImage,
      });
      if (data.err) {
        toast.error(data.err);
      } else {
        toast.success("Successfully updated the post.");
      }
      router.push("/user/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setIsLoading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setPostImage({ url: data.url, public_id: data.public_id });
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data);
      setIsLoading(false);
    }
  };
  return (
    <UserRoute>
      <div className="container-fluid container-custom">
        <div className="row bg-default-image py-5 text-ligth box-shadow">
          <div className="col text-center">
            <h1 style={{ color: "#4A6984" }}>Edit</h1>
          </div>
        </div>
        <div className="row py-5">
          <div className="col-md-8 offset-md-2 ql-bigger">
            <PostForm
              postContent={postContent}
              setPostContent={setPostContent}
              handlePostSubmit={handlePostSubmit}
              handleImageUpload={handleImageUpload}
              isLoading={isLoading}
              postImage={postImage}
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
}

export default EditPost;

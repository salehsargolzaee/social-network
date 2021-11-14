import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import PeopleList from "../../components/cards/PeopleList";

function Dashboard() {
  const { state: loggedUser } = useContext(UserContext);

  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [suggestedPeople, setSuggestedPeople] = useState([]);

  const [userCount, setUserCount] = useState(0);

  // if modal showing the value of this state will be _id of target post
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // loading spinner for image uploading delay
  const [isLoading, setIsLoading] = useState(false);

  // loading spinner for post fetching delay
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const router = useRouter();

  const fetchUserPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const { data } = await axios.get("/user-posts");
      setUserPosts(data);
      setIsLoadingPosts(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
      setIsLoadingPosts(false);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setSuggestedPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (loggedUser && loggedUser.token) {
      fetchUserPosts();
      findPeople();
    }
    return () => {
      setUserPosts([]);
      setSuggestedPeople([]);
    };
  }, [loggedUser && loggedUser.token]);

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
      fetchUserPosts();
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

  const handlePostDelete = async (id) => {
    setShowDeleteModal(false);
    try {
      const { data } = await axios.delete(`/delete-post/${id}`);
      if (loggedUser && loggedUser.token) fetchUserPosts();
      toast.success("Successfully deleted the post.");
    } catch (error) {
      console.log("error in post deletion =>", error);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid container-custom">
        <div className="row bg-default-image py-5 text-ligth box-shadow">
          <div className="col text-center">
            <h1 style={{ color: "#4A6984" }}>
              {loggedUser &&
                loggedUser.user &&
                `Welcome Back, ${loggedUser.user["name"]}`}
            </h1>
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8">
            <PostForm
              postContent={postContent}
              setPostContent={setPostContent}
              handlePostSubmit={handlePostSubmit}
              handleImageUpload={handleImageUpload}
              isLoading={isLoading}
              postImage={postImage}
            />
            {isLoadingPosts ? (
              <LoadingOutlined className="d-flex justify-content-center display-1 p-5 text-primary" />
            ) : (
              <PostList
                posts={userPosts}
                setShowDeleteModal={setShowDeleteModal}
              />
            )}
          </div>
          {/* <pre>{JSON.stringify(userPosts, null, 4)}</pre> */}
          <div className="col-md-4">
            <PeopleList people={suggestedPeople} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Modal
              title="Warning!"
              visible={showDeleteModal}
              onCancel={() => setShowDeleteModal(false)}
              onOk={() => handlePostDelete(showDeleteModal)}
              okButtonProps={{ type: "danger" }}
              okText="Delete"
            >
              <h2> Are you sure?</h2>
              <p>
                <strong>
                  Do you really want to delete this post? This process cannot be
                  undone.
                </strong>
              </p>
            </Modal>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}

export default Dashboard;

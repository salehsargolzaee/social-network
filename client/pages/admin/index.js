import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import { LoadingOutlined } from "@ant-design/icons";
import DeleteModal from "../../components/modals/DeleteModal";
import renderHTML from "react-render-html";
import PostImage from "../../components/images/PostImage";

function Admin() {
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);

  const [userPosts, setUserPosts] = useState([]);

  // if modal showing the value of this state will be {post:_id } of target post
  // or {comment:_id} of target comment
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // loading spinner for post fetching delay
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const newsFeed = async () => {
    setIsLoadingPosts(true);
    try {
      const { data } = await axios.get(`/admin/posts/`);
      setUserPosts(data);
      setIsLoadingPosts(false);
    } catch (error) {
      console.log("Error in loading admin's newsfeed =>", error);
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (loggedUser && loggedUser.token) {
      newsFeed();
    }
    return () => {
      setUserPosts([]);
    };
  }, [loggedUser && loggedUser.token]);

  const handlePostDelete = async ({ postId: id }) => {
    setShowDeleteModal(false);
    try {
      const { data } = await axios.delete(`/admin/delete-post/${id}`);

      if (loggedUser && loggedUser.token) newsFeed();
      toast.success("Successfully deleted the post.");
    } catch (error) {
      console.log("error in post deletion =>", error);
      toast.error("An error happened!!");
    }
  };

  return (
    <AdminRoute>
      <div className="container-fluid container-custom">
        <div className="row bg-default-image py-5 text-ligth box-shadow">
          <div className="col text-center">
            <h1 style={{ color: "white" }}>Admin</h1>
          </div>
        </div>
        <div className="row py-4">
          <div className="col-md-8 offset-md-2 ">
            {isLoadingPosts ? (
              <div className="text-center">
                <LoadingOutlined
                  style={{ fontSize: "40px", marginTop: "2rem" }}
                />
              </div>
            ) : (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="d-flex justify-content-between my-3"
                  style={{
                    backgruondColor: "white",
                    padding: "2rem",
                    border: "1px solid black",
                    borderRadius: "25px",
                  }}
                >
                  <div>
                    <b>{post.postedBy.name}</b>
                    {renderHTML(post.content)}
                  </div>

                  <span
                    onClick={() => setShowDeleteModal({ postId: post._id })}
                    className="text-danger"
                  >
                    {" "}
                    <div className="d-flex justify-content-between">
                      {" "}
                      {post && post.image && post.image.url && (
                        <div className="mx-4" style={{ width: "60px" }}>
                          <PostImage src={post.image.url} height="60px" />
                        </div>
                      )}{" "}
                      <span
                        style={{
                          position: "relative",
                          bottom: "-19px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </span>
                    </div>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDelete={handlePostDelete}
        />
      </div>
    </AdminRoute>
  );
}

export default Admin;

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import axios from "axios";
import UserRoute from "../../components/routes/UserRoute";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import DeleteModal from "../../components/modals/DeleteModal";
import CommentModal from "../../components/modals/CommentModal";
import { Dropdown, Button, Menu } from "antd";
import Link from "next/link";
import { DownOutlined } from "@ant-design/icons";

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Link href="/user/profile/update">Profile</Link>
    </Menu.Item>

    <Menu.Item key="2">
      <Link href="/user/dashboard">Dashboard</Link>
    </Menu.Item>

    <Menu.Item key="3">
      <Link href="/">Home</Link>
    </Menu.Item>
  </Menu>
);
function PostComments() {
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);
  const router = useRouter();
  const _id = router.query._id;
  const [post, setPost] = useState({});

  // if modal showing the value of this state will be _id of target post
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comment, setComment] = useState({
    targetPost: "",
    commentContent: "",
  });
  // comment modal visibility
  const [showCommentModal, setShowCommentModal] = useState(false);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
    } catch (error) {
      console.log(error.response.data);
      toast.error("Error in fetching post");
    }
  };
  useEffect(() => {
    if (_id && loggedUser && loggedUser.token) fetchPost();
  }, [_id && loggedUser && loggedUser.token]);

  const handlePostDelete = async (id) => {
    setShowDeleteModal(false);
    try {
      const { data } = await axios.delete(`/delete-post/${id}`);
      if (loggedUser && loggedUser.token) router.push("/user/dashboard");
      toast.success("Successfully deleted the post.");
    } catch (error) {
      console.log("error in post deletion =>", error);
    }
  };

  const handleLikeAndUnlike = async (postId, action) => {
    // console.log("Like =>", postId);
    try {
      const { data } = await axios.put(`/${action}-post`, { _id: postId });

      setPost((prev) => ({ ...prev, likes: data }));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const handleComment = (post) => {
    setComment((prev) => ({ ...prev, targetPost: post }));
    setShowCommentModal(true);
  };
  const sendComment = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        postId: comment.targetPost._id,
        comment: comment.commentContent,
      });

      console.log(data);
      setShowCommentModal(false);
      setComment({
        targetPost: "",
        commentContent: "",
      });
      setPost((prev) => ({ ...prev, comments: data.comments }));
      toast.success("Successfully added the comment");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
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
        <div className="col-md-8 offset-md-2">
          {post && post.postedBy && (
            <PostList
              posts={[post]}
              setShowDeleteModal={setShowDeleteModal}
              handleLikeAndUnlike={handleLikeAndUnlike}
              handleComment={handleComment}
              commentCount={100}
            />
          )}
          <DeleteModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDelete={handlePostDelete}
          />
          <CommentModal
            showCommentModal={showCommentModal}
            setShowCommentModal={setShowCommentModal}
            comment={comment}
            setComment={setComment}
            sendComment={sendComment}
          />
          <div className="d-flex justify-content-center m-2 pb-2">
            <Dropdown overlay={menu}>
              <Button>
                Go to <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}

export default PostComments;

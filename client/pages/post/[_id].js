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

  const handlePostDelete = async ({ postId: id }) => {
    setShowDeleteModal(false);
    try {
      const { data } = await axios.delete(`/delete-post/${id}`);
      if (data.err) {
        toast.error(data.err);
      } else {
        if (loggedUser && loggedUser.token) newsFeed();
        toast.success("Successfully deleted the post.");
      }
    } catch (error) {
      console.log("error in post deletion =>", error);
    }
  };

  const handleCommentDelete = async ({ postId, commentId }) => {
    setShowDeleteModal(false);
    try {
      const { data } = await axios.put(`/delete-comment`, {
        postId,
        commentId,
      });

      if (data.err) {
        toast.error(data.err);
      } else {
        setPost((prev) => ({ ...prev, comments: data }));

        toast.success("Successfully deleted comment.");
      }
    } catch (error) {
      console.log("error in comment deletion=> ", error);
      toast.error("Something went wrong, please try again later.");
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
      <div className="row container-fluid container-custom">
        <div className="col-md-8 offset-md-2" style={{ marginTop: "4rem" }}>
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
            handleDelete={
              showDeleteModal.commentId ? handleCommentDelete : handlePostDelete
            }
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

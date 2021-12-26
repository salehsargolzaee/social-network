import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import { Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import PeopleList from "../../components/cards/PeopleList";
import DeleteModal from "../../components/modals/DeleteModal";
import CommentModal from "../../components/modals/CommentModal";
import Search from "../../components/Search";
import io from "socket.io-client";
import UserCard from "../../components/cards/UserCard";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

function Dashboard() {
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);

  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [comment, setComment] = useState({
    targetPost: "",
    commentContent: "",
  });

  const [suggestedPeople, setSuggestedPeople] = useState([]);

  // if modal showing the value of this state will be {post:_id } of target post
  // or {comment:_id} of target comment
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // comment modal visibility
  const [showCommentModal, setShowCommentModal] = useState(false);

  // loading spinner for image uploading delay
  const [isLoading, setIsLoading] = useState(false);

  // loading spinner for post fetching delay
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);

  // total posts in database for pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const router = useRouter();

  const newsFeed = async () => {
    setIsLoadingPosts(true);
    try {
      const { data } = await axios.get(`/news-feed/${pageNumber}`);
      setUserPosts(data);
      setIsLoadingPosts(false);
    } catch (error) {
      console.log(error);
      toast.error("Error in loading newsFeed");
      setIsLoadingPosts(false);
    }
  };

  const findPeople = async () => {
    setIsLoadingPeople(true);
    try {
      const { data } = await axios.get("/find-people");
      setSuggestedPeople(data);
      setIsLoadingPeople(false);
    } catch (err) {
      console.log(err);
      setIsLoadingPeople(false);
    }
  };

  useEffect(() => {
    if (loggedUser && loggedUser.token) {
      newsFeed();
      findPeople();
    }
    return () => {
      setUserPosts([]);
      setSuggestedPeople([]);
    };
  }, [loggedUser && loggedUser.token, pageNumber]);

  useEffect(() => {
    if (loggedUser && loggedUser.token) {
      axios
        .get("/total-posts")
        .then(({ data }) => setTotalPosts(data))
        .catch((error) => {
          console.log("Can't get total posts number =>", error);
        });
    }
  }, [loggedUser && loggedUser.token]);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/create-post", {
        postContent,
        postImage,
      });
      // console.log("Post creation response => ", data);
      toast.success("Successfully created the post.");
      setPostContent("");
      setPostImage({});
      newsFeed();
      setPageNumber(1);
      socket.emit("new-post", data);
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
      // console.log("Uploaded image data => ", data);
      setPostImage({ url: data.url, public_id: data.public_id });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

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
        setUserPosts(
          userPosts.map((item) => {
            if (item._id === postId) {
              return { ...item, comments: data };
            }
            return item;
          })
        );

        toast.success("Successfully deleted comment.");
      }
    } catch (error) {
      console.log("error in comment deletion=> ", error);
      toast.error("Something went wrong, please try again later.");
    }
  };

  const handleFollow = async (user) => {
    // console.log("Want to follow this user =>", userId);
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });

      // console.log(data);

      // update user in local storage
      const auth = JSON.parse(window.localStorage.getItem("auth"));
      auth.user = data;
      window.localStorage.setItem("auth", JSON.stringify(auth));

      // update context
      setLoggedUser((prev) => ({ ...prev, user: data }));

      // remove followed user from suggestion list
      setSuggestedPeople(
        suggestedPeople.filter((person) => person._id !== user._id)
      );

      // rerender posts
      newsFeed();

      toast.success(`You have followed ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeAndUnlike = async (postId, action) => {
    // console.log("Like =>", postId);
    try {
      const { data } = await axios.put(`/${action}-post`, { _id: postId });

      setUserPosts(
        userPosts.map((item) => {
          if (item._id === postId) {
            return { ...item, likes: data };
          }
          return item;
        })
      );
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

      // console.log(data);
      setShowCommentModal(false);
      setComment({
        targetPost: "",
        commentContent: "",
      });
      setUserPosts(
        userPosts.map((item) => {
          if (item._id === data.postId) {
            return { ...item, comments: data.comments };
          }
          return item;
        })
      );
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
            <h1 style={{ color: "white" }}>
              {loggedUser &&
                loggedUser.user &&
                `Welcome Back, ${loggedUser.user["name"]}`}
            </h1>
          </div>
        </div>

        <div className="row py-3 ">
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
                handleLikeAndUnlike={handleLikeAndUnlike}
                handleComment={handleComment}
              />
            )}
            <div className="d-flex justify-content-center mb-2">
              <Pagination
                defaultCurrent={pageNumber}
                current={pageNumber}
                pageSize={4}
                total={totalPosts}
                onChange={(value) => setPageNumber(value)}
              />
            </div>
          </div>
          {/* <pre>{JSON.stringify(userPosts, null, 4)}</pre> */}
          <div className="col-md-4 ">
            {loggedUser && loggedUser.user && (
              <div className="mb-2 border">
                <UserCard user={loggedUser.user} showPhoto={false} />
              </div>
            )}
            <div
              className="sticky card p-4"
              style={{ maxHeight: "700px", overflow: "auto" }}
            >
              <Search handleFollow={handleFollow} />
              {isLoadingPeople ? (
                <LoadingOutlined
                  className="d-flex justify-content-center  p-5 text-primary"
                  style={{ fontSize: "15px" }}
                />
              ) : (
                <PeopleList
                  people={suggestedPeople}
                  handleFollow={handleFollow}
                  followStatus="dashboard"
                />
              )}
            </div>
          </div>
        </div>
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
      </div>
    </UserRoute>
  );
}

export default Dashboard;

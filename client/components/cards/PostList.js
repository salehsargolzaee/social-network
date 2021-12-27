import moment from "moment";
import { Avatar } from "antd";
import renderHTML from "react-render-html";
import PostImage from "../images/PostImage";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import Link from "next/link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { toast } from "react-toastify";
import Aos from "aos";
import "aos/dist/aos.css";

function PostList({
  posts,
  setShowDeleteModal,
  handleLikeAndUnlike,
  handleComment,
  commentCount = 3,
  disable = true,
}) {
  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();
  const [commentCountStyle, setCommentCountStyle] = useState({
    position: "relative",
    top: "2.5px",
    fontSize: "13px",
    color: "#6C757D",
  });
  useEffect(() => {
    Aos.init({
      disable,
    });
  }, []);

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div
            key={post._id}
            data-aos="fade-zoom-in"
            data-aos-offset="40"
            data-aos-easing="ease-in-sine"
            data-aos-duration="380"
            className={commentCount ? "card my-4" : "card-shadow card my-4"}
          >
            <div className="card-header d-flex align-items-center justify-content-between">
              <span>
                <Avatar
                  size={40}
                  className="m-1"
                  src={
                    post &&
                    post.postedBy &&
                    post.postedBy.photo &&
                    post.postedBy.photo.url
                  }
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#577594" }}
                />
                <Link href={`/user/${post.postedBy.username}`}>
                  <a className="m-1 ">{post.postedBy.name}</a>
                </Link>
              </span>
              <span className="text-muted" style={{ fontSize: "12px" }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className="card-body">
              {post.image ? (
                <PostImage
                  src={post.image.url}
                  height={commentCount ? "500px" : "300px"}
                />
              ) : (
                renderHTML(post.content)
              )}
            </div>
            <div className="card-footer">
              {post.image && renderHTML(post.content)}

              <div className="d-flex align-items-center justify-content-between">
                <span>
                  {loggedUser &&
                  loggedUser.user._id &&
                  post.likes.includes(loggedUser.user._id) ? (
                    <HeartFilled
                      onClick={() => {
                        if (loggedUser && loggedUser.token) {
                          if (!commentCount) {
                            router.push(`/post/${post._id}`);
                          } else {
                            handleLikeAndUnlike(post._id, "unlike");
                          }
                        } else {
                          toast.info("Please login first");
                        }
                      }}
                      className="text-danger pt-3 h5 me-2 pb-1 "
                    />
                  ) : (
                    <HeartOutlined
                      onClick={() => {
                        if (loggedUser && loggedUser.token) {
                          if (!commentCount) {
                            router.push(`/post/${post._id}`);
                          } else {
                            handleLikeAndUnlike(post._id, "like");
                          }
                        } else {
                          toast.info("Please login first");
                        }
                      }}
                      className="text-danger pt-3 h5 me-2 pb-1 "
                    />
                  )}

                  <span
                    style={{
                      position: "relative",
                      top: "2.5px",
                      fontSize: "13px",
                    }}
                    className="text-muted"
                  >
                    {post.likes.length} Likes
                  </span>

                  <CommentOutlined
                    onClick={() => {
                      if (loggedUser && loggedUser.token) {
                        if (!commentCount) {
                          router.push(`/post/${post._id}`);
                        } else {
                          handleComment(post);
                        }
                      } else {
                        toast.info("Please login first");
                      }
                    }}
                    className="pt-3 ps-3 h5 me-2"
                  />
                  <Link href={`/post/${post._id}`}>
                    <a
                      style={commentCountStyle}
                      // className="text-muted"
                      onMouseEnter={() =>
                        setCommentCountStyle((prev) => ({
                          ...prev,
                          color: "black",
                        }))
                      }
                      onMouseLeave={() =>
                        setCommentCountStyle((prev) => ({
                          ...prev,
                          color: "#6C757D",
                        }))
                      }
                    >
                      {post.comments.length} Comments
                    </a>
                  </Link>
                </span>
                {loggedUser &&
                  loggedUser.user &&
                  loggedUser.user._id == post.postedBy._id && (
                    <span>
                      <EditOutlined
                        onClick={() => router.push(`/user/post/${post._id}`)}
                        className="h5"
                      />
                      <DeleteOutlined
                        onClick={() => {
                          if (commentCount)
                            setShowDeleteModal({ postId: post._id });
                          else router.push(`/post/${post._id}`);
                        }}
                        className="ms-3 h5"
                      />
                    </span>
                  )}
              </div>
            </div>
            {/* Show some of commnets */}
            {post.comments && post.comments.length > 0 && (
              <div
                className="list-group"
                style={{
                  maxHeight: "150px",
                  overflow: "auto",
                }}
              >
                {post.comments.slice(0, commentCount).map((comment) => (
                  <span key={comment._id} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <span>
                        <Avatar
                          src={
                            comment.postedBy &&
                            comment.postedBy.photo &&
                            comment.postedBy.photo.url
                          }
                          icon={<UserOutlined />}
                          size={28}
                          style={{ backgroundColor: "#577594" }}
                        />
                        <p
                          className="mb-1 ms-2"
                          style={{ display: "inline-block" }}
                        >
                          {comment.postedBy.name}
                        </p>
                      </span>

                      <small className="text-muted mt-1">
                        {moment(comment.created).fromNow()}
                      </small>
                    </div>
                    <div
                      className="d-flex w-100 justify-content-between"
                      style={{ wordBreak: "break-all" }}
                    >
                      <p className="mb-1" style={{ marginLeft: "2.3rem" }}>
                        {comment.text}
                      </p>
                      {loggedUser &&
                        loggedUser.user &&
                        loggedUser.user._id == comment.postedBy._id && (
                          <span>
                            <DeleteOutlined
                              onClick={() =>
                                setShowDeleteModal({
                                  postId: post._id,
                                  commentId: comment._id,
                                })
                              }
                              className="ms-3 h5"
                              style={{ fontSize: "16px" }}
                            />
                          </span>
                        )}
                    </div>
                  </span>
                ))}
                {post.comments.length > 3 && commentCount === 3 && (
                  <div className="list-group-item d-flex justify-content-center">
                    <Link href={`/post/${post._id}`}>
                      <a>
                        <MoreHorizIcon /> All comments
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </>
  );
}

export default PostList;

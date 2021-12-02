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
import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import Link from "next/link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function PostList({
  posts,
  setShowDeleteModal,
  handleLikeAndUnlike,
  handleComment,
  commentCount = 5,
}) {
  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();
  const [commentCountStyle, setCommentCountStyle] = useState({
    position: "relative",
    top: "2.5px",
    fontSize: "13px",
    color: "#6C757D",
  });

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card my-4">
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
                <span className="m-1 ">{post.postedBy.name}</span>
              </span>
              <span className="text-muted" style={{ fontSize: "12px" }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className="card-body">
              {post.image ? (
                <PostImage src={post.image.url} />
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
                        handleLikeAndUnlike(post._id, "unlike");
                      }}
                      className="text-danger pt-3 h5 me-2 pb-1 "
                    />
                  ) : (
                    <HeartOutlined
                      onClick={() => {
                        handleLikeAndUnlike(post._id, "like");
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
                    onClick={() => handleComment(post)}
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
                        onClick={() => setShowDeleteModal({ postId: post._id })}
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
                  maxHeight: "140px",
                  overflow: "scroll",
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
                {post.comments.length > 2 && commentCount === 5 && (
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

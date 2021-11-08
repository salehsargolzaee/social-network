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
} from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";

function PostList({ posts, setShowDeleteModal }) {
  const { state: loggedUser } = useContext(UserContext);
  const router = useRouter();
  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card my-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <span>
                <Avatar size={40} className="m-1">
                  {post.postedBy.name[0].toUpperCase()}
                </Avatar>
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
                  <HeartOutlined className="text-danger pt-3 h5" />
                  <CommentOutlined className="pt-3 ps-3 h5" />
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
                        onClick={() => setShowDeleteModal(post._id)}
                        className="ms-3 h5"
                      />
                    </span>
                  )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default PostList;

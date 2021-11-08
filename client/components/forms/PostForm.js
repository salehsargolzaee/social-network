import { Avatar } from "antd";
import { CameraFilled, LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// should import it dynamically because next works both on
//client and server side and quill is only on client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const regex = /(<([^>]+)>)/gi;

function CreatePostForm({
  postContent,
  setPostContent,
  handlePostSubmit,
  handleImageUpload,
  isLoading,
  postImage,
}) {
  return (
    <div className="card">
      <div className="card-body ">
        <form>
          <ReactQuill
            theme="snow"
            value={postContent}
            onChange={(event) => setPostContent(event)}
            placeholder="Write what is on your mind..."
          />
        </form>
      </div>

      <div className="card-footer d-flex justify-content-between text-muted">
        <button
          className="btn btn-primary btn-sm"
          onClick={handlePostSubmit}
          disabled={!postContent.replace(regex, "").length || isLoading}
        >
          Post it!
        </button>
        <label>
          {isLoading ? (
            <LoadingOutlined />
          ) : postImage && postImage.url ? (
            <Avatar src={postImage.url} />
          ) : (
            <CameraFilled
              style={{ fontSize: "21px", marginTop: "50%", marginRight: "20%" }}
            />
          )}
          <input
            onChange={handleImageUpload}
            type="file"
            accept="image/*"
            hidden
          />
        </label>
      </div>
    </div>
  );
}

export default CreatePostForm;

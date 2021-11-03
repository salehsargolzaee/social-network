import { Avatar } from "antd";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// should import it dynamically because next works both on
//client and server side and quill is only on client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function CreatePostForm({ postContent, setPostContent, handlePostSubmit }) {
  return (
    <div className="card">
      <div className="card-body">
        <form>
          <ReactQuill
            theme="snow"
            value={postContent}
            onChange={(event) => setPostContent(event)}
            placeholder="Write what is on your mind..."
          />
        </form>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-primary btn-sm"
          onClick={handlePostSubmit}
          disabled={!postContent.length}
        >
          Post it!
        </button>
      </div>
    </div>
  );
}

export default CreatePostForm;

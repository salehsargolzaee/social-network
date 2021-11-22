import { Modal } from "antd";
function CommentModal({
  showCommentModal,
  setShowCommentModal,
  comment,
  setComment,
  sendComment,
}) {
  return (
    <Modal
      title="Comment"
      visible={showCommentModal}
      onCancel={() => {
        setShowCommentModal(false);
        setComment({
          targetPost: "",
          commentContent: "",
        });
      }}
      okText="Comment"
      okButtonProps={{
        form: "modal-form",
        key: "submit",
        htmlType: "submit",
      }}
    >
      <form
        id="modal-form"
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
        onSubmit={sendComment}
      >
        <input
          value={comment.commentContent}
          onChange={(event) => {
            setComment((prev) => ({
              ...prev,
              commentContent: event.target.value,
            }));
          }}
          type="text"
          className="form-control"
          placeholder="Add a comment..."
        />
        {/* <label
        className="blockquote-footer form-label"
        style={{ fontSize: "10px" }}
      >
        Please keep it simple and short
      </label> */}
      </form>
    </Modal>
  );
}

export default CommentModal;

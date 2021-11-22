import { Modal } from "antd";
function DeleteModal({ showDeleteModal, setShowDeleteModal, handleDelete }) {
  return (
    <Modal
      title="Warning!"
      visible={showDeleteModal}
      onCancel={() => setShowDeleteModal(false)}
      onOk={() => handleDelete(showDeleteModal)}
      okButtonProps={{ type: "danger" }}
      okText="Delete"
    >
      <h2> Are you sure?</h2>
      <p>
        <strong>
          Do you really want to delete this post? This process cannot be undone.
        </strong>
      </p>
    </Modal>
  );
}

export default DeleteModal;

import { LoadingOutlined } from "@ant-design/icons";

const autoComp = "off";

function ForgotPasswordForm({
  userInformation,
  email,
  handleSubmitAnswer,
  handleSubmitEmail,
  handleChange,
  loading,
}) {
  const findQuestion = userInformation.question !== "";
  return (
    <form onSubmit={findQuestion ? handleSubmitAnswer : handleSubmitEmail}>
      {!findQuestion && (
        <div className="my-3">
          <label className="text-muted form-label">Email address</label>
          <input
            name="email"
            value={email}
            onChange={handleChange}
            type="email"
            className="form-control"
            placeholder="Please enter your email address"
            autoComplete={autoComp}
          />
        </div>
      )}
      {findQuestion && (
        <>
          <div className="mb-3">
            <label className="text-muted form-label">
              {userInformation.question}
            </label>
            <input
              name="answer"
              value={userInformation.answer}
              onChange={handleChange}
              type="text"
              className="form-control"
              placeholder="Enter your answer"
              autoComplete={autoComp}
            ></input>
          </div>
          <div className="mb-3">
            <label className="text-muted form-label">New password</label>
            <input
              name="newPassword"
              value={userInformation.newPassword}
              onChange={handleChange}
              type="password"
              className="form-control"
              placeholder="Enter your new password"
              autoComplete={autoComp}
            />
          </div>
        </>
      )}
      <button
        disabled={
          findQuestion ? !userInformation.answer || loading : !email || loading
        }
        className="btn btn-primary btn-block col-12"
      >
        {loading ? (
          <LoadingOutlined className="py-2" style={{ fontSize: "20px" }} />
        ) : findQuestion ? (
          "Change Password"
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}

export default ForgotPasswordForm;

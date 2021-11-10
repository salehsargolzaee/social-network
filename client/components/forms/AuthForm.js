import { LoadingOutlined } from "@ant-design/icons";

const autoComp = "off";

function AuthForm({
  userInformation,
  handleSubmit,
  handleChange,
  handleDisable,
  loading,
  pageKind,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {pageKind === "profile" && (
        <>
          <div className="mb-3">
            <label className="text-muted form-label">Username</label>
            <input
              name="username"
              value={userInformation.username}
              onChange={handleChange}
              type="text"
              className="form-control"
              placeholder="Enter your username"
              autoComplete={autoComp}
            />
          </div>
          <div className="mb-3">
            <label className="text-muted form-label">About</label>
            <input
              name="about"
              value={userInformation.about}
              onChange={handleChange}
              type="text"
              className="form-control"
              placeholder="Tell us about yourself"
              autoComplete={autoComp}
            />
          </div>
        </>
      )}

      {pageKind !== "login" && (
        <div className="mb-3">
          <label className="text-muted form-label">Your name</label>
          <input
            name="name"
            value={userInformation.name}
            onChange={handleChange}
            type="text"
            className="form-control"
            placeholder="Enter your name"
            autoComplete={autoComp}
          />
        </div>
      )}
      <div className={pageKind !== "login" ? "mb-3" : "my-3"}>
        <label className="text-muted form-label">Email address</label>
        <input
          name="email"
          value={userInformation.email}
          onChange={handleChange}
          type="email"
          className="form-control"
          placeholder="Enter your email address"
          autoComplete={autoComp}
          disabled={pageKind === "profile"}
        />
      </div>
      <div className="mb-3">
        <label className="text-muted form-label">Password</label>
        <input
          name="password"
          value={userInformation.password}
          onChange={handleChange}
          type="password"
          className="form-control"
          placeholder="Enter your password"
          autoComplete={autoComp}
        />
        {pageKind === "profile" && (
          <small className="form-text text-muted">
            *Your password is required in order to set new password or new
            security question
          </small>
        )}
      </div>

      {pageKind === "profile" && (
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
            disabled={
              !userInformation.password || userInformation.password.length < 6
            }
          />
        </div>
      )}
      {pageKind !== "login" && (
        <>
          <div className="pt-3 mb-3">
            <label className="mb-2 text-muted form-label">
              Please answer one of the following questions.
            </label>
            <select
              className="form-control"
              name="question"
              onChange={handleChange}
              value={userInformation.question}
              disabled={
                pageKind === "profile" &&
                (!userInformation.password ||
                  userInformation.password.length < 6)
              }
            >
              <option>What is your best friend's name ?</option>
              <option>What is your favourite book ?</option>
              <option>What is the name of your favourite city ?</option>
            </select>
            <small className="form-text text-muted">
              You can answer this question to reset your password if forgotten.
            </small>
          </div>
          <div className="mb-3">
            <input
              name="answer"
              value={userInformation.answer}
              onChange={handleChange}
              type="text"
              className="form-control"
              placeholder="Enter your answer"
              autoComplete={autoComp}
              disabled={
                pageKind === "profile" &&
                (!userInformation.password ||
                  userInformation.password.length < 6)
              }
            ></input>
          </div>
        </>
      )}
      <button
        disabled={handleDisable()}
        className="btn btn-primary btn-block col-12"
      >
        {loading ? (
          <LoadingOutlined className="py-2" style={{ fontSize: "20px" }} />
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}

export default AuthForm;

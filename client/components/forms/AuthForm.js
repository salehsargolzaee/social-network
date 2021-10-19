import { LoadingOutlined } from "@ant-design/icons";

const autoComp = "off";

function AuthForm({
  userInformation,
  handleSubmit,
  handleChange,
  handleDisable,
  loading,
}) {
  return (
    <form onSubmit={handleSubmit}>
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
      <div className="mb-3">
        <label className="text-muted form-label">Email address</label>
        <input
          name="email"
          value={userInformation.email}
          onChange={handleChange}
          type="email"
          className="form-control"
          placeholder="Enter your email address"
          autoComplete={autoComp}
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
          placeholder="Enter your name"
          autoComplete={autoComp}
        />
      </div>

      <div className="pt-5 mb-3">
        <label className="mb-2 text-muted form-label">
          Please answer one of the following questions.
        </label>
        <select className="form-control">
          <option>What is your best friend's name ?</option>
          <option>What is your favourite book ?</option>
          <option>What is your lucky number ?</option>
        </select>
        <small className="form-text text-muted">
          You can answer this question to reset your password if forgotten.
        </small>
      </div>
      <div className="mb-2">
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

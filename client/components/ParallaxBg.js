function ParallaxBg({ url, children }) {
  return (
    <div
      className="container-fluid "
      style={{
        backgroundImage: `linear-gradient(
        rgba(176, 204, 246, 0.4),
        rgba(138, 138, 138, 0.3)
        ),url(${url})`,
        backgroundAttachment: "fixed",
        padding: "100px 0 75px",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "40vh",
        backgroundPositionY: "275%",
        display: "block",
      }}
    >
      {children}
    </div>
  );
}

export default ParallaxBg;

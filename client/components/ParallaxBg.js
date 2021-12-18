function ParallaxBg({ url, children }) {
  return (
    <div
      className="container-fluid "
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 150, 0.3), rgba(24, 118, 209, 0)),url(${url})`,
        backgroundAttachment: "fixed",
        padding: "100px 0 75px",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "80vh",
        backgroundPositionY: "20%",
        display: "block",
        backdropFilter: "blur(100px)",
      }}
    >
      {children}
    </div>
  );
}

export default ParallaxBg;

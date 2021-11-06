function PostImage({ src }) {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        textAlign: "center",
        height: "500px",
        margin: "auto",
      }}
    />
  );
}

export default PostImage;

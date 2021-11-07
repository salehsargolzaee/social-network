function PostImage({ src }) {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        height: "500px",
      }}
    />
  );
}

export default PostImage;

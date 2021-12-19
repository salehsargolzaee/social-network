function PostImage({ src, height }) {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        height: height,
      }}
    />
  );
}

export default PostImage;

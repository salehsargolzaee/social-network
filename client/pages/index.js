import { useContext } from "react";
import ParallaxBg from "../components/ParallaxBg";
import PostList from "../components/cards/PostList";
import { UserContext } from "../context/index";
import axios from "axios";

function Home({ posts }) {
  // const { state, setState } = useContext(UserContext);

  return (
    <div className="container-custom">
      <ParallaxBg url="/images/default.jpg">
        <h1
          style={{
            color: "#4A6984",
            textShadow: "2px 2px 9px #ffffff",
          }}
          className="display-1  text-center logo-name"
        >
          IRIS
        </h1>
        {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
      </ParallaxBg>
      <div className="container">
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-6">
              {" "}
              <PostList posts={[post]} commentCount={0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { data } = await axios.get("/posts");
  // console.log(data);

  return {
    props: { posts: data },
  };
}

export default Home;

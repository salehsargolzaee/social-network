import { useContext } from "react";
import ParallaxBg from "../components/ParallaxBg";
import PostList from "../components/cards/PostList";
import { UserContext } from "../context/index";
import axios from "axios";
import { useRouter } from "next/router";

function Home({ posts }) {
  const router = useRouter();

  return (
    <div className="container-custom">
      <ParallaxBg url="/images/default.jpg">
        <div className="text-center pt-3">
          <h1
            style={{
              // color: "#4A6984",
              color: "#F3F6F7",
              textShadow: "2px 2px 9px #ffffff",
              fontSize: "18vh",
            }}
            className="display-1 text-center logo-name pt-4"
          >
            IRIS
          </h1>
          <h3
            style={{
              position: "relative",
              top: "-50px",
              color: "#F3F6F7",
              fontSize: "2.1vh",
            }}
          >
            share the joy with others
          </h3>
          <div
            className="btn btn-md btn-outline-light mx-4 px-4"
            onClick={() => router.push("/login")}
          >
            Login
          </div>
          <div
            className="btn btn-md me-4 btn-outline-light"
            onClick={() => router.push("/register")}
          >
            Register
          </div>
        </div>
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

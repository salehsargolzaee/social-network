import { useContext, useEffect, useState } from "react";
import ParallaxBg from "../components/ParallaxBg";
import PostList from "../components/cards/PostList";
import { UserContext } from "../context/index";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import io from "socket.io-client";
import {
  GithubOutlined,
  LinkedinFilled,
  MailOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

function Home({ posts }) {
  const router = useRouter();
  const { state: loggedUser } = useContext(UserContext);
  const [allPosts, setAllPosts] = useState(posts);
  const [anchorColor, setAnchorColor] = useState({
    git: "white",
    link: "white",
    gmail: "white",
  });
  useEffect(() => {
    // console.log("socketIo =>", socket);
    socket.on("new-post", (newPost) => {
      setAllPosts((prev) =>
        prev.length === 12
          ? [newPost, ...prev.slice(0, prev.length - 1)]
          : [newPost, ...prev]
      );
    });
  }, []);

  const head = () => {
    return (
      <Head>
        <title>Iris - a simple social network </title>
        <meta
          name="description"
          content="A simple social network using MongoDb, Express, NodeJs and NextJs by Saleh Sargolzaee"
        />
        <meta
          property="og:description"
          content="A simple social network using MongoDb, Express, NodeJs and NextJs by Saleh Sargolzaee"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IRIS" />
        <meta property="og:url" content="http://iris.com" />
        <meta
          property="og:image:secure_url"
          content="http://iris.com/images/default.jpg"
        />
      </Head>
    );
  };
  return (
    <>
      {head()}
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
            {loggedUser && loggedUser.token ? (
              <div
                className="btn btn-md btn-outline-light mx-4 px-5 py-2"
                onClick={() => router.push("/user/dashboard")}
              >
                Share a post
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
          {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
        </ParallaxBg>
        <div className="container">
          <div className="row">
            {allPosts.map((post) => (
              <div key={post._id} className="col-lg-4 col-md-6">
                {" "}
                <PostList posts={[post]} commentCount={0} disable={false} />
              </div>
            ))}
          </div>
        </div>
        <div
          className="container-fluid text-center text-light"
          style={{
            background:
              "linear-gradient(0deg, rgba(112, 144, 198, 0.7), rgba(192, 195, 211, 0.8))",
            // backgroundColor: "#5F8BC2",
            padding: "5% 10%",
            marginTop: "2%",
          }}
        >
          <div style={{ fontSize: "1.2rem" }} className="pb-4">
            <a
              href="https://github.com/salehsargolzaee"
              onMouseEnter={() =>
                setAnchorColor((prev) => ({ ...prev, git: "black" }))
              }
              onMouseLeave={() =>
                setAnchorColor((prev) => ({ ...prev, git: "white" }))
              }
              style={{ color: anchorColor.git }}
              target="_blank"
            >
              <GithubOutlined className="px-2" />
            </a>
            <a
              href="https://www.linkedin.com/in/saleh-sargolzaee-819ba119a/"
              onMouseEnter={() =>
                setAnchorColor((prev) => ({ ...prev, link: "#5677ad" }))
              }
              onMouseLeave={() =>
                setAnchorColor((prev) => ({ ...prev, link: "white" }))
              }
              style={{ color: anchorColor.link }}
              target="_blank"
            >
              <LinkedinFilled className="px-2" />
            </a>
            <a
              href="mailto:salehsargolzaee@gmail.com"
              onMouseEnter={() =>
                setAnchorColor((prev) => ({ ...prev, gmail: "#CA3A2E" }))
              }
              onMouseLeave={() =>
                setAnchorColor((prev) => ({ ...prev, gmail: "white" }))
              }
              style={{ color: anchorColor.gmail }}
              target="_blank"
            >
              <MailOutlined className="px-2" />
            </a>
          </div>
          <span>
            Made with{" "}
            <HeartOutlined
              className=" px-1"
              style={{ position: "relative", bottom: "4.5px" }}
            />{" "}
            by Saleh Sargolzaee
          </span>
        </div>
      </div>
    </>
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

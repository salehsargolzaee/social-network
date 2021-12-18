import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { UserContext } from "../context/index";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MenuPopupState from "./MenuPopupState";
import { Avatar } from "antd";

function Nav() {
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("");

  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem("auth");
    setLoggedUser(null);
    router.push("/login");
  };

  useEffect(() => {
    process.browser && setCurrentPage(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        zIndex: "5",
        position: "fixed",
        width: "100%",
      }}
    >
      <AppBar
        position="static"
        style={{ background: "#F3F6F7", color: "#728FC8" }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <a
                className="logo-name"
                style={{
                  fontSize: "22px",
                  color: "#728FC8",

                  fontWeight: "bold",
                }}
              >
                IRIS
              </a>
            </Link>
          </Typography>

          <Link href="/">
            <Button color="inherit" className={currentPage === "/" && "active"}>
              Home
            </Button>
          </Link>

          {!loggedUser ? (
            <>
              <Link href="/login">
                <Button
                  color="inherit"
                  className={currentPage === "/login" && "active"}
                >
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  color="inherit"
                  className={currentPage === "/register" && "active"}
                >
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* <Link href="/user/dashboard">
                <Button
                  color="inherit"
                  className={currentPage === "/user/dashboard" && "active"}
                >
                  {loggedUser && loggedUser.user && loggedUser.user["name"]}
                </Button>
              </Link>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button> */}
              <MenuPopupState
                name={loggedUser && loggedUser.user && loggedUser.user["name"]}
                handleLogout={handleLogout}
                currentPage={currentPage}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Nav;

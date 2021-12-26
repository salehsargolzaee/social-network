import { useRef, useContext, useState } from "react";
import { UserContext } from "../context";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import PeopleList from "../components/cards/PeopleList";
import { toast } from "react-toastify";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useDebounce } from "react-use";

function Search({ handleFollow }) {
  const { state: loggedUser, setState: setLoggedUser } =
    useContext(UserContext);

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [followStatus, setFollowStatus] = useState([]);

  const [iconColor, setIconColor] = useState({
    account: "disabled",
    search: "disabled",
  });

  const buttonRef = useRef();

  useDebounce(
    () => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    },
    100,
    [searchValue]
  );
  const searchForUser = async () => {
    // console.log(`Find ${searchValue} from database`);

    try {
      let { data } = await axios.get(`/user-search/${searchValue}`);
      data = data.filter((usr) => usr.role !== "Admin");
      // console.log("user search response=> ", data);
      if (!data.length) {
        data.push({ notFound: 1 });
        setSearchResult(data);
      } else {
        setSearchResult(data);
        setFollowStatus(
          data.map((person) => {
            if (loggedUser.user.following.includes(person._id)) {
              return "Unfollow";
            } else if (loggedUser.user.followers.includes(person._id)) {
              return "Follow Back";
            } else if (loggedUser.user._id === person._id) {
              return "You";
            } else {
              return "Follow";
            }
          })
        );
      }
    } catch (error) {
      console.log("Error in user search=> ", error);
    }
  };

  const handleUnFollow = async (user) => {
    // console.log("unfollow =>", user);
    try {
      const { data } = await axios.put("/unfollow-user", { _id: user._id });

      const auth = JSON.parse(window.localStorage.getItem("auth"));

      auth.user = data;

      window.localStorage.setItem("auth", JSON.stringify(auth));

      setLoggedUser((prev) => ({ ...prev, user: data }));

      toast.success(`Unfollowed ${user.name}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
    for (let i = 0; i < searchResult.length; i++) {
      if (searchResult[i]["_id"] === user._id) {
        setFollowStatus(
          followStatus.map((status, index) => {
            if (index === i) {
              return loggedUser.user.followers.includes(user._id)
                ? "Follow Back"
                : "Follow";
            } else {
              return status;
            }
          })
        );
        break;
      }
    }
  };
  const handleFollowSearch = (user) => {
    handleFollow(user);
    for (let i = 0; i < searchResult.length; i++) {
      if (searchResult[i]["_id"] === user._id) {
        setFollowStatus(
          followStatus.map((status, index) => {
            if (index === i) {
              return "Unfollow";
            } else {
              return status;
            }
          })
        );
        break;
      }
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "flex-end" }} className="mb-4 ">
        <AccountCircle
          // sx={{ color: "action.active", mr: 1, my: 0.5 }}
          // style={{
          //   /*backgroudColor: "#577594"*/
          // }}
          color={iconColor.account}
        />
        <TextField
          autoComplete="off"
          id="input-with-sx"
          label="User Search"
          variant="filled"
          fullWidth
          onChange={(event) => {
            setSearchValue(event.target.value);
            setSearchResult([]);
          }}
          value={searchValue}
          onFocus={() =>
            setIconColor({ account: "primary", search: "primary" })
          }
          onBlur={() =>
            setIconColor({ account: "disabled", search: "disabled" })
          }
          onKeyDown={(event) => {
            if (searchValue && event.key === "Enter") {
              searchForUser();
            }
          }}
        />
        <button
          ref={buttonRef}
          onClick={searchValue ? searchForUser : null}
          className="bg-transparent border-0"
        >
          <SearchIcon
            style={{
              cursor: "pointer",
              marginBottom: "1px",
              marginRight: "10px",
            }}
            color={iconColor.search}
            onMouseEnter={() => {
              if (searchValue)
                setIconColor((prev) => ({ ...prev, search: "primary" }));
            }}
            onMouseLeave={() => {
              if (iconColor.account === "disabled")
                setIconColor((prev) => ({ ...prev, search: "disabled" }));
            }}
          />
        </button>
      </Box>
      {searchResult.length === 1 && searchResult[0].notFound && (
        <div className="d-flex justify-content-center text-muted">
          <CloseCircleOutlined
            className="pe-2 pb-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSearchResult([]);
              setFollowStatus([]);
            }}
          />
          No User Found
        </div>
      )}
      {searchResult.length != 0 && !searchResult[0].notFound && (
        <>
          <CloseCircleOutlined
            className="ps-1 pb-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSearchResult([]);
              setFollowStatus([]);
            }}
          />

          {searchResult.map((person, index) => (
            <PeopleList
              key={person._id}
              people={[person]}
              handleFollow={
                followStatus[index] !== "Unfollow"
                  ? followStatus[index] === "You"
                    ? null
                    : handleFollowSearch
                  : handleUnFollow
              }
              followStatus={followStatus[index]}
            />
          ))}
          <hr />
        </>
      )}
    </div>
  );
}

export default Search;

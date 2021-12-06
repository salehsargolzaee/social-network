import { userState, useContext, useState } from "react";
import { UserContext } from "../context";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import PeopleList from "../components/cards/PeopleList";

const Options = ["!!", "??"];
function Search() {
  const { state: loggedUser } = useContext(UserContext);

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [iconColor, setIconColor] = useState({
    account: "disabled",
    search: "disabled",
  });

  const searchForUser = async () => {
    // console.log(`Find ${searchValue} from database`);

    try {
      const { data } = await axios.get(`/user-search/${searchValue}`);
      // console.log("user search response=> ", data);
      if (!data.length) {
        data.push({ notFound: 1 });
      }
      setSearchResult(data);
      setSearchValue("");
    } catch (error) {
      console.log("Error in user search=> ", error);
    }
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "flex-end" }} className="mb-4">
        <AccountCircle
          // sx={{ color: "action.active", mr: 1, my: 0.5 }}
          style={{ backgroudColor: "#577594" }}
          color={iconColor.account}
        />
        <TextField
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
          onClick={searchValue ? searchForUser : null}
        />
      </Box>
      {searchResult.length === 1 && searchResult[0].notFound && (
        <div className="d-flex justify-content-center text-muted">
          No User Found
        </div>
      )}
      {searchResult.length != 0 && !searchResult[0].notFound && (
        <PeopleList people={searchResult} />
      )}
    </div>
  );
}

export default Search;

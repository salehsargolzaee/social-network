import { userState, useContext, useState } from "react";
import { UserContext } from "../context";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function Search() {
  const { state: loggedUser } = useContext(UserContext);

  const [searchValue, setSearchValue] = useState("");
  const [iconColor, setIconColor] = useState("disabled");
  const searchForUser = async () => {
    console.log(`Find ${searchValue} from database`);
    try {
      const { data } = await axios.get(`/search-user/${searchValue}`);
      console.log("user search response=> ", data);
    } catch (error) {
      console.log("Error in user search=> ", error);
    }
  };
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }} className="mb-4">
      <AccountCircle
        // sx={{ color: "action.active", mr: 1, my: 0.5 }}
        style={{ backgroudColor: "#577594" }}
        color={iconColor}
      />
      <TextField
        id="input-with-sx"
        label="User Search"
        variant="filled"
        fullWidth
        onChange={(event) => setSearchValue(event.target.value)}
        value={searchValue}
        onFocus={() => setIconColor("primary")}
        onBlur={() => setIconColor("disabled")}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            searchForUser();
          }
        }}
      />
      <SearchIcon
        style={{ cursor: "pointer", marginBottom: "1px", marginRight: "10px" }}
        color={iconColor}
        onClick={searchForUser}
      />
    </Box>
  );
}

export default Search;

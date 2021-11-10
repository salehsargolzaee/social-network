import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";

export default function MenuPopupState({ name, handleLogout, currentPage }) {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            color="primary"
            variant="contained"
            className={
              currentPage === "/user/dashboard"
                ? "active ms-2 mb-1"
                : "ms-2 mb-1"
            }
            {...bindTrigger(popupState)}
          >
            {name} <KeyboardArrowDownIcon />
          </Button>
          <Menu {...bindMenu(popupState)}>
            <Link href="/user/profile/update">
              <MenuItem
                onClick={popupState.close}
                className={
                  currentPage === "/user/profile/update" && "active-popup"
                }
              >
                Profile
              </MenuItem>
            </Link>
            <Link href="/user/dashboard">
              <MenuItem
                onClick={popupState.close}
                className={currentPage === "/user/dashboard" && "active-popup"}
              >
                Dashboard
              </MenuItem>
            </Link>
            <MenuItem
              onClick={() => {
                popupState.close;
                handleLogout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

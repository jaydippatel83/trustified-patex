import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Web3Context } from "../../../context/Web3Context";

const MenuComponent = ({
  anchorElUser,
  handleCloseUserMenu,
  disconnectWallet,
  shortAddress,
  handleNavigate,
  user,
}) => {
  return (
    <Menu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
      disableAutoFocusItem={true}
      disableAutoFocus={true}
    >
      <MenuItem>
        {user != null && <p className="text-dark m-0">{shortAddress(user)}</p>}
      </MenuItem>
      <Divider />

      <MenuItem onClick={() => handleNavigate("/my-collection")}>
        <Typography textAlign="center">Browse Collection</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleCloseUserMenu();
          disconnectWallet();
        }}
      >
        <Typography textAlign="center">Logout</Typography>
      </MenuItem>
    </Menu>
  );
};

export default MenuComponent;

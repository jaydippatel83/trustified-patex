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

import { useFormik, Form, FormikProvider } from "formik";
import MenuComponent from "./Menu";

const NavOne = () => {
  const web3Context = React.useContext(Web3Context);
  const {
    connectWallet,
    disconnectWallet,
    update,
    shortAddress,
    data,
    getFirestoreData,
  } = web3Context;

  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [menu, setMenu] = useState(false);
  const [user, setUser] = React.useState("");
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
      await connectWallet(values.name);
      setOpen(false);
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const { handleSubmit } = formik;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    const user = window.localStorage.getItem("address");
    setUser(user);
    getFirestoreData();
  }, [update]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 70) {
      setSticky(true);
    } else if (window.scrollY < 70) {
      setSticky(false);
    }
  };

  const mobileMenu = () => {
    setMenu(!menu);
  };

  const handleNavigate = (e) => {
    if (user != null || e === "/") {
      navigate(`${e}`);
    } else {
      toast.error("Please Login!");
    }
  };

  return (
    <header className="site-header site-header__header-one">
      <nav
        className={`navbar navbar-expand-lg navbar-light header-navigation stricky ${
          sticky ? "stricked-menu stricky-fixed" : ""
        }`}
      >
        <div className="container clearfix">
          <div className="logo-box clearfix">
            <a className="navbar-brand" onClick={() => handleNavigate("/")}>
              <img
                src="/images/logo.png"
                className="main-logo"
                width="119"
                alt="alter text"
              />
            </a>
            {/* <button className="menu-toggler" onClick={mobileMenu}>
              <span className="fa fa-bars"></span>
            </button> */}
          </div>
          <div
            className="main-navigation"
            style={{ display: menu ? "block" : "none" }}
          >
            <ul className=" one-page-scroll-menu navigation-box">
              <li
                className="current scrollToLink"
                onClick={() => handleNavigate("/")}
              >
                <a>&nbsp;&nbsp;&nbsp;&nbsp;</a>
              </li>
            </ul>
          </div>

          <div className="right-side-box">
            &nbsp;&nbsp;
            {(data && data?.verified == 1) || data?.verified == "1" ? (
              <a
                className="thm-btn header__cta-btn"
                onClick={() => handleNavigate("/dashboard/certificates")}
              >
                <span>Create</span>
              </a>
            ) : (
              ""
            )}
            &nbsp;&nbsp;
            {user === null ? (
              <a className="thm-btn header__cta-btn" onClick={connectWallet}>
                <span>Connect</span>
              </a>
            ) : (
              <Tooltip title="">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Jaydip Patel" src={data ? data.Photo : ""} />
                </IconButton>
              </Tooltip>
            )}
            {anchorElUser && (
              <MenuComponent
                anchorElUser={anchorElUser}
                handleCloseUserMenu={handleCloseUserMenu}
                disconnectWallet={disconnectWallet}
                shortAddress={shortAddress}
                handleNavigate={handleNavigate}
                user={user}
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavOne;

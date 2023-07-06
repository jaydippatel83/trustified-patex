/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Box from "@mui/material/Box";
import Badges from "./Badges";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { firebaseDataContext } from "../context/FirebaseDataContext";

const Index = () => {
  const navigate = useNavigate();
  const firebasedatacontext = React.useContext(firebaseDataContext);
  const { checkUserStatus } = firebasedatacontext;

  const handleNavigate = async () => {
    const add = window.localStorage.getItem("address");
    let status = await checkUserStatus(add);

    if (status) {
      navigate("/dashboard/badge");
    }
  };

  return (
    <div className="container">
      <div className="row gy-5">
        <div className="col-12">
          <Box sx={{ width: "100%" }}>
            <div className="d-flex justify-content-between  mb-2">
              <div className="cert-coll">
                <p>Badges</p>
              </div>
              <div>
                <a className="thm-btn header__cta-btn" onClick={handleNavigate}>
                  <span>
                    <AddIcon />
                    Create Badge
                  </span>
                </a>
              </div>
            </div>
          </Box>
        </div>
        <Badges />
      </div>
    </div>
  );
};

export default Index;

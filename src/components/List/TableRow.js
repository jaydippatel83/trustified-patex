import React, { useEffect, useState } from "react";
import { TableCell } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../../context/Web3Context";

const TableRowComponent = ({ id, value, url, event, type, token, status }) => {
  const web3Context = React.useContext(Web3Context);
  const { shortAddress } = web3Context;
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  useEffect(() => {
    if (id === "ipfsurl" && status === "Yes") {
      // getUserSMetadata(url);
      getUserSMetadataImg(url);
    }
  }, [event, url, id, status]);

  const getUserSMetadataImg = async (url) => {
    setImage(url);
  };

  const handleNavigate = (token) => {
    navigate(`/claim/${token}`);
  };

  return (
    <TableCell>
      {status === "Yes" && id === "ipfsurl" ? (
        <a target="_blank" href={image} rel="noreferrer">
          Preview
        </a>
      ) : id == "claimerAddress" ? (
        shortAddress(value)
      ) : (
        id !== "ipfsurl" && value
      )}

      {status === "No" && id === "ipfsurl" && (
        <p
          style={{ cursor: "pointer", color: "dodgerblue" }}
          onClick={() => handleNavigate(token)}
        >
          Preview
        </p>
      )}
    </TableCell>
  );
};
export default TableRowComponent;

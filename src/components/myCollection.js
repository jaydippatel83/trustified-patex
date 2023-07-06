import React, { useEffect, useState } from "react";
import { 
  CircularProgress, 
  Typography,
  Box,
} from "@mui/material";
import { firebaseDataContext } from "../context/FirebaseDataContext";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import web3 from "web3";
import { Link, useLocation } from "react-router-dom";
import Iconify from "./utils/Iconify";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { networkURL } from "../config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MyCollection({ show }) {
  const firebaseContext = React.useContext(firebaseDataContext);
  const { myCollection, certLoad, getMyCollection } = firebaseContext;

  const location = useLocation();

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    let add = localStorage.getItem("address");
    if (location.pathname == "/my-collection") {
      if (add) {
        getMyCollection(web3.utils.toChecksumAddress(add));
      } else {
        toast.error("Please connect wallet!");
      }
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [badgesData, setbadgesData] = useState([]);
  const [certificatesData, setcertificatesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let add = localStorage.getItem("address");
    if (location.pathname == "/my-collection") {
      if (add) {
        getMyCollection(web3.utils.toChecksumAddress(add));
      } else {
        toast.error("Please connect wallet!");
      }
    }
  }, []);

  useEffect(() => {
    let badges = [];
    let certificates = [];
    if (myCollection.length > 0) {
      for (let i = 0; i < myCollection.length; i++) {
        if (myCollection[i].type == "badge") {
          badges.push(myCollection[i]);
        } else {
          certificates.push(myCollection[i]);
        }
      }
    }
    setbadgesData(badges);
    setcertificatesData(certificates);
  }, [myCollection]);

  function toDataURL(url) {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  }

  const downloadImage = async (url, item) => {
    const a = document.createElement("a");
    a.href = await toDataURL(url);
    a.download = `${item.name.replace(/ +/g, "")}-${item.title}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPDF = (url, item) => {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const doc = new jsPDF({
        orientation: "landscape",
      });

      const imgWidth = 300; // Width of A4 page in mm
      const imgHeight = (img.height * imgWidth) / img.width;
      const xPos = (doc.internal.pageSize.width - imgWidth) / 2;
      const yPos = (doc.internal.pageSize.height - imgHeight) / 2;

      doc.addImage(imgData, "JPEG", xPos, yPos, imgWidth, imgHeight);
      doc.save(`${item.name.replace(/ +/g, "")}-${item.title}`);
    };
  };

  const getUrl = (chain) => {
    const url = networkURL[chain];
    return url;
  };
 

  return (
    <div
      className={
        location.pathname == "/my-collection"
          ? "bannercontainer container footer-position"
          : "container  footer-position"
      }
    >
      <div className="row">
        <div className="col">
          <Typography
            variant="h5"
            component="h6"
            sx={{
              fontWeight: 600,
              margin: "10px",
            }}
          >
            Your Collection
          </Typography>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "fit-content",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="My Badges" {...a11yProps(0)} />
              <Tab label="My Certificates" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div className="row">
              {badgesData.length != 0 &&
                badgesData.map((e, i) => {
                  return (
                    <div key={i} className="col-12 col-lg-3 col-sm-4 col-md-3">
                      <div
                        className="mt-2 template-card mb-2 text-center"
                        style={{ display: "grid" }}
                      >
                        <Link
                          to={e.ipfsurl}
                          target="_blank"
                          // style={{ width: "50%" }}
                        >
                          <img
                            height="auto"
                            width="100%"
                            className="claimBadge"
                            src={e.ipfsurl}
                            alt={e.title}
                          />
                        </Link>

                        <Typography
                          variant="body"
                          component="a"
                          sx={{
                            fontWeight: 600,
                            margin: "10px",
                            color: "#84a8fb",
                            textDecoration: "none",
                          }}
                        >
                          {e.title}
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              {certLoad && <CircularProgress />}
              {badgesData.length === 0 && show == true && !certLoad && (
                <div className="col">
                  <h4>No Collection!</h4>
                </div>
              )}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="row">
              {certificatesData.length != 0 &&
                certificatesData.map((item, i) => {
                  return (
                    <div
                      className="col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4"
                      key={i}
                    >
                      <div className="card-root">
                        <Link to={item.ipfsurl} target="_blank">
                          <img
                            style={{ cursor: "pointer" }}
                            src={
                              item?.ipfsurl
                                ? item?.ipfsurl
                                : "/images/placeholder.jpg"
                            }
                            alt=""
                            width="100%"
                          />
                        </Link>
                        <div className="card-body-cert">
                          <div className="d-flex justify-content-between">
                            <Typography
                              variant="body"
                              component="a"
                              href={item.pdf}
                              target="_blank"
                              sx={{
                                textTransform: "uppercase",
                                fontWeight: 600,
                                color: "#84a8fb",
                                textDecoration: "none",
                              }}
                            >
                              {item.title}
                            </Typography>
                            <div>
                              <Tooltip title="Download Image" arrow>
                                <IconButton
                                  color="primary"
                                  aria-label="add to shopping cart"
                                  onClick={() =>
                                    downloadImage(item?.ipfsurl, item)
                                  }
                                >
                                  <Iconify
                                    icon="bx:images"
                                    width={20}
                                    height={20}
                                    style={{ cursor: "pointer" }}
                                  />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Download PDF" arrow>
                                <IconButton
                                  color="primary"
                                  aria-label="add to shopping cart"
                                  onClick={() =>
                                    handleDownloadPDF(item?.ipfsurl, item)
                                  }
                                >
                                  <Iconify
                                    icon="material-symbols:sim-card-download-outline-rounded"
                                    width={20}
                                    height={20}
                                    style={{ cursor: "pointer" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>

                          <Typography
                            variant="body"
                            component="p"
                            sx={{
                              color: "#74727a",
                              margin: "10px 0",
                              textDecoration: "none",
                              maxHeight: "120px",
                              overflow: "scroll",
                            }}
                          >
                            {item.description}
                          </Typography>

                          <a
                            href={`${getUrl(item?.chain)}/${item.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Transaction <OpenInNewIcon />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {loading && <CircularProgress />}
              {certificatesData.length === 0 && show == true && (
                <h4>No Collection!</h4>
              )}
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

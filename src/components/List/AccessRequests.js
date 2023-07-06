import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import Iconify from "../../components/utils/Iconify";
import { Web3Context } from "../../context/Web3Context";
import { firebaseDataContext } from "../../context/FirebaseDataContext";

import { collection, db, query, where, getDocs } from "../../firebase";

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

const Requests = () => {
  const [requests, setRequests] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const web3Context = React.useContext(Web3Context);
  const firebaseContext = React.useContext(firebaseDataContext);
  const {
    shortAddress,
    updateIssuerAccess,
    updateIssuer,
    data,
    checkAllowList,
  } = web3Context;
  const {
    updateStatus,
    updateStatusLoading,
    getIssuers,
    updateIssuerNFT,
    // updatedata,
  } = firebaseContext;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const init = async () => {
      try {
        let allowed = await checkAllowList();
        if (allowed) {
          const profiles = query(collection(db, "UserProfile"));

          const profileSnapshot = await getDocs(profiles);

          const profileList = profileSnapshot.docs.map((doc) => {
            let obj = doc?.data();
            obj.id = doc?.id;
            return obj;
          });
          setRequests(profileList);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [updateStatusLoading]);

  return (
    <>
      <Container pl={0} pr={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Access Requests
          </Typography>
          <button
            className="thm-btn header__cta-btn"
            onClick={async () => {
              handleClickOpen();
            }}
          >
            <span>{updateIssuer ? "Updating..." : "Update Access"}</span>
          </button>
        </Stack>
        <Stack>
          <Card>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Type</TableCell>

                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests &&
                    requests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>{request.Name}</TableCell>
                        <TableCell>
                          <p
                            style={{
                              border: "1px solid #eee",
                              padding: "3px 15px",
                              borderRadius: "20px",
                              fontWeight: "bolder",
                              width: "fit-content",
                            }}
                          >
                            {shortAddress(request.Address)}
                          </p>
                        </TableCell>
                        <TableCell>{request.type}</TableCell>

                        <TableCell>
                          {request.status === "approved" ? (
                            <Chip
                              label={request.status}
                              color="success"
                              variant="outlined"
                            />
                          ) : request.status == "rejected" ? (
                            <Chip
                              style={{
                                color: "red",
                                border: "1px solid red",
                              }}
                              label="Rejected"
                              variant="outlined"
                            />
                          ) : (
                            <>
                              <Chip
                                style={{
                                  color: "dodgerblue",
                                  border: "1px solid dodgerblue",
                                }}
                                label={"Approve"}
                                variant="outlined"
                                onClick={() =>
                                  updateStatus(request, "approved")
                                }
                              />
                              &nbsp;
                              <Chip
                                style={{
                                  color: "red",
                                  border: "1px solid red",
                                }}
                                label={"Reject"}
                                variant="outlined"
                                onClick={() =>
                                  updateStatus(request, "rejected")
                                }
                              />
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Alert!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Make sure you have enough balance to airdrop issuer nfts to the
              requested issuers on the networks we supports.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Not sure</Button>
            <Button
              onClick={async () => {
                let issuers = await getIssuers();
                await updateIssuerAccess(issuers);
                await updateIssuerNFT();
                handleClose();
              }}
            >
              I have
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Requests;

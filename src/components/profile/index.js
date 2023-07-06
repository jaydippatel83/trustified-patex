import React, { useEffect, useState } from "react";
import { PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  CardContent,
  CircularProgress,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  FormLabel,
  FormHelperText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Web3Context } from "../../context/Web3Context";
import MyCollection from "../myCollection";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { multiChains } from "../../config";

import { Card, Container, Row, Col } from "react-bootstrap";
import web3 from "web3";

function User() {
  const web3Context = React.useContext(Web3Context);
  const { shortAddress, setUpdate, update } = web3Context;
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  const [profileData, setProfileData] = useState({
    avatar: "",
    name: "",
    bio: "",
    purpose: "",
    address: "",
    url: "",
    type: "individual",
    networks: [],
  });

 
  const [state, setState] = React.useState({
    patextestnet: {
      label: "Patex (Testnet)",
      value: "patextestnet",
      image: "/assets/logo/patex.png",
      chainId: 471100,
      priority: 1,
      checked: false,
    },
    fvm: {
      label: "FVM(Mainnet)",
      value: "fvm",
      image: "/assets/filecoin.png",
      chainId: 314,
      priority: 0,
      checked: false,
    },
    fvmtestnet: {
      label: "FVM Testnet(Calibration)",
      value: "fvmtestnet",
      image: "/assets/filecoin.png",
      chainId: 314159,
      priority: 1,
      checked: false,
    },
    polygon: {
      label: "Polygon",
      value: "polygon",
      image: "/assets/coin.png",
      chainId: 137,
      priority: 0,
      checked: false,
    },
    mumbai: {
      label: "Polygon Mumbai",
      value: "mumbai",
      image: "/assets/coin.png",
      chainId: 80001,
      priority: 1,
      checked: false,
    },
    celotestnet: {
      label: "Alfajores Testnet(Celo)",
      value: "celotestnet",
      image: "/assets/celo.png",
      chainId: 44787,
      priority: 1,
      checked: false,
    },
    celomainnet: {
      label: "Celo Mainnet",
      value: "celomainnet",
      image: "/assets/celo.png",
      chainId: 42220,
      priority: 1,
      checked: false,
    },
    arbitrumtestnet: {
      label: "Arbitrum Goerli",
      value: "arbitrumtestnet",
      image: "/assets/airbitrum.png",
      chainId: 421613,
      priority: 1,
      checked: false,
    },
    ethereumtestnet: {
      label: "Ethereum Sepolia",
      value: "ethereumtestnet",
      image: "https://request-icons.s3.eu-west-1.amazonaws.com/eth.svg",
      chainId: 11155111,
      priority: 0,
      checked: false,
    },
  });

  const handleChange = (key) => {
    setState({
      ...state,
      [key]: {
        ...state[key],
        checked: !state[key].checked,
      },
    });
  };

  const error = Object.values(state).filter((v) => v.checked).length < 1;

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getMyCollection, message, open, handleClose } = firebaseContext;

  useEffect(() => {
    let add = localStorage.getItem("address");
    getMyCollection(web3.utils.toChecksumAddress(add));
  }, []);

  useEffect(() => {
    const init = async () => {
      const add = window.localStorage.getItem("address");

      const q = query(
        collection(db, "UserProfile"),
        where("Address", "==", add)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((fire) => {
        let obj = {
          avatar: fire.data().Photo,
          name: fire.data().Name,
          bio: fire.data().Bio,
          purpose: fire.data().purpose,
          address: fire.data().Address,
          verified: fire.data().verified,
          status: fire.data().status,
          type: fire.data().type,
          url: fire.data().url,
          networks: fire.data().networks ? fire.data().networks : [],
        };
        setProfileData(obj);
        fire.data().networks && setState(fire.data().networks);
      });
    };
    init();
  }, [update]);

  async function onChangeAvatar(e) {
    setLoading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `Photo/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setProfileData({ ...profileData, avatar: url });
      });
    });
    setLoading(false);
  }

  const updateProfile = async () => {
    const add = window.localStorage.getItem("address");

    const data = {
      Name: profileData.name,
      Bio: profileData.bio,
      Photo: profileData.avatar,
      Address: add,
      verified: 0,
      CreatedAt: new Date(),
      purpose: profileData.purpose,
      status: "requested",
      type: profileData.type,
      url: profileData.url,
      networks: state,
    };
    console.log(data,"data");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      addDoc(collection(db, "UserProfile"), data);
      setUpdate(!update);
      toast.success("Requested Access successfully!!");
    } else {
      querySnapshot.forEach((fire) => {
        const data = {
          Name: profileData.name !== "" ? profileData.name : fire.data().Name,

          Bio: profileData.bio !== "" ? profileData.bio : fire.data().Bio,
          Photo:
            profileData.avatar !== "" ? profileData.avatar : fire.data().Photo,
          Address: add,
          verified: fire.data().verified,
          UpdatedAt: new Date(),
          purpose:
            profileData.purpose !== ""
              ? profileData.purpose
              : fire.data().purpose,
          status: fire.data().status,
          type: profileData.type !== "" ? profileData.type : fire.data().type,
          url: profileData.url !== "" ? profileData.url : fire.data().url,
          networks: state,
        };
        const dataref = doc(db, "UserProfile", fire.id);
        updateDoc(dataref, data);
        setUpdate(!update);
        toast.success("Profile successfully updated!!");
      });
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="7">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Request Access</Card.Title>
              </Card.Header>
              <Card.Body style={{ padding: "20px" }}>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={3}
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      badgeContent={
                        <label htmlFor="icon-button-file">
                          <Input
                            onChange={(e) => onChangeAvatar(e)}
                            className="d-none"
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                          />
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                          >
                            <PhotoCamera />
                          </IconButton>
                        </label>
                      }
                    >
                      <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={
                          profileData.avatar
                            ? profileData.avatar
                            : "/assets/logo.png"
                        }
                      />
                    </Badge>
                  </Stack>

                  <Typography
                    color="textSecondary"
                    variant="body"
                    style={{
                      border: "1px solid #eee",
                      padding: "3px 15px",
                      borderRadius: "20px",
                      fontWeight: "bolder",
                      color: "black",
                      width: "fit-content",
                      marginTop: "20px",
                    }}
                  >
                    {profileData
                      ? shortAddress(profileData.address)
                      : shortAddress(window.localStorage.getItem("address"))}
                  </Typography>
                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    fullWidth
                  />

                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label={
                      "Tell us a bit more about your project or community..."
                    }
                    name="bio"
                    type="text"
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    value={profileData.bio}
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={3}
                  />

                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Please share a link to your project..."
                    name="url"
                    type="text"
                    value={profileData.url}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        url: e.target.value,
                      })
                    }
                    fullWidth
                  />

                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Purpose of Issue"
                    name="purpose"
                    type="text"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        purpose: e.target.value,
                      })
                    }
                    value={profileData.purpose}
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={3}
                  />

                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group "
                    name="controlled-radio-buttons-group"
                    sx={{ display: "inline" }}
                    value={profileData.type}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        type: e.target.value,
                      })
                    }
                  >
                    <FormControlLabel
                      value="individual"
                      control={<Radio />}
                      label="Individual"
                    />
                    <FormControlLabel
                      value="community"
                      control={<Radio />}
                      label="Community"
                    />
                  </RadioGroup>

                  <FormControl component="fieldset" error={error}>
                    <FormLabel component="legend">Select Networks</FormLabel>
                    <FormGroup aria-label="position" row>
                      {Object.keys(state).map((key) => {
                        const checkbox = state[key];
                        return (
                          <div key={key}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={checkbox.checked}
                                  onChange={() => handleChange(key)}
                                  name={checkbox.key}
                                />
                              }
                              label={checkbox.label}
                              labelPlacement="end"
                            />
                          </div>
                        );
                      })}
                    </FormGroup>

                    <FormHelperText>
                      {error
                        ? "Please select networks"
                        : "Networks, on which you would like to issue badges or certificates"}
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Card.Body>
              <Card.Footer>
                <button
                  className="thm-btn header__cta-btn"
                  onClick={updateProfile}
                >
                  <span>Save</span>
                </button>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="5">
            <Card sx={{ border: "1px solid #eee" }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    src={profileData.avatar}
                    sx={{
                      height: 100,
                      mb: 2,
                      width: 100,
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body"
                    style={{
                      border: "1px solid #eee",
                      padding: "3px 15px",
                      borderRadius: "20px",
                      fontWeight: "bolder",
                      color: "black",
                      width: "fit-content",
                      marginTop: "20px",
                    }}
                  >
                    {profileData.address !== ""
                      ? shortAddress(profileData.address)
                      : shortAddress(window.localStorage.getItem("address"))}
                  </Typography>
                  <div
                    style={{
                      margin: "10px",
                      textAlign: "center",
                    }}
                  >
                    <h3>
                      <a href="#none">
                        {profileData.name !== "" ? profileData.name : "@name"}
                      </a>
                    </h3>
                    <p>{profileData.bio !== "" ? profileData.bio : "Bio"}</p>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <MyCollection show={true}></MyCollection>
        </Row>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Alert</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default User;

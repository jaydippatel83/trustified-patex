import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Stack,
  FormHelperText,
} from "@mui/material";
import WebFont from "webfontloader";
import { NFTStorageContext } from "../../../context/NFTStorageContext";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import Draggable from "react-draggable";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import TemplateEdit from "../../template/TemplateEdit";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { SketchPicker } from "react-color";
import Popover from "@mui/material/Popover";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { fbold, fontList, fsize } from "../../../config";

function GetTemplate({ message }) {
  const value = useContext(NFTStorageContext);
  const [data, setdata] = useState();
  const [username, setUsername] = useState({
    x: 30,
    y: -590,
  });
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [fontSize, setFontSize] = useState(24);
  const [colors, setColor] = useState("");
  const [docId, setDocId] = useState("");
  const [bold, setBold] = useState(500);
  const [selectedElement, setSelectedElement] = useState("certText");
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState();
  const [imageWidth, setImageWidth] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const imgRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [alignment, setAlignment] = React.useState("left");
  const [updatedPos, setUpdatedPos] = React.useState(false);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useMemo(() => {
    WebFont.load({
      google: {
        families: [
          "Roboto",
          "Borsok",
          "Open Sans",
          "Lato ",
          "Poppins",
          "Zeyada",
          "Babylonica",
          "Dancing Script",
          "Lobster",
          "Pacifico",
          "Caveat",
          "Satisfy",
          "Great Vibes",
          "Ole",
          "Coiny",
          "Kenia",
          "Rubik Beastly",
          "Londrina Sketch",
          "Neonderthaw",
          "Kumar One",
          "Ribeye",
          "Emblema One",
          "Ewert",
          "Kavoon",
          "Moul",
          "Rubik Moonrocks",
          "Rubik Iso",
          "Unifraktur Cook",
          "Germania One",
          "Monoton",
          "Orbitron",
          "Rampart One",
        ],
      },
      active: () => setSelectedFont("Roboto"),
    });
  }, []);

  useEffect(() => {
    getImageResolution();
  }, [width, height]);

  async function getImageResolution() {
    if (width >= 1000 || (height >= 700 && width > height)) {
      setImageHeight(600);
      setImageWidth(800);
    } else if (width >= 1000 || (height >= 700 && width < height)) {
      setImageHeight(800);
      setImageWidth(600);
    } else if (width === height) {
      if (width > 600 || height > 600) {
        setImageHeight(600);
        setImageWidth(600);
      } else {
        setImageHeight(height);
        setImageWidth(width);
      }
    } else {
      setImageHeight(height);
      setImageWidth(width);
    }
  }

  const textName = {
    name: {
      text: "Your Name",
      width: imageWidth,
      height: imageHeight,
      style: {
        position: "absolute",
        color: colors?.hex ? colors?.hex : "#000",
        fontSize: `${fontSize}px` ? `${fontSize}px` : "40px",
        lineHeight: `${fontSize + 5}px` ? `${fontSize + 5}px` : "20px",
        textAlign: alignment,
        margin: "10px auto",
        fontFamily: selectedFont ? selectedFont : "Poppins",
        fontWeight: bold ? bold : 100,
        transform: `translate(${30}px, ${username.y}px)`,
        width: `${imageWidth - 100}px`,
      },
    },
  };

  useEffect(() => {
    if (selectedElement === "certText") {
      setUsername({ ...username });

      value.setUploadObj(textName);
    }
  }, [
    selectedFont,
    colors,
    fontSize,
    bold,
    imageWidth,
    imageHeight,
    alignment,
    selectedElement,
    updatedPos,
  ]);

  const handleDivClick = (event) => {
    event.stopPropagation();
    setSelectedElement(event.currentTarget.id);
  };

  const handleFontChange = useCallback((event) => {
    setSelectedFont(event.target.value);
  }, []);

  const handleSizeChange = useCallback((e) => {
    setFontSize(e.target.value);
  }, []);

  const handleBoldChange = useCallback((e) => {
    setBold(e.target.value);
  }, []);

  const handleChangeColor = (color) => {
    setColor(color);
  };
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    value.setPreviewUrl(URL.createObjectURL(image));
    value.uploadCertificate(image);

    const url = URL.createObjectURL(image);
    const img = new Image();
    img.src = url;
    img.onload = handleImageLoad;
    setFileName(image.name);
  };

  const handleImageLoad = (e) => {
    const width = e.target.width;
    const height = e.target.height;
    setWidth(width);
    setHeight(height);
  };

  const onClose = () => {
    value.setPreviewUrl("");
    setUsername({});
    setFileName("");
  };

  const getTemplates = async () => {
    const array = [];
    const q = query(collection(db, "Templates"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const dataWithId = { id: doc.id, ...doc.data() };
      array.push(dataWithId);
    });
    setdata(array);
  };

  const handleSelectTemp = (id) => {
    setDocId(id);
    value.selectTemplate(id);
  };

  useEffect(() => {
    getTemplates();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Stack spacing={3} sx={{ margin: "20px" }}>
            {value.template === "" && (
              <Box sx={{ m: 1 }}>
                <Button
                  sx={{ m: 1, color: "#fff" }}
                  variant="contained"
                  component="label"
                >
                  {value.uploadCert ? (
                    <CircularProgress sx={{ color: "#fff" }} />
                  ) : (
                    "Upload Your Certificate"
                  )}
                  <input
                    onChange={(e) => handleImageChange(e)}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                  />
                </Button>
                {fileName && (
                  <FormHelperText sx={{ fontWeight: "bold" }}>
                    {fileName}
                  </FormHelperText>
                )}

                {message && (
                  <FormHelperText sx={{ fontWeight: "bold", color: "red" }}>
                    {message}
                  </FormHelperText>
                )}
              </Box>
            )}

            {value.previewUrl !== "" && (
              <Stack sx={{ my: 2 }} direction="row">
                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Font
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedFont}
                      label="Select Font"
                      onChange={handleFontChange}
                    >
                      {fontList.map((e) => {
                        return (
                          <MenuItem key={e} style={{ fontFamily: e }} value={e}>
                            {e}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Font Size
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={fontSize}
                      label="Select Font"
                      onChange={handleSizeChange}
                    >
                      {fsize.map((e) => {
                        return <MenuItem  key={e}  value={e}>{e}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Font Weight
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={bold}
                      label="Font weight"
                      onChange={handleBoldChange}
                    >
                      {fbold.map((e) => {
                        return <MenuItem  key={e}  value={e}>{e}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ m: 1 }}>
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="left" aria-label="left aligned">
                      <FormatAlignLeftIcon />
                    </ToggleButton>
                    <ToggleButton value="center" aria-label="centered">
                      <FormatAlignCenterIcon />
                    </ToggleButton>
                    <ToggleButton value="right" aria-label="right aligned">
                      <FormatAlignRightIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <div
                    style={{
                      padding: "5px",
                      background: "#fff",
                      borderRadius: "1px",
                      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                    onClick={handleClick}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "20px",
                        borderRadius: "2px",
                        backgroundColor: colors,
                      }}
                    ></div>
                  </div>
                </Box>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <SketchPicker color={colors} onChange={handleChangeColor} />
                </Popover>
              </Stack>
            )}
            {value.previewUrl !== "" && (
              <Stack direction="row">
                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <TextField
                    label="width"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    id="outlined-basic"
                    variant="outlined"
                    type="number"
                  />
                </Box>
                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <TextField
                    label="Height"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    id="outlined-height"
                    variant="outlined"
                    type="number"
                  />
                </Box>
              </Stack>
            )}

            {value.previewUrl !== "" && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            )}

            <span style={{ marginTop: "40px" }}>
              Drag your name, wherever you want if you want to display it on
              certificate.
            </span>
            {value.previewUrl && (
              <div
                id="certificateX"
                style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
              >
                <img
                  ref={imgRef}
                  width={imageWidth}
                  height={imageHeight}
                  src={value.previewUrl}
                  alt=""
                />
                <Draggable
                  position={username}
                  onStop={(e, data) => {
                    setUsername({ ...username, x: 30, y: data.y });
                    setUpdatedPos(!updatedPos);
                  }}
                  onMouseDown={(e) => {
                    handleDivClick(e);
                  }}
                >
                  <div id="certText" style={textName.name.style}>
                    <span
                      style={{
                        backgroundColor: "rgba(255,255,255,0.5)",
                        color:
                          textName.name.style.color == "#000"
                            ? "#000"
                            : textName.name.style.color,
                        padding: "2px 5px",
                      }}
                    >
                      {textName.name.text}
                    </span>
                  </div>
                </Draggable>
              </div>
            )}

            {/* {value.previewUrl === "" && value.template === "" && (
              <Divider>
                <Chip label="OR" />
              </Divider>
            )} */}

            {/* <Slider {...settings}>
              {data &&
                data.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className=""
                      onClick={() => handleSelectTemp(e.id)}
                    >
                      <img src={e.preview} width="200" height="200" />
                    </div>
                  );
                })}
            </Slider> */}
          </Stack>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {/* {docId && <TemplateEdit id={docId} />}  */}
        </div>
      </div>
    </div>
  );
}

export default GetTemplate;

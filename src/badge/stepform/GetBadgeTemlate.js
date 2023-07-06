import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  FormHelperText,
} from "@mui/material";
import { BadgeContext } from "../../context/BadgeContext";
import CloseIcon from "@mui/icons-material/Close";

const GetBadgeTemlate = ({ message }) => {
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  const [fileName, setFileName] = useState("");
  const [upload, setUpload] = useState(false);

  const handleImageChange = async (e) => {
    setUpload(true);
    const image = e.target.files[0];
    await value.setPreviewUrl(URL.createObjectURL(image));
    setUpload(false);
    setFileName(image.name);
  };

  const onClose = () => {
    value.setPreviewUrl("");
    setFileName("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Stack spacing={3} sx={{ margin: "20px" }}>
            {formdata.template === "" && (
              <Box sx={{ m: 1 }}>
                <Button
                  sx={{ m: 1, color: "#fff" }}
                  variant="contained"
                  component="label"
                  disabled={upload}
                >
                  {upload ? "Uploading..." : "Upload Your Badge"}
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

                {
                  message && <FormHelperText sx={{ fontWeight: "bold", color: 'red' }}>
                    {message}
                  </FormHelperText>
                }
              </Box>
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

            {value.previewUrl && (
              <div id="badgeId">
                <img
                  width="200px"
                  height="200px"
                  id="badge-img"
                  src={value.previewUrl}
                  alt=""
                />
              </div>
            )}

          </Stack>
        </div>
      </div>
    </div>
  );
};

export default GetBadgeTemlate;

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  FormHelperText,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import CSVReader from "react-csv-reader";

import { NFTStorageContext } from "../../../context/NFTStorageContext";
import { toast } from "react-toastify";

function GetChain({ message, quantityMessage, mode, setMode, setCustomeType }) {
  const value = useContext(NFTStorageContext);
  const formdata = value.labelInfo.formData;
  const setCsvData = value.setCsvData;
  const [upload, setUpload] = useState(false);
  const [fileName, setFileName] = useState("");

  const generateCsv = () => {
    const rows = [["John Doe", "0x0a4349A6b51c8454fcff20af639dA1FbEF8A2501"]];

    var csv = "Name,Address\n";

    rows.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `sample.csv`;
    downloadLink.click();
  };

  return (
    <div>
      <Stack spacing={3} sx={{ margin: "20px" }}>
        <Box sx={{ m: 1 }}>
          <Box sx={{ m: 1 }}>
            <FormControl fullwidth={"true"}>
              <FormLabel>Select method</FormLabel>
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={2}
              >
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value={"claimurl"}
                    control={<Radio />}
                    label="Claim Url"
                  />
                  <FormControlLabel
                    value={"airdrop"}
                    control={<Radio />}
                    label="Airdrop"
                  />
                </RadioGroup>
              </Stack>
            </FormControl>
            <FormHelperText sx={{ fontWeight: "bold" }}>
              Choose from the methods above to send nft certificates to
              claimers.
            </FormHelperText>
          </Box>

          <TextField
            label="Quantity"
            name="quantity"
            id="quantity"
            type="number"
            onChange={value.setFormdata("quantity")}
            value={formdata.quantity}
            error={quantityMessage.length > 0}
            helperText={quantityMessage !== "" ? quantityMessage : ""}
            sx={{ marginTop: "20px" }}
          />
        </Box>

        <>
          <span>Upload excel sheet of collectors data</span>
          <Box sx={{ m: 1 }}>
            <Button
              sx={{ m: 1, color: "white" }}
              variant="contained"
              component="label"
              disabled={upload}
            >
              {upload ? "Uploading..." : "Upload File"}
              <CSVReader
                inputStyle={{ display: "none" }}
                onFileLoaded={async (data, file) => {
                  var result = [];

                  setUpload(true);

                  if (mode == "airdrop" && data[0].indexOf("Address") == -1) {
                    setUpload(false);
                    toast.error("For Airdrop wallet addresses are required");
                  } else {
                    if (
                      data[0].length == 2 &&
                      data[0].indexOf("Name") > -1 &&
                      data[0].indexOf("Address") > -1
                    ) {
                      data.shift();
                      result = data
                        .map(function (row) {
                          return {
                            name: row[0],
                            address: row[1],
                          };
                        })
                        .filter((row) => row.name !== "" && row.address !== "");
                      setCustomeType("certificate");
                    } else if (
                      data[0].indexOf("Name") > -1 &&
                      data[0].length == 1
                    ) {
                      data.shift();
                      result = data
                        .map(function (row) {
                          return {
                            name: row[0],
                          };
                        })
                        .filter((row) => row.name !== "");
                      setCustomeType("certificate");
                    } else if (
                      data[0].indexOf("Address") > -1 &&
                      data[0].length == 1
                    ) {
                      data.shift();
                      result = data
                        .map(function (row) {
                          return {
                            address: row[0],
                          };
                        })
                        .filter((row) => row.address !== "");
                      setCustomeType("certi");
                    } else {
                      result = [];
                      setCustomeType("certi");
                    }

                    await setCsvData(result);
                    setTimeout(function () {
                      setUpload(false);
                      setFileName(file.name);
                    }, 2000);
                  }
                }}
              />
            </Button>
            <a href="#" onClick={generateCsv}>
              Download sample file
            </a>
            {fileName ? (
              <FormHelperText sx={{ fontWeight: "bold" }}>
                {fileName}
              </FormHelperText>
            ) : (
              <FormHelperText sx={{ fontWeight: "bold" }}>
                "Make sure first column should be Name and if you want to airdrop then second should be
                Address. Download sample file."
              </FormHelperText>
            )}

            {message && (
              <FormHelperText sx={{ fontWeight: "bold", color: "red" }}>
                {message}
              </FormHelperText>
            )}
          </Box>
        </>
      </Stack>
    </div>
  );
}

export default GetChain;

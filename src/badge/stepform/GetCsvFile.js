import React, { useContext, useState } from "react";
import {
  FormHelperText,
  TextField,
  Divider,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import CSVReader from "react-csv-reader";
import { Box, Stack } from "@mui/system";
import { BadgeContext } from "../../context/BadgeContext";
import { toast } from "react-toastify";

const GetCsvFile = ({ message, mode, setMode }) => {
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  const setCsvData = value.setCsvData;
  const [upload, setUpload] = useState(false);
  const [fileName, setFileName] = useState("");

  const generateCsv = () => {
    const rows = [["0x3Fe0ab910eA2f59D4E7ee7375FA69Acff238B798"]];

    var csv = "Wallet Address\n";

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
    <div className="container">
      <div className="row">
        <div className="col">
          <Stack spacing={3} sx={{ margin: "20px" }}>
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
                Choose from the methods above to send nft Badges to claimers.
              </FormHelperText>
            </Box>
            {mode == "airdrop" ? (
              <>
                <span>Upload excel sheet of collectors addresses</span>
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
                        if (
                          data[0].indexOf("Wallet Address") > -1 ||
                          data[0].indexOf("Address") > -1
                        ) {
                          setUpload(true);
                          data.shift();
                          var result = data
                            .map(function (row) {
                              return {
                                address: row[0],
                              };
                            })
                            .filter((row) => row.address !== "");

                          await setCsvData(result);
                          setTimeout(function () {
                            setUpload(false);
                            setFileName(file.name);
                          }, 2000);
                        } else {
                          toast.error(
                            "Wallet Address column is required in csv file!"
                          );
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
                      Make sure the first column should be the Wallet Address on
                      you want to Airdrop nfts.
                    </FormHelperText>
                  )}

                  {message && (
                    <FormHelperText sx={{ fontWeight: "bold", color: "red" }}>
                      {message}
                    </FormHelperText>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ m: 1 }}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  id="quantity"
                  type="number"
                  onChange={value.setFormdata("quantity")}
                  value={formdata.quantity}
                  error={message.length > 0}
                  helperText={message !== "" ? message : ""}
                />
              </Box>
            )}

            <Divider />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default GetCsvFile;

import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  StepLabel,
} from "@mui/material";
import { NFTStorageContext } from "../../context/NFTStorageContext";
import GetNFTDetails from "../forms/stepform/GetNFTDetails";
import GetChain from "../forms/stepform/GetChain";
import GetTemplate from "../forms/stepform/GetTemplate";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Step 1",
    description: `Basic Certificate Details`,
  },
  {
    label: "Step 2",
    description: "Upload collectors list",
  },
  {
    label: "Step 3",
    description: `Upload Certificate  `,
  },
];

const NewTemplates = () => {
  const formdatavalue = React.useContext(NFTStorageContext);
  const formdata = formdatavalue.labelInfo.formData;
  const [activeStep, setActiveStep] = React.useState(0);
  const [tmessage, setTmessage] = useState("");
  const [dmessage, setDmessage] = useState("");
  const [csvMessage, setCsvMessage] = useState("");
  const [certMessage, setCertMessage] = useState("");
  const [quantityMessage, setquantityMessage] = useState("");
  const [network, setNetwork] = useState("");
  const [mode, setMode] = useState("claimurl");
  const [customeType, setCutomeType] = useState("certificate");

  useEffect(() => {
    getUpdateErrors();
  }, [
    formdata.title,
    formdata.description,
    formdata.chain,
    formdatavalue.csvData,
    formdatavalue.previewUrl,
    formdatavalue.quantity,
  ]);

  const getUpdateErrors = () => {
    switch (activeStep) {
      case 0:
        if (formdata.title !== "") {
          setTmessage("");
        }
        if (formdata.description !== "") {
          setDmessage("");
        }
        if (formdata.chain !== "") {
          setNetwork("");
        }
        break;
      case 1:
        if (formdatavalue.csvData !== 0) {
          setCsvMessage("");
        }
        break;
      case 2:
        if (formdatavalue.previewUrl !== "") {
          setCertMessage("");
        }
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (formdata.title === "") {
        setTmessage("Title is required");
      } else if (formdata.description === "") {
        setDmessage("Description is required");
      } else if (formdata.chain === "") {
        setNetwork("Please select network");
      } else {
        setTmessage("");
        setDmessage("");
        setNetwork("");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreateNft = () => {
    if (activeStep === 2) {
      if (!formdatavalue.previewUrl) {
        setCertMessage("Please upload certificate");
        return;
      } else {
        setCertMessage("");
        formdatavalue.createCertificateNFT(mode, customeType);
      }
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: "12px", p: 3 }}
      className="top-ba nner-cert"
    >
      <div className="text-center ">
        <h4 className=" text-dark">Create certificate</h4>
        <p className="">
          Please fill out the form with as much information as possible.
        </p>
      </div>
      <Box sx={{ marginTop: "30px" }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  <Typography variant="caption">{step.description}</Typography>
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {activeStep === 0 && (
                  <GetNFTDetails
                    tMsg={tmessage}
                    dMsg={dmessage}
                    net={network}
                  />
                )}

                {activeStep === 1 && (
                  <GetChain
                    message={csvMessage}
                    quantityMessage={quantityMessage}
                    mode={mode}
                    setMode={(value) => setMode(value)}
                    setCustomeType={(val) => {
                      setCutomeType(val);
                    }}
                  />
                )}
                {activeStep === 2 && <GetTemplate message={certMessage} />}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    {index === steps.length - 1 ? (
                      <button
                        onClick={handleCreateNft}
                        className="thm-btn header__cta-btn"
                        disabled={formdatavalue.uploadCert}
                        // style={{ pointerEvents: !btnDisbaled && "none" }}
                      >
                        {formdatavalue.uploading ? (
                          <>
                            <CircularProgress />
                            <div id="cover-spin"></div>
                            <p id="cover-spin-text">
                              Certificates are being minted! Please do not
                              refresh!😎 
                            </p>
                          </>
                        ) : (
                          <span>
                            {formdatavalue.uploadCert == true
                              ? "Uploading..."
                              : "Create NFT"}
                          </span>
                        )}
                      </button>
                    ) : (
                      <Button
                        variant="contained"
                        style={{ color: "white" }}
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    )}
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Paper>
  );
};

export default NewTemplates;

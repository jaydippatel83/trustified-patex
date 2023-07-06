import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  StepLabel,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { BadgeContext } from "../../context/BadgeContext";
import GetTitle from "../../badge/stepform/GetTitle";
import GetCsvFile from "../../badge/stepform/GetCsvFile";
import GetBadgeTemlate from "../../badge/stepform/GetBadgeTemlate";

const steps = [
  {
    label: "Step 1",
    description: `Basic Badge Details`,
  },
  {
    label: "Step 2",
    description: "Add Quantity of Badges you want to issue",
  },
  {
    label: "Step 3",
    description: `Upload Badge`,
  },
];

const BadgeTemplate = () => {
  const formdatavalue = React.useContext(BadgeContext);
  const formdata = formdatavalue.labelInfo.formData;

  const [activeStep, setActiveStep] = React.useState(0);

  const [tmessage, setTmessage] = useState("");
  const [dmessage, setDmessage] = useState("");
  const [certMessage, setCertMessage] = useState("");
  const [network, setNetwork] = useState("");
  const [csvMessage, setCsvMessage] = useState("");
  const [mode, setMode] = useState("claimurl");

  useEffect(() => {
    getUpdateErrors();
  }, [
    formdata.title,
    formdata.description,
    formdata.chain,
    formdata.quantity,
    formdatavalue.previewUrl,
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
        if (formdata.quantity !== 0) {
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
      if (formdata.quantity === 0 && mode == "claimurl") {
        setCsvMessage("Quantity is require");
      } else {
        setCsvMessage("");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleCreateNft = () => {
    if (activeStep === 2) {
      if (!formdatavalue.previewUrl) {
        setCertMessage("Please upload badge");
        return;
      } else {
        setCertMessage("");
        formdatavalue.createBadge(mode);
      }
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: "12px", p: 3 }}
      className="top-ba nner-cert"
    >
      <div className="text-center ">
        <h4 className=" text-dark">Create Badge</h4>
        <p className="">
          Please fill out the form with as much information as possible.
        </p>
      </div>

      {formdatavalue.loading && (
        <>
          <div id="cover-spin"></div>
          <p id="cover-spin-text">
            Badges are being minted! Please do not refresh!😎 
          </p>
        </>
      )}
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
                  <GetTitle tMsg={tmessage} dMsg={dmessage} net={network} />
                )}
                {activeStep === 1 && (
                  <GetCsvFile
                    message={csvMessage}
                    mode={mode}
                    setMode={(value) => setMode(value)}
                  />
                )}
                {activeStep === 2 && <GetBadgeTemlate message={certMessage} />}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    {index === steps.length - 1 ? (
                      <button
                        onClick={handleCreateNft}
                        className="thm-btn header__cta-btn"
                      >
                        <span>Create NFT</span>
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

export default BadgeTemplate;

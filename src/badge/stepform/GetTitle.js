import React, { useContext } from "react";
import {
  TextField,
  Autocomplete,
  Stack,
  FormLabel,
  Box,
  Dialog,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { ethers } from "ethers";
import { BadgeContext } from "../../context/BadgeContext";
import { Web3Context } from "../../context/Web3Context";
import { multiChains } from "../../config";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    height: "50vh",
    Width: "41vw",
    padding: "10px",
  },
}));

function GetTitle({ tMsg, dMsg, net }) {
  const classes = useStyles();
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const web3Context = React.useContext(Web3Context);
  const { switchNetwork } = web3Context;
  const [open, setOpen] = React.useState(false);

  const [selectedChain, setSelectedChain] = React.useState({
    label: "",
    value: "",
    image: "",
    chainId: "",
    priority: "",
  });


  return (
    <div>
      <Stack spacing={3} sx={{ margin: "10px" }}>
        <TextField
          fullwidth={"true"}
          label="Title"
          name="title"
          id="title"
          type="title"
          onChange={value.setFormdata("title")}
          value={formdata.title}
          error={tMsg.length > 0}
          helperText={tMsg !== "" ? tMsg : ""}
        />
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}
          onChange={value.setFormdata("description")}
          value={formdata.description}
          error={dMsg.length > 0}
          helperText={dMsg !== "" ? dMsg : ""}
        />
      </Stack>

      <Box sx={{ minWidth: 120, margin: "10px" }}>
        <FormLabel id="demo-controlled-radio-buttons-group">
          Select Your Network
        </FormLabel>

        <div className="d-flex justify-content-start">
          {multiChains
            .filter((chain) => chain.priority === 1)
            .map((chainCom, i) => (
              <div
                key={i}
                className="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
                // tabindex={i}
                role="button"
                data-testid="NetworkChip-mainnet"
                style={{
                  marginRight: "4px",
                  borderColor:
                    selectedChain.label === chainCom.label
                      ? "#282727"
                      : "#E4E4E4",
                }}
                onClick={async () => {
                  const { chainId } = await provider.getNetwork();
                  if (chainId !== chainCom.chainId) {
                    await switchNetwork(
                      ethers.utils.hexValue(chainCom.chainId)
                    );
                  }
                  setSelectedChain(chainCom);
                  value.setAutoCompleteData(chainCom.value);
                }}
              >
                <img
                  src={chainCom.image}
                  style={{ height: "20px", width: "20px" }}
                  alt=""
                  className="MuiChip-avatar jss159 MuiChip-avatarSmall"
                  aria-hidden="true"
                />
                <span className="MuiChip-label MuiChip-labelSmall">
                  {chainCom.label}
                </span>
                <span className="MuiTouchRipple-root"></span>
              </div>
            ))}


          {selectedChain.priority === 0 && (
            <div
              className="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
              // tabindex="0"
              role="button"
              data-testid="NetworkChip-mainnet"
              style={{
                marginRight: "4px",
                borderColor: "#282727",
              }}
            >
              <img
                src={selectedChain.image}
                style={{ height: "20px", width: "20px" }}
                alt=""
                className="MuiChip-avatar jss159 MuiChip-avatarSmall"
                aria-hidden="true"
              />
              <span className="MuiChip-label MuiChip-labelSmall">
                {selectedChain.label}
              </span>
              <span className="MuiTouchRipple-root"></span>
            </div>
          )}
          <div
            className="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
            // tabindex="0"
            role="button"
            style={{ padding: "0px 15px 0px 15px" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <span className="MuiChip-label MuiChip-labelSmall">...</span>
            <span className="MuiTouchRipple-root"></span>
          </div>
        </div>

        {
          net && <FormLabel id="demo-controlled-radio-buttons-group" style={{ color: 'red' }}>
            please Select Your Network
          </FormLabel>
        }

        <Dialog
          classes={{ paper: classes.dialogPaper }}
          onClose={() => setOpen(false)}
          open={open}
        >
          <Autocomplete
            open={true}
            disablePortal
            id="combo-box-demo"
            options={multiChains}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Type a Network" />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img loading="lazy" width="20" src={option.image} alt="" />
                {option.label}
              </Box>
            )}
            value={selectedChain.label}
            onChange={async (e, newValue) => {
              const selectedchain = newValue !== null ? newValue?.value : "";



              const { chainId } = await provider.getNetwork();
              if (chainId !== newValue.chainId) {
                await switchNetwork(
                  ethers.utils.hexValue(newValue.chainId)
                );
              }
              value.setAutoCompleteData(selectedchain);
              setSelectedChain(newValue);
              setOpen(false);
            }}
            openOnFocus={true}
            autoHighlight={true}
            autoSelect={true}
            disableClearable={true}
          />
        </Dialog>
      </Box>

    </div>
  );
}

export default GetTitle;

import html2canvas from "html2canvas";
import React, { useState, createContext, useEffect } from "react";
import { NFTStorage, File } from "nft.storage";
import jsPDF from "jspdf";
import { Web3Context } from "./Web3Context";
import { toast } from "react-toastify";
export const BadgeContext = createContext(undefined);
export const BadgeContextProvider = (props) => {
  const [open, setOpen] = React.useState(false);
  const [uploadLogo, setLogo] = useState("");
  const [csvData, setCsvData] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const web3Context = React.useContext(Web3Context);
  const { createBadges } = web3Context;
  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const [checked, setChecked] = useState(true);

  const [previewUrl, setPreviewUrl] = useState("");
  const [usernamePos, setUsernamePos] = useState({ x: 112, y: -171 });

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      title: "",
      description: "",
      template: "",
      name: "",
      chain: "",
      badgeName: "",
      Nontransferable: true,
      quantity: 0,
      expireDate: "",
      issueDate: new Date(),
    },
  });
  const handleChangeLogo = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setLogo(url);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const setFormdata = (prop) => (event) => {
    setlabelInfo({
      ...labelInfo,
      formData: { ...labelInfo.formData, [prop]: event.target.value },
    });
  };

  const setAutoCompleteData = (selectedchain) => {
    setlabelInfo({
      ...labelInfo,
      formData: { ...labelInfo.formData, chain: selectedchain },
    });
  };

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  const createBadge = async (mode) => {
    try {
      setLoading(true);
      var array = [];

      if (previewUrl) {
        const imageData = await fetch(previewUrl).then((r) => r.blob());
        const imageFile = new File(
          [imageData],
          `${labelInfo.formData.title.replace(/ +/g, "")}.png`,
          {
            type: "image/png",
          }
        );

        const metadata = await client.store({
          name: labelInfo.formData.title,
          description: labelInfo.formData.description,
          image: imageFile,
          claimer: "",
          expireDate: labelInfo.formData.expireDate,
          issueDate: labelInfo.formData.issueDate,
        });

        array.push(metadata.ipnft);
      } else {
        const idd = `badgeToprint${labelInfo.formData.template}`;
        const input = document.getElementById(idd);
        var pdfBlob = await html2canvas(input, {
          allowTaint: true,
          scale: 2,
          useCORS: true,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imageData = await fetch(imgData).then((r) => r.blob());
          return { imageData };
        });
        const imageFile = new File(
          [pdfBlob.imageData],
          `${labelInfo.formData.title}.png`,
          {
            type: "image/png",
          }
        );
        const metadata = await client.store({
          name: labelInfo.formData.title,
          description: labelInfo.formData.description,
          image: imageFile,
          claimer: "",
          expireDate: labelInfo.formData.expireDate,
          issueDate: labelInfo.formData.issueDate,
        });

        array.push(metadata.ipnft);
      }

      if (array.length > 0) {
        createBadges(
          {
            tokenUris: array,
          },
          labelInfo.formData,
          checked,
          mode,
          "badge",
          csvData
        )
          .then((response) => {
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);

            console.log(error.code);
            console.log(error.message);

            if (error.message == "Internal JSON-RPC error.") {
              toast.error("You don't have enough balance to create Badges!");
            } else if (error.code == "ACTION_REJECTED") {
              toast.error(
                "MetaMask Tx Signature: User denied transaction signature!"
              );
            } else if (error.code == "UNPREDICTABLE_GAS_LIMIT") {
              toast.error("You are not approved! Please contact admin!");
            } else if ((error.code = "NFT_OWNER")) {
              toast.error(error.message);
            } else {
              toast.error(error.message);
            }
          });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <BadgeContext.Provider
      value={{
        labelInfo,
        setFormdata,
        handleClickOpen,
        handleClose,
        open,
        handleChangeLogo,
        uploadLogo,
        csvData,
        setCsvData,
        loading,
        createBadge,
        setUsernamePos,
        previewUrl,
        usernamePos,
        setPreviewUrl,
        checked,
        switchHandler,

        setAutoCompleteData,
      }}
      {...props}
    >
      {" "}
      {props.children}
    </BadgeContext.Provider>
  );
};

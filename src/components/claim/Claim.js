import React, { useEffect, useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { Web3Context } from "../../context/Web3Context";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import MyCollection from "../myCollection";
import { ethers } from "ethers";
import TemplatePreview from "./Preview";
import UploadPreview from "./UploadPreview";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { toast } from "react-toastify";
import Iconify from "../../components/utils/Iconify";
import { networkIds, networkURL } from "../../config";

export default function Claim() {
  const web3Context = React.useContext(Web3Context);
  const {
    claimCertificate,
    claimLoading,
    claimUploadedCertificate,
    claimBadges,
    switchNetwork,
  } = web3Context;

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getMyCollection, getClaimer, claimer } = firebaseContext;

  const [id, setId] = useState("");
  const [show, setShow] = useState(false);
  const { token } = useParams();
  const [add, setAddress] = useState("");

  useEffect(() => {
    getClaimer(token);
    getUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getUrl = (chain) => {
    const url = networkURL[chain];
    return url;
  };

  async function getCertId() {
    let network = getNetworkToken(claimer?.chain);

    var certId = `${network}#${claimer?.eventId}#${claimer?.tokenId}`;
    setId(certId);
  }
  useEffect(() => {
    getCertId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimer]);

  const getNetworkToken = (network) => {
    var net;
    if (network === "fvmtestnet") {
      net = "fvmtestnet";
    } else if (network === "fvm") {
      net = "fvm";
    } else if (network === "mumbai") {
      net = "mumbai";
    } else if (network === "polygon") {
      net = "polygon";
    } else if (network === "celotestnet") {
      net = "celotestnet";
    } else if (network === "celomainnet") {
      net = "celo";
    } else if (network === "arbitrumtestnet") {
      net = "arbitrumtestnet";
    } else if (network === "ethereumtestnet") {
      net = "ethereumtestnet";
    } else {
      net = "bsc";
    }
    return net;
  };

  return (
    <section className="footer-position" id="banner">
      <div className="bannercontainer container">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-12 col-md-8 col-sm-10 mx-auto">
            <div className="banner-one__claimcontent">
              {claimer ? (
                <div
                  className="py-4"
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  {claimer?.type === "badge" ? (
                    <img className="claimBadge" src={claimer?.ipfsurl} alt="" />
                  ) : (
                    <>
                      {claimer?.position !== "" &&
                      claimer?.position !== undefined ? (
                        <UploadPreview claimer={claimer} id={id} />
                      ) : (
                        <TemplatePreview
                          id={id}
                          data={claimer?.template}
                          name={claimer?.claimer}
                          issueDate={claimer?.issueDate}
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                <CircularProgress />
              )}

              {claimer && (
                <div
                  className="justify-content-center"
                  style={{ margin: "auto" }}
                >
                  <div className="card-root claim-card">
                    <div className="justify-content-center d-flex">
                      <h4 className="card-h4 claim-h4">{claimer?.title}</h4>
                    </div>
                    <p className="card-p claim-des">{claimer?.description}</p>

                    <div
                      className="card-body-cert d-flex"
                      style={{ justifyContent: "space-evenly" }}
                    >
                      {claimer.type === "certificate" && (
                        <div>
                          <h4>Certificate Id</h4>
                          <p>{id}</p>
                        </div>
                      )}
                      <div>
                        <h4>TokenId</h4>
                        <p>#{claimer?.tokenId}</p>
                      </div>
                      <div>
                        <h4>Chain</h4>
                        <p style={{ textTransform: "capitalize" }}>
                          {claimer?.chain}
                        </p>
                      </div>
                      <div>
                        <h4>Type</h4>
                        <p>
                          {claimer?.nfttype === "on"
                            ? "Non-Transferrable"
                            : "Transferrable"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`${getUrl(claimer?.chain)}/${claimer.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Transaction <OpenInNewIcon />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-xl-8 col-lg-8 col-md-8 col-sm-10  mx-auto text-center">
            {claimer?.mode == "airdrop" ? (
              ""
            ) : claimer?.status === "Yes" ? (
              <div className="mt-4">
                <button className="thm-btn header__cta-btn">
                  <span>
                    Claimed
                    <Iconify
                      icon={"material-symbols:done"}
                      width={30}
                      height={30}
                      sx={{ color: "green" }}
                    />
                  </span>
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-start">
                <TextField
                  name="Address"
                  label="Wallet Address"
                  fullWidth
                  className="address mr-2"
                  onChange={(e) => setAddress(e.target.value)}
                  sx={{ background: "white" }}
                />
                <button
                  className="thm-btn header__cta-btn"
                  onClick={async () => {
                    try {
                      if (claimer.status === "Yes") {
                        toast.error("This certificate is already claimed!");
                        return;
                      }
                      if (add === "") {
                        toast.error("Please Enter Address!");
                        return;
                      }
                      if (!window.ethereum) {
                        toast.error("Please install Metamask");
                        return;
                      }
                      const provider = new ethers.providers.Web3Provider(
                        window.ethereum
                      );
                      const { chainId } = await provider.getNetwork();
                      const selectedNetworkId = networkIds[claimer.chain];
                      if (selectedNetworkId && chainId !== selectedNetworkId) {
                        await switchNetwork(
                          ethers.utils.hexValue(selectedNetworkId)
                        );
                      }

                      if (claimer?.type === "badge") {
                        await claimBadges(token, add);
                      } else {
                        if (
                          claimer?.position !== "" &&
                          claimer?.position !== undefined
                        ) {
                          await claimUploadedCertificate(
                            token,
                            add,
                            claimer,
                            claimer?.uploadObj.style.color,
                            claimer?.uploadObj.width,
                            claimer?.uploadObj.height
                          );
                        } else {
                          await claimCertificate(
                            token,
                            add,
                            claimer,
                            claimer?.template.name.style.color,
                            claimer?.template.name.style.fontFamily
                          );
                        }
                      }
                    } catch (error) {
                      console.log(error, "err");
                    }
                  }}
                >
                  <span> Claim</span>
                </button>
              </div>
            )}

            {claimLoading && (
              <>
                <div id="cover-spin"></div>
                <p id="cover-spin-text">
                  {claimer?.type} is being claimed! Please do not refresh!😎
                </p>
              </>
            )}
            <div className="mt-4">
              <button
                className="thm-btn header__cta-btn"
                onClick={() => {
                  getMyCollection(add);
                  setShow(true);
                }}
              >
                <span>Browse Collection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <MyCollection show={show}></MyCollection>}
    </section>
  );
}

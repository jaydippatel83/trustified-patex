/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { Web3Context } from "../../context/Web3Context";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Iconify from "../utils/Iconify";
import Tooltip from "@mui/material/Tooltip";
import { IconButton, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { logos, networkURL } from "../../config";

export default function Certificates() {
  const navigate = useNavigate();
  const web3Context = React.useContext(Web3Context);
  const { airdropNFTs, airdropLoading } = web3Context;

  const fireDataContext = React.useContext(firebaseDataContext);
  const {
    getNFTCollections,
    certificatesData,
    generateClaimersExcellSheet,
    getClaimers,
  } = fireDataContext;

  const [certificates, setCertificates] = React.useState([]);
  const [loadingStates, setLoadingStates] = React.useState(
    Array(certificates.length).fill(false)
  );

  React.useEffect(() => {
    getNFTCollections();
  }, []);

  React.useEffect(() => {
    const compareDates = (a, b) => {
      const dateA = new Date(a.issueDate);
      const dateB = new Date(b.issueDate);
      return dateB - dateA; // Sort in descending order (recent dates first)
    };

    let certificates = certificatesData.sort(compareDates);
    setCertificates(certificates);
  }, [certificatesData]);

  const navigateTo = (id, chain, collectionContract) => {
    navigate(`/dashboard/collectors/${id}`, {
      state: { chain, collectionContract },
    });
  };

  const getUrl = (chain) => {
    const url = networkURL[chain];
    return url;
  };

  return (
    <div className="container">
      <div className="row">
        {certificates.length !== 0 ? (
          certificates.map((item, index) => {
            return (
              <div
                className="col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4"
                key={index}
              >
                <div className="card-root" style={{ position: "relative" }}>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigateTo(
                        item.eventId,
                        item.chain,
                        item.collectionContract
                      )
                    }
                    src={
                      item?.ipfsUrl ? item?.ipfsUrl : "/images/placeholder.jpg"
                    }
                    width="100%"
                    alt=""
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      right: "15px",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      style={{
                        width: "22px",
                        height: "22px",
                        marginTop: "-5px",
                      }}
                      src={`${logos[item.chain]}`}
                      alt=""
                    />
                  </div>

                  <div className="card-body-cert">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="">{item.name}</h4>
                      </div>

                      {item?.mode == "airdrop" &&
                      item?.airdropstatus == false ? (
                        <div className="badge-footer mt-2">
                          <Button
                            onClick={async (e) => {
                              let claimers = await getClaimers(
                                item.eventId,
                                item.chain,
                                item.collectionContract
                              );
                              await airdropNFTs({
                                chain: item.chain,
                                eventId: item.eventId,
                                claimers: claimers,
                                type: item.type,
                                id: item.id,
                              });
                            }}
                          >
                            {airdropLoading ? "Dropping.." : "Airdrop"}
                          </Button>
                        </div>
                      ) : (
                        <div className="badge-footer mt-2">
                          {loadingStates[index] ? (
                            <CircularProgress />
                          ) : (
                            <Tooltip
                              title="Download CSV"
                              arrow
                              style={{ alignItems: "baseline" }}
                            >
                              <IconButton
                                onClick={async (e) => {
                                  const newLoadingStates = [...loadingStates];
                                  newLoadingStates[index] = true;
                                  setLoadingStates(newLoadingStates);
                                  e.stopPropagation();
                                  await generateClaimersExcellSheet(
                                    item.eventId,
                                    item.name,
                                    "certificate",
                                    item.chain,
                                    item.mode,
                                    item.collectionContract
                                  );
                                  newLoadingStates[index] = false;
                                  setLoadingStates(newLoadingStates);
                                }}
                                color="primary"
                                component="label"
                              >
                                <Iconify
                                  icon="eva:download-outline"
                                  width={20}
                                  height={20}
                                  style={{ cursor: "pointer" }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="card-p">{item.description}</p>
                  <div className="card-body-cert d-flex justify-content-between">
                    <div>
                      <h4>Issue </h4>
                      <p>{item.issueDate}</p>
                    </div>
                    <div>
                      <h4>EventId</h4>
                      <p>#{item.eventId}</p>
                    </div>
                    <div>
                      <h4>Chain</h4>
                      <p>{item.chain}</p>
                    </div>
                  </div>

                  <div className="card-body-cert d-flex justify-content-center">
                    <a
                      href={`${getUrl(item?.chain)}/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "16px" }}
                    >
                      View Transaction <OpenInNewIcon fontSize="16" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <p>
              No certificates has been issued by you till now. Click on "Create"
              to issue certificates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

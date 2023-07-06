import React, { createContext, useEffect, useState } from "react";
import { collection, db, getDocs, query, where } from "../firebase";
import { ethers } from "ethers";
import {
  chain,
  chainParams,
  trustifiedContracts,
  multiChains,
  networkIds,
} from "../config";
import trustifiedContractAbi from "../abi/Trustified.json";
import trustifiedIssuerAbi from "../abi/TrustifiedIssuer.json";
import trustifiedV1Abi from "../abi/Trustifiedv1.json";
import { toast } from "react-toastify";
import { firebaseDataContext } from "./FirebaseDataContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { NFTStorage, File } from "nft.storage";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import SmartAccount from "@biconomy/smart-account";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Web3 from "web3";
import { getIssuerMarkleTree } from "../utils/markleTree";

export const Web3Context = createContext(undefined);

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const Web3ContextProvider = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wallets } = useWallets();
  const [address, setAddress] = useState();
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState();
  const [userId, setUserId] = useState();
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimer, setClaimer] = useState({});
  const [aLoading, setaLoading] = useState(false);
  const [updateIssuer, setUpdateIssuers] = useState(false);
  const [airdropLoading, setAirdropLoading] = useState(false);
  const [smartAccount, setSmartAccount] = useState(null);
  const [privyProvider, setPrivyProvider] = useState(null);

  const { ready, authenticated, user, login, logout } = usePrivy();

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [csvData, setCsvData] = useState([]);

  const firebasedatacontext = React.useContext(firebaseDataContext);
  const {
    addCollection,
    addCollectors,
    updateCollectors,
    template,
    updateCollectorsForBadges,
    updateAirdroppedCollectors,
    updateAirdropStatus,
    claim,
    checkUserStatus,
  } = firebasedatacontext;

  useEffect(() => {
    getFirestoreData();
  }, [update]);

  let add = localStorage.getItem("address");

  useEffect(() => {
    const initialize = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setProvider(provider);
      setSigner(signer);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
    };

    if (add) {
      initialize();
    }
  }, [add]);

  useEffect(() => {
    const init = async () => {
      if (ready && authenticated) {
        setaLoading(false);
        console.log((user?.wallet?.address).toLowerCase());
        setAddress(user && (user?.wallet?.address).toLowerCase());
        window.localStorage.setItem(
          "address",
          user && (user?.wallet?.address).toLowerCase()
        );
        await checkUserStatus(user && (user?.wallet?.address).toLowerCase());
        setUpdate(!update);
        setaLoading(false);
      }
    };
    init();
  }, [user]);

  async function setupSmartAccount(selectedChain) {
    try {
      const embeddedWallet = wallets.find(
        (wallet) =>
          wallet.walletClientType === "privy" ||
          wallet.walletClientType === "metamask"
      );

      const provider = await embeddedWallet?.getEthersProvider();
      setPrivyProvider(provider);

      if (!provider) {
        toast.error("Unable to retrieve ethers provider from embedded wallet.");
        return;
      }

      let options = {
        activeNetworkId: networkIds[selectedChain],
        supportedNetworksIds: [networkIds[selectedChain]],

        networkConfig: [
          {
            chainId: networkIds[selectedChain],
            // Dapp API Key you will get from new Biconomy dashboard that will be live soon
            // Meanwhile you can use the test dapp api key mentioned above
            dappAPIKey: process.env.REACT_APP_BICONOMY_API_KEY,
          },
        ],
      };

      let smartAccount = new SmartAccount(provider, options);
      smartAccount = await smartAccount.init();
      setSmartAccount(smartAccount);

      return [smartAccount, provider];
    } catch (err) {
      console.log("error setting up smart account... ", err);
    }
  }

  async function switchNetwork(chainId) {
    try {
      const chainData = await window.ethereum.request({
        method: "eth_chainId",
        params: [],
      });

      const selectedChain = chainParams.find(
        (chain) => chain.chainId === chainId
      );

      if (chainData !== chainId && selectedChain) {
        const methodName =
          selectedChain.chainId === chainId
            ? "wallet_addEthereumChain"
            : "wallet_switchEthereumChain";

        await window.ethereum.request({
          method: methodName,
          params: [
            selectedChain.chainId === chainId
              ? {
                  chainId: selectedChain.chainId,
                  chainName: selectedChain.chainName,
                  nativeCurrency: {
                    name: selectedChain.chainName,
                    symbol: selectedChain.symbol,
                    decimals: selectedChain.decimals,
                  },
                  rpcUrls: [selectedChain.rpcUrl],
                }
              : { chainId: `${chainId}` },
          ],
        });
        await window.ethereum.request({ method: "eth_chainId" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setProviderAndSigner(provider, signer);
      }
    } catch (error) {
      if (error.code == -32002) {
        alert(
          "Please approve the previous request, that is pending in Metamask!"
        );
      } else {
        toast.error(error.message);
      }
    }
  }

  function setProviderAndSigner(provider, signer) {
    setProvider(provider);
    setSigner(signer);
  }

  const connectWallet = async (issuerName) => {
    const { ethereum } = window;
    setaLoading(true);
    try {
      login();
      if (ready && authenticated) {
        setaLoading(false);
        console.log((user?.wallet?.address).toLowerCase());
        setAddress(user && (user?.wallet?.address).toLowerCase());
        window.localStorage.setItem(
          "address",
          user && (user?.wallet?.address).toLowerCase()
        );
        await checkUserStatus(user && (user?.wallet?.address).toLowerCase());
        setUpdate(!update);
        setaLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithTrustified = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install the Metamask Extension!");
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const { chainId } = await provider.getNetwork();

    let currentChain = chain[chainId];

    let obj = {
      chain: currentChain,
      userAddress: accounts[0],
    };

    // const api = await axios.create({
    //   baseURL: "https://trustified-api-o5zg.onrender.com/trustified/api",
    // });

    const api = await axios.create({
      baseURL: "https://us-central1-trustified-fvm.cloudfunctions.net/api",
    });

    let response = await api
      .post("/login", obj)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });

    if (response.data.status == true) {
      setAddress(accounts[0]);
      window.localStorage.setItem("address", accounts[0]);
      setUpdate(!update);
    } else {
      toast.error("You don't have Trustified NFT");
    }

    // const trustifiedContract = new ethers.Contract(
    //   trustifiedContracts[currentChain].transferable,
    //   trustifiedContractAbi.abi,
    //   signer
    // );
    // const trustifiedNonTransferableContract = new ethers.Contract(
    //   trustifiedContracts[currentChain].nonTransferable,
    //   trustifiedNonTransferableContractAbi.abi,
    //   signer
    // );

    // let balance1 = await trustifiedContract.balanceOf(accounts[0]);
    // let balance2 = await trustifiedNonTransferableContract.balanceOf(
    //   accounts[0]
    // );

    // if (Number(balance1) > 0 || Number(balance2) > 0) {
    //   setAddress(accounts[0]);
    //   window.localStorage.setItem("address", accounts[0]);
    //   setUpdate(!update);
    // } else {
    //   toast.error("You don't have Trustified NFT");
    // }
  };

  const disconnectWallet = () => {
    if (location?.pathname.indexOf("claim") > -1) {
      window.localStorage.removeItem("address");
      logout();
      setUpdate(!update);
    } else {
      navigate("/");
      window.localStorage.removeItem("address");
      logout();
      setUpdate(!update);
      window.location.reload();
    }
    // navigate("/");
    // window.localStorage.removeItem("address");
    // setUpdate(!update);
    // window.location.reload();
  };
  const shortAddress = (addr) =>
    addr.length > 10 && addr.startsWith("0x")
      ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
      : addr;

  const getFirestoreData = async () => {
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((fire) => {
      setData(fire.data());
      setUserId(fire.id);
    });
  };

  const createBadges = function (
    data,
    firebasedata,
    checked,
    mode,
    type,
    csvData
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let [smartaccount, privyprovider] = await setupSmartAccount(
          firebasedata.chain
        );

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const trustifiedIssuerNFTContract = new ethers.Contract(
          trustifiedContracts[firebasedata.chain].trustifiedIssuernft,
          trustifiedIssuerAbi.abi,
          signer
        );

        const balance = await trustifiedIssuerNFTContract.balanceOf(address);

        console.log(balance,"balance");

        if (Number(balance) > 0) {
          const trustifiedContract = new ethers.Contract(
            trustifiedContracts[firebasedata.chain].trustified,
            trustifiedContractAbi.abi,
            privyprovider
          );
console.log(trustifiedContract,"trustifiedContract");
          const transactionMint =
            await trustifiedContract.populateTransaction.bulkMintERC721(
              mode == "claimurl"
                ? parseInt(firebasedata.quantity)
                : csvData.length,
              checked
            );

            console.log(transactionMint,"transactionMint");

          const tx1 = {
            to: trustifiedContract.address,
            data: transactionMint.data,
          };

          console.log(tx1,"tx1");

          const txResponse = await smartaccount.sendTransaction({
            transaction: tx1,
          });

          console.log(txResponse,"txResponse");
          const txHash = await txResponse.wait();

          console.log(txHash);

          await trustifiedContract.once(
            "TokensCreated",
            async (eventId, issuer) => {
              let tokenIds = await trustifiedContract.getEventTokens(eventId);
              console.log(tokenIds,"tokenIds");
              firebasedata.contract = trustifiedContract.address;
              firebasedata.userId = userId;
              firebasedata.eventId = parseInt(Number(eventId));
              firebasedata.type = type;
              firebasedata.image = `https://nftstorage.link/ipfs/${data.tokenUris[0]}/metadata.json`;
              firebasedata.templateId = "";
              firebasedata.Nontransferable = checked == true ? "on" : "off";
              firebasedata.txHash = txHash.transactionHash;
              firebasedata.createdBy = txHash.from;
              firebasedata.platforms = [];
              firebasedata.mode = mode;
              firebasedata.airdropstatus = false;

              await addCollection(firebasedata);

              let nftTokenIds = tokenIds.map((token) =>
                parseInt(Number(token))
              );
              let object = {
                tokenContract: trustifiedContract.address,
                claimerAddress: "",
                ipfsurl: `https://nftstorage.link/ipfs/${data.tokenUris[0]}/metadata.json`,
                chain: firebasedata.chain,
                name: "",
                type: type,
                mode: mode,
                claimed: "No",
                eventId: parseInt(Number(eventId)),
                Nontransferable: checked == true ? "on" : "off",
                templateId: "",
                title: firebasedata.title,
                description: firebasedata.description,
                expireDate: firebasedata.expireDate,
                issueDate: firebasedata.issueDate,
                position: "",
                uploadObj: "",
                txHash: txHash.transactionHash,
                createdBy: txHash.from,
                platforms: [],
              };

              const firebaseObj = {
                tokenIds: nftTokenIds,
                eventId: parseInt(Number(eventId)),
                object: object,
                type: type,
                mode: mode,
                csvData: csvData,
              };

              const createApi = await axios.create({
                baseURL:
                  "https://us-central1-trustified-fvm.cloudfunctions.net/api",
              });

              let createApiResponse = await createApi
                .post("/create/collector", firebaseObj)
                .then((res) => {
                  return res;
                })
                .catch((error) => {
                  console.log(error);
                });
              let obj = {
                type: type,
                data: createApiResponse.data,
              };
              const api = await axios.create({
                baseURL:
                  "https://us-central1-trustified-fvm.cloudfunctions.net/api",
              });

              let response = await api
                .post("/export/csv", obj)
                .then((res) => {
                  return res;
                })
                .catch((error) => {
                  console.log(error);
                });
              const blob = new Blob([response.data], { type: "text/csv" });
              const downloadLink = document.createElement("a");
              downloadLink.href = URL.createObjectURL(blob);
              downloadLink.download = `${firebasedata.title}.csv`;
              downloadLink.click();
              toast.success("Badges successfully issued!");
              resolve({ isResolved: true });
            }
          );
        } else {
          return reject({
            code: "NFT_OWNER",
            message: "You don't own issuer nft on the selected network!",
          });
        }
      } catch (err) {
        return reject(err);
      }
    });
  };

  const createNftFunction = function (
    csvdata,
    formData,
    type,
    templateId,
    position,
    previewUrl,
    uploadObj,
    mode,
    customeType,
    tokenURIS
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const trustifiedIssuerNFTContract = new ethers.Contract(
          trustifiedContracts[formData.chain].trustifiedIssuernft,
          trustifiedIssuerAbi.abi,
          signer
        );
        const balance = await trustifiedIssuerNFTContract.balanceOf(address);
        if (Number(balance) > 0) {
          const trustifiedContract = new ethers.Contract(
            trustifiedContracts[formData.chain].trustified,
            trustifiedContractAbi.abi,
            signer
          );
          var transactionMint = await trustifiedContract.bulkMintERC721(
            csvdata.length > 0 ? parseInt(csvdata.length) : formData.quantity,
            formData.Nontransferable === "on" ? true : false
          ); // Bulk Mint NFT collection.
          await trustifiedContract.once(
            "TokensCreated",
            async (eventId, issuer) => {
              let txm = await transactionMint.wait();
              var eventId = eventId;
              let tokenIds = await trustifiedContract.getEventTokens(eventId);
              formData.contract = trustifiedContract.address;
              formData.userId = userId;
              formData.eventId = parseInt(Number(eventId));
              formData.type = type;
              formData.image = previewUrl
                ? `https://nftstorage.link/ipfs/${previewUrl}/metadata.json`
                : template.preview;
              formData.templateId = templateId;
              formData.txHash = txm.transactionHash;
              formData.createdBy = issuer;
              formData.platforms = [];
              formData.mode = mode;
              formData.airdropstatus = false;
              await addCollection(formData);
              let nftTokenIds = tokenIds.map((token) =>
                parseInt(Number(token))
              );
              let object = {
                tokenContract: trustifiedContract.address,
                claimerAddress: "",
                chain: formData.chain,
                type: type,
                mode: mode,
                claimed: "No",
                eventId: parseInt(Number(eventId)),
                templateId: previewUrl ? "" : formData.templateId,
                Nontransferable: formData.Nontransferable,
                templateId: "",
                title: formData.title,
                description: formData.description,
                expireDate: formData.expireDate,
                issueDate: formData.issueDate,
                position: previewUrl ? position : "",
                uploadObj: previewUrl ? uploadObj.name : "",
                txHash: txm.transactionHash,
                createdBy: txm.from,
                platforms: [],
              };

              const firebaseObj = {
                tokenIds: nftTokenIds,
                type: csvdata.length > 0 ? customeType : "certi",
                eventId: parseInt(Number(eventId)),
                csvData: csvdata,
                object: object,
                mode: mode,
                tokenURIS: tokenURIS,
                previewUrl: previewUrl,
              };

              const createApi = await axios.create({
                baseURL:
                  "https://us-central1-trustified-fvm.cloudfunctions.net/api",
              });
              let createApiResponse = await createApi
                .post("/create/collector", firebaseObj)
                .then((res) => {
                  return res;
                })
                .catch((error) => {
                  console.log(error);
                });
              let obj = {
                type: type,
                data: createApiResponse.data,
              };

              const api = await axios.create({
                baseURL:
                  "https://us-central1-trustified-fvm.cloudfunctions.net/api",
              });
              let response = await api
                .post("/export/csv", obj)
                .then((res) => {
                  return res;
                })
                .catch((error) => {
                  console.log(error);
                });
              const blob = new Blob([response.data], { type: "text/csv" });
              const downloadLink = document.createElement("a");
              downloadLink.href = URL.createObjectURL(blob);
              downloadLink.download = `${formData.title}.csv`;
              downloadLink.click();

              toast.success("Certificate Successfully issued!");
              resolve({ isResolved: true });
            }
          );
        } else {
          return reject({
            code: "NFT_OWNER",
            message: "You don't own issuer nft on the selected network!",
          });
        }
      } catch (err) {
        // console.log(err);
        // toast.error("Something want wrong!!", err);
        return reject(err);
      }
    });
  };

  const airdropNFTs = async (data) => {
    const { chain, eventId, claimers, type, id } = data;

    let wallets = claimers.map((claimer) => {
      return claimer.claimerAddress;
    });

    let tokenURIs = claimers.map((claimer) => {
      return `https://nftstorage.link/ipfs/${claimer.ipfscid}/metadata.json`;
    });

    try {
      setAirdropLoading(true);
      const { chainId } = await provider.getNetwork();
      const selectedNetworkId = networkIds[chain];
      if (selectedNetworkId && chainId !== selectedNetworkId) {
        await switchNetwork(ethers.utils.hexValue(selectedNetworkId));
      }

      const providerlocal = await new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = providerlocal.getSigner();

      const trustifiedContract = new ethers.Contract(
        trustifiedContracts[chain].trustified,
        trustifiedContractAbi.abi,
        signer
      );

      const transactionAirdrop = await trustifiedContract.airdropnfts(
        wallets,
        eventId,
        tokenURIs
      );

      let txa = await transactionAirdrop.wait();
      if (txa) {
        await updateAirdroppedCollectors({
          chain: chain,
          eventId: eventId,
        });
        await updateAirdropStatus(id);
      }
      setAirdropLoading(false);
      toast.success("Successfully Airdroped nfts!");
    } catch (error) {
      setAirdropLoading(false);
      toast.error("Something went wrong! Please try again after some time!");
      console.log(error);
    }
  };

  const claimCertificate = async (
    claimToken,
    claimerAddress,
    claimer,
    textcolor,
    textFamily
  ) => {
    setClaimLoading(true);
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const input = document.getElementById("create-temp");
    const pdfWidth = 800;
    const pdfHeight = 600;
    const canvasWidth = pdfWidth * 1;
    const canvasHeight = pdfHeight * 1;

    var pdfBlob = await html2canvas(input, {
      width: canvasWidth,
      height: canvasHeight,
      scale: 2,
      allowTaint: true,
      useCORS: true,
    }).then(async (canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imageData = await fetch(imgData).then((r) => r.blob());
      return { imageData };
    });

    const imageFile = new File(
      [pdfBlob.imageData],
      `${claimer?.claimer.replace(/ +/g, "")}.png`,
      {
        type: "image/png",
      }
    );

    const metadata = await client.store({
      name: claimer?.title,
      description: claimer?.description,
      image: imageFile,
      claimer: claimer?.claimer,
      eventId: claimer?.eventId,
      expireDate: claimer?.expireDate,
      issueDate: claimer?.issueDate,
    });

    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => {
      try {
        if (fire.data().claimerAddress == "") {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            1
          );
          const txt = await transferTokenTransaction.wait();
          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
              txHash: txt.transactionHash,
            });

            toast.success("Certificate Successfully claimed!");
            setClaimLoading(false);
          }
        } else {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            address,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            1
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
              txHash: txt.transactionHash,
            });

            toast.success("Certificate Successfully claimed!");
            setClaimLoading(false);
          }
        }
      } catch (error) {
        toast.error(
          "Something went wrong! or This certificate is already claimed!"
        );
        setClaimLoading(false);
        console.log(error);
      }
    });
  };

  const claimUploadedCertificate = async (
    claimToken,
    claimerAddress,
    claimer,
    textcolor,
    width,
    height
  ) => {
    setClaimLoading(true);

    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const input = document.getElementById("certificateX");
    const pdfWidth = width;
    const pdfHeight = height;
    const canvasWidth = pdfWidth * 1;
    const canvasHeight = pdfHeight * 1;
    var metadata;
    var update = false;

    if (
      claimer?.mode == "claimurl" &&
      (claimer.claimer !== undefined || claimer.claimer !== "")
    ) {
      update = true;
      var pdfBlob = await html2canvas(input, {
        allowTaint: true,
        useCORS: true,
        width: canvasWidth,
        height: canvasHeight,
        scale: 2,
      }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imageData = await fetch(imgData).then((r) => r.blob());
        return { imageData };
      });

      const imageFile = new File(
        [pdfBlob.imageData],
        `${
          claimer?.claimer == undefined
            ? claimer.title.replace(/ +/g, "")
            : claimer?.claimer.replace(/ +/g, "")
        }.png`,
        {
          type: "image/png",
        }
      );

      metadata = await client.store({
        name: claimer?.title,
        description: claimer?.description,
        image: imageFile,
        claimer: claimer?.claimer,
        eventId: claimer?.eventId,
        expireDate: claimer?.expireDate,
        issueDate: claimer?.issueDate,
      });
    }
    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => {
      try {
        const trustifiedContract = new ethers.Contract(
          fire.data().tokenContract,
          trustifiedContracts[fire.data().chain].trustified ==
          fire.data().tokenContract
            ? trustifiedContractAbi.abi
            : trustifiedV1Abi.abi,
          signer
        );

        var transferTokenTransaction;

        if (
          trustifiedContracts[fire.data().chain].trustified ==
          fire.data().tokenContract
        ) {
          transferTokenTransaction = await trustifiedContract.safeMint(
            update
              ? `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
              : fire.data().ipfsurl,
            fire.data().tokenId,
            claimerAddress
          );
        } else {
          transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            update
              ? `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
              : fire.data().ipfsurl,
            1
          );
        }

        const txt = await transferTokenTransaction.wait();

        if (txt) {
          setClaimer(fire.data());
          await updateCollectors({
            id: fire.id,
            claimerAddress: claimerAddress,
            claimed: "Yes",
            txHash: txt.transactionHash,
            ipfsurl: update
              ? `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
              : fire.data().ipfsurl,
          });
          toast.success("Certificate Successfully claimed!");
          setClaimLoading(false);
        }
      } catch (error) {
        setClaimLoading(false);
        if (error.message === "Internal JSON-RPC error.") {
          toast.error("You don't have enough balance to claim certificate!");
        } else if (error.code === "ACTION_REJECTED") {
          toast.error(
            "MetaMask Tx Signature: User denied transaction signature!"
          );
        } else {
          toast.error("Something went wrong!");
        }
      }
    });
  };

  const claimBadges = async (claimToken, claimerAddress) => {
    setClaimLoading(true);
    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => {
      try {
        const trustifiedContract = new ethers.Contract(
          fire.data().tokenContract,
          trustifiedContracts[fire.data().chain].trustified ==
          fire.data().tokenContract
            ? trustifiedContractAbi.abi
            : trustifiedV1Abi.abi,
          signer
        );

        var transferTokenTransaction;

        if (
          trustifiedContracts[fire.data().chain].trustified ==
          fire.data().tokenContract
        ) {
          transferTokenTransaction = await trustifiedContract.safeMint(
            fire.data().ipfsurl,
            fire.data().tokenId,
            claimerAddress
          );
        } else {
          transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            "",
            0
          );
        }

        const txt = await transferTokenTransaction.wait();

        if (txt) {
          setClaimer(fire.data());
          await updateCollectorsForBadges({
            id: fire.id,
            claimerAddress: claimerAddress,
            claimed: "Yes",
            txHash: txt.transactionHash,
          });
          toast.success("Badge Successfully claimed!");
          setClaimLoading(false);
        }
      } catch (error) {
        console.log(error);
        setClaimLoading(false);
        if (error.message === "Internal JSON-RPC error.") {
          toast.error("You don't have enough balance to claim certificate!");
        } else if (error.code === "ACTION_REJECTED") {
          toast.error(
            "MetaMask Tx Signature: User denied transaction signature!"
          );
        } else {
          toast.error("Something went wrong!");
        }
      }
    });
  };

  const updateIssuerAccess = async (issuers) => {
    try {
      setUpdateIssuers(true);

      for (let i = 0; i < multiChains.length; i++) {
        let addresses = [];
        var chainsCounts = i;
        await issuers.map((issuer) => {
          if (
            issuer.networks !== undefined &&
            issuer.networks[multiChains[i].value].checked
          ) {
            addresses.push(issuer.Address);
          }
        });

        if (addresses.length > 0) {
          await switchNetwork(ethers.utils.hexValue(multiChains[i].chainId));

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const trustifiedIssuerContract = new ethers.Contract(
            trustifiedContracts[multiChains[i].value].trustifiedIssuernft,
            trustifiedIssuerAbi.abi,
            signer
          );

          const airdropIssuerNFT = await trustifiedIssuerContract.createTokens(
            "https://bafybeibsjdxc4b7p4v46322tx5nrkmemgz6e6ni5mpslmsl6wigwjec4du.ipfs.dweb.link/ItsTrustified.png",
            addresses
          );
          const txanft = await airdropIssuerNFT.wait();
          if (i == multiChains.length - 1) {
            setUpdateIssuers(false);
          }
        } else {
          toast.info(
            `Airdroped issuer nfts to all the approved issuers on ${multiChains[i].label}!`
          );
        }
        setUpdateIssuers(false);
      }
    } catch (error) {
      console.log(error);
      setUpdateIssuers(false);
    }
  };

  const checkAllowList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const { chainId } = await provider.getNetwork();

    const selectedNetwork = multiChains.filter(
      (chain) => chain.chainId == chainId
    );

    const trustifiedIssuerContract = new ethers.Contract(
      trustifiedContracts[selectedNetwork[0].value].trustifiedIssuernft,
      trustifiedIssuerAbi.abi,
      signer
    );
    let isallowed = await trustifiedIssuerContract.isAllowed();
    return isallowed;
  };

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        createNftFunction,
        createBadges,
        shortAddress,
        disconnectWallet,
        claimCertificate,
        claimUploadedCertificate,
        loginWithTrustified,
        getFirestoreData,
        claimBadges,
        updateIssuerAccess,
        claimLoading,
        setUpdate,
        csvData,
        address,
        update,
        data,
        claimer,
        userId,
        aLoading,
        switchNetwork,
        updateIssuer,
        checkAllowList,
        airdropNFTs,
        airdropLoading,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

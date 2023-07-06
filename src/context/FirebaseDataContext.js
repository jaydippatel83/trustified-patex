import { getDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { trustifiedContracts } from "../config";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  db,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "../firebase";

import axios from "axios";
import { toast } from "react-toastify";
import Web3 from "web3";

export const firebaseDataContext = createContext(undefined);

export const FirebaseDataContextProvider = (props) => {
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [rowsIssuer, setRowsIssuer] = useState([]);
  const [rowsCollection, setRowsCollection] = useState([]);
  const [badgesData, setBadgesData] = useState([]);
  const [certificatesData, setCertificates] = useState([]);
  const [claim, setClaim] = useState([]);
  const [myCollection, setMyCollection] = useState([]);
  const [claimer, setClaimer] = useState();
  const [template, setTemplate] = useState();
  const [type, setType] = useState("");
  const [certLoad, setCertLoad] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [updateStatusLoading, setUpdateLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function createDataCollector(
    claimToken,
    tokenContract,
    tokenId,
    claimerAddress,
    ipfsurl,
    name,
    claimed,
    type,
    Nontransferable,
    eventId,
    ipfscid
  ) {
    return {
      claimToken,
      tokenContract,
      tokenId,
      claimerAddress,
      ipfsurl,
      name,
      claimed,
      type,
      Nontransferable,
      eventId,
      ipfscid,
    };
  }
  function createDataCollection(
    id,
    name,
    description,
    issueDate,
    expireDate,
    type,
    eventId,
    ipfsUrl,
    chain,
    txHash,
    createdBy,
    mode,
    ipfscid,
    collectionContract,
    airdropstatus
  ) {
    return {
      id,
      name,
      description,
      issueDate,
      expireDate,
      type,
      eventId,
      ipfsUrl,
      chain,
      txHash,
      createdBy,
      mode,
      ipfscid,
      collectionContract,
      airdropstatus,
    };
  }

  useEffect(() => {
    getIssuers();
    getNFTCollections();
  }, []);

  async function addCollection(data) {
    const dd = {
      userId: data.userId,
      name: data.title,
      description: data.description,
      collectionContract: data.contract,
      chain: data.chain,
      issueDate: data.issueDate,
      eventId: data.eventId,
      type: data.type,
      Nontransferable: data.Nontransferable,
      image: data.image,
      templateId: data.templateId,
      txHash: data.txHash,
      createdBy: data.createdBy,
      platforms: data.platforms,
      mode: data.mode,
      airdropstatus: data.airdropstatus,
    };
    setLoading(true);

    await addDoc(collection(db, "Collections"), {
      userId: data.userId,
      name: data.title,
      description: data.description,
      collectionContract: data.contract,
      chain: data.chain,
      issueDate: data.issueDate,
      eventId: data.eventId,
      type: data.type,
      Nontransferable: data.Nontransferable,
      image: data.image,
      templateId: data.templateId,
      txHash: data.txHash,
      createdBy: data.createdBy,
      platforms: data.platforms,
      mode: data.mode,
      airdropstatus: data.airdropstatus,
    });

    setLoading(false);
    setUpdated(!updated);
  }

  async function addCollectors(data) {
    setLoading(true);
    await addDoc(collection(db, "Collectors"), {
      claimToken: data.token,
      tokenContract: data.tokenContract,
      tokenId: data.tokenId,
      claimerAddress: data.claimerAddress,
      ipfsurl: data.ipfsurl,
      chain: data.chain,
      name: data.name,
      claimed: data.claimed,
      type: data.type,
      Nontransferable: data.Nontransferable,
      eventId: data.eventId,
      templateId: data.templateId,
      title: data.title,
      description: data.description,
      expireDate: data.expireDate,
      issueDate: data.issueDate,
      position: data.position,
      uploadObj: data.uploadCertData,
      txHash: data.txHash,
      createdBy: data.createdBy,
      platforms: data.platforms,
    });
    setLoading(false);
    setUpdated(!updated);
  }

  async function updateCollectors(data) {
    const collectorRef = doc(db, "Collectors", data.id);
    await updateDoc(collectorRef, {
      claimerAddress: data.claimerAddress,
      claimed: data.claimed,
      txHash: data.txHash,
      ipfsurl: data.ipfsurl,
    });
  }

  async function updateCollectorsForBadges(data) {
    const collectorRef = doc(db, "Collectors", data.id);
    await updateDoc(collectorRef, {
      claimerAddress: data.claimerAddress,
      claimed: data.claimed,
      txHash: data.txHash,
    });
  }

  async function getCollections(userId) {
    try {
      const collections = query(
        collection(db, "Collections"),
        where("userId", "==", userId)
      );

      const collectionSnapshot = await getDocs(collections);

      const collectionList = collectionSnapshot.docs.map((doc) => doc.data());

      setCollections(collectionList);
    } catch (error) {
      console.log(error);
    }
  }

  async function getClaimers(eventId, chain, collectionContract) {
    const arry = [];
    try {
      setLoading(true);
      const collectors = query(
        collection(db, "Collectors"),
        where("eventId", "==", parseInt(eventId)),
        where("chain", "==", chain),
        where("tokenContract", "==", collectionContract)
      );

      const collectorsSnapshot = await getDocs(collectors);

      for (const fire of collectorsSnapshot.docs) {
        setType(fire.data().type);

        let meta = await axios.get(fire.data().ipfsurl);

        var ipfsurl = await meta.data.image.replace(
          "ipfs://",
          "https://nftstorage.link/ipfs/"
        );

        arry.push(
          createDataCollector(
            fire.data().claimToken,
            fire.data().tokenContract,
            fire.data().tokenId,
            fire.data().claimerAddress,
            ipfsurl,
            fire.data().name,
            fire.data().claimed,
            fire.data().type,
            fire.data().Nontransferable,
            fire.data().eventId,
            fire.data().ipfsurl
          )
        );
      }

      setClaim(arry);
      setLoading(false);
      return arry;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function generateClaimersExcellSheet(
    eventId,
    eventTitle,
    type,
    chain,
    mode,
    collectionContract
  ) {
    setExportLoading(true);
    let claimers = await getClaimers(eventId, chain, collectionContract);
    var arr = [];
    for (let i = 0; i < claimers.length; i++) {
      if (type == "badge") {
        if (mode == "claimurl") {
          arr.push({
            ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
          });
        } else {
          arr.push({
            address: claimers[i].claimerAddress,
            ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
          });
        }
      } else {
        if (mode == "claimurl") {
          if (claimers[i].name == "") {
            arr.push({
              ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
            });
          } else {
            arr.push({
              Name: claimers[i].name,
              ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
            });
          }
        } else {
          if (claimers[i].name == "") {
            arr.push({
              address: claimers[i].claimerAddress,
              ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
            });
          } else {
            arr.push({
              Name: claimers[i].name,
              address: claimers[i].claimerAddress,
              ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
            });
          }
        }
      }
    }
    let obj = {
      type: type,
      data: arr,
    };

    if (obj.data.length === 0) {
      toast.error("There is no data available!");
      return;
    }
    // const api = await axios.create({
    //   baseURL: "https://trustified-backend.onrender.com/trustified/api",
    // });
    const api = await axios.create({
      baseURL: "https://us-central1-trustified-fvm.cloudfunctions.net/api",
    });
    let response = await api
      .post("/export/csv", obj)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });

    setExportLoading(false);

    const blob = new Blob([response.data], { type: "text/csv" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${eventTitle}.csv`;
    downloadLink.click();
  }

  async function getClaimer(claimToken) {
    try {
      setLoading(true);
      const q = query(
        collection(db, "Collectors"),
        where("claimToken", "==", claimToken)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (fire) => {
        var obj = {};

        const template =
          fire.data().type == "badge"
            ? ""
            : fire.data().position != "" && fire.data().position != undefined
            ? ""
            : await getTemplate(fire.data().templateId);
        obj.template = template;
        obj.chain = fire.data().chain;
        obj.type = fire.data().type;
        obj.claimer = fire.data().name;
        obj.description = fire.data().description;
        obj.title = fire.data().title;
        obj.uploadObj = fire.data().uploadObj;
        obj.issueDate = fire.data().issueDate;
        obj.eventId = fire.data().eventId;
        obj.tokenId = fire.data().tokenId;
        obj.status = fire.data().claimed;
        obj.nfttype = fire.data().Nontransferable;
        obj.expireDate = fire.data().expireDate;
        obj.createdBy = fire.data().createdBy;
        obj.txHash = fire.data().txHash;
        obj.platforms = fire.data().platforms;
        obj.claimerAddress = fire.data().claimerAddress;
        obj.mode = fire.data().mode;

        let meta = await axios.get(fire.data().ipfsurl);

        obj.ipfsurl = meta.data.image.replace(
          "ipfs://",
          "https://nftstorage.link/ipfs/"
        );

        obj.ipfscid = fire.data().ipfsurl;

        obj.expireDate = fire.data().expireDate;
        obj.position = fire.data().position;
        setClaimer(obj);
      });
      setLoading(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function getIssuers(id) {
    // const arry = [];
    // const q = query(collection(db, "Collectors"),where("collectionContract", "==", id));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach(async (fire) => {
    //   arry.push(
    //     createDataIssuer(
    //       fire.data().Name,
    //       fire.data().UserName,
    //       fire.data().Address,
    //       fire.data().Bio
    //     )
    //   );
    //   setRowsIssuer(arry);
    // });
  }

  async function getNFTCollections() {
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);

    const badgesData = [];
    const certificates = [];

    for (const fire of querySnapshot.docs) {
      const qr = query(
        collection(db, "Collections"),
        where("userId", "==", fire.id)
      );
      const snap = await getDocs(qr);

      for (const e of snap.docs) {
        const date = new Date(e.data().issueDate.seconds * 1000);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const formattedDate = `${mm}/${dd}/${yyyy}`;

        let meta = await axios.get(e.data().image);

        var ipfsurl = meta.data.image.replace(
          "ipfs://",
          "https://nftstorage.link/ipfs/"
        );

        const data = createDataCollection(
          e.id,
          e.data().name,
          e.data().description,
          formattedDate,
          e.data().expireDate,
          e.data().type,
          e.data().eventId,
          ipfsurl,
          e.data().chain,
          e.data().txHash,
          e.data().createdBy,
          e.data().mode,
          e.data().image,
          e.data().collectionContract,
          e.data().airdropstatus
        );

        if (e.data().type === "badge") {
          badgesData.push(data);
        } else {
          certificates.push(data);
        }
      }
    }
    setBadgesData(badgesData);
    setCertificates(certificates);
  }

  async function getMyCollection(address) {
    let add =
      address == ""
        ? Web3.utils.toChecksumAddress(localStorage.getItem("address"))
        : Web3.utils.toChecksumAddress(address);

    if (add) {
      setCertLoad(true);
      var array = [];
      const q = query(
        collection(db, "Collectors"),
        where("claimerAddress", "==", add),
        where("claimed", "==", "Yes")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (fire) => {
        var obj;
        if (fire.exists) {
          obj = fire.data();

          let meta = await axios.get(fire.data().ipfsurl);

          obj.ipfsurl = meta.data.image.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          );

          obj.ipfscid = fire.data().ipfsurl;

          array.push(obj);
        }
        let arr = [];
        for (let i = 0; i < array.length; i++) {
          arr[i] = array[i];
        }

        setMyCollection(arr);
      });
      setCertLoad(false);
    }
  }

  const getTemplate = async (id) => {
    const docRef = doc(db, "Templates", id);
    const querySnapshot = await getDoc(docRef);
    setTemplate(querySnapshot.data());
    return querySnapshot.data();
  };

  const getTemplates = async () => {
    const docRef = doc(db, "Templates");
    const querySnapshot = await getDoc(docRef);
    // setTemplates(querySnapshot.data());
    return querySnapshot.data();
  };

  async function updateStatus(data, status) {
    setUpdateLoading(true);
    const userRef = doc(db, "UserProfile", data.id);
    await updateDoc(userRef, {
      status: status,
    });
    setUpdateLoading(false);
  }

  async function getIssuers() {
    const q = query(
      collection(db, "UserProfile"),
      where("status", "==", "approved"),
      where("verified", "==", 0)
    );
    const querySnapshot = await getDocs(q);
    let issuers = [];
    querySnapshot.forEach(async (fire) => {
      issuers.push(fire.data());
    });
    return issuers;
  }

  async function updateIssuerNFT() {
    setUpdateLoading(true);
    const q = query(
      collection(db, "UserProfile"),
      where("status", "==", "approved"),
      where("verified", "==", 0)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (fire) => {
      const userRef = doc(db, "UserProfile", fire.id);
      await updateDoc(userRef, {
        verified: 1,
      });
    });
    setUpdateLoading(false);
  }

  async function updateAirdroppedCollectors(data) {
    const q = query(
      collection(db, "Collectors"),
      where("eventId", "==", data.eventId),
      where("chain", "==", data.chain)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (fire) => {
      const userRef = doc(db, "Collectors", fire.id);
      await updateDoc(userRef, {
        claimed: "Yes",
      });
    });
  }

  async function updateAirdropStatus(id) {
    const userRef = doc(db, "Collections", id);
    await updateDoc(userRef, {
      airdropstatus: true,
    });
  }

  async function checkUserStatus(add) {
    var status;
    try {
      const q = query(
        collection(db, "UserProfile"),
        where("Address", "==", add),
        where("status", "==", "requested")
      );
      const q1 = query(
        collection(db, "UserProfile"),
        where("Address", "==", add),
        where("status", "==", "rejected")
      );
      const q2 = query(
        collection(db, "UserProfile"),
        where("Address", "==", add)
      );
      const querySnapshot = await getDocs(q);
      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);
      if (!querySnapshot.empty) {
        setOpen(true);
        setMessage("We are reviewing your request. Please hold thight!");
        navigate("/dashboard/profile");
        status = false;
      } else if (!querySnapshot1.empty) {
        setOpen(true);
        setMessage(
          "Your request has been not approved due to insufficient information."
        );
        navigate("/dashboard/profile");
        status = false;
      } else if (querySnapshot2.empty) {
        setOpen(true);
        setMessage("Please fill up profile and request access.");
        navigate("/dashboard/profile");
        status = false;
      } else {
        setOpen(false);
        setMessage("");
        status = true;
      }
      return status;
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <firebaseDataContext.Provider
      value={{
        addCollection,
        getCollections,
        addCollectors,
        updateCollectors,
        updateCollectorsForBadges,
        getTemplates,
        updated,
        loading,
        collections,
        rowsIssuer,
        rowsCollection,
        badgesData,
        certificatesData,
        claim,
        claimer,
        getClaimers,
        getClaimer,
        getMyCollection,
        getNFTCollections,
        generateClaimersExcellSheet,
        myCollection,
        getTemplate,
        template,
        type,
        certLoad,
        exportLoading,
        setCertLoad,
        updateStatus,
        getIssuers,
        updateIssuerNFT,
        updateAirdroppedCollectors,
        updateAirdropStatus,
        checkUserStatus,
        handleClose,
        open,
        message,
        updateStatusLoading,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};


import React, { useState } from "react"; 
import { db } from "../../firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import { collection, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";

const UploadPreview = ({ claimer, id }) => {
  const [loaded, setLoaded] = useState(false);

  // async function deleteData() {
  //   const docref = query(
  //     collection(db, "Collectors"),
  //     where("chain", "==", 'mumbai')
  //   );
  //   const querySnapshot = await getDocs(docref);
  //   querySnapshot.forEach((doc) => {  
  //     deleteDoc(doc.ref).then(() => {
  //       console.log("Document with ID " + doc.id + " has been deleted successfully.");
  //     }).catch((error) => {
  //       console.error("Error deleting document with ID " + doc.id + ": ", error);
  //     });
  //   })
  // }


  return (
    <>
      <div
        id="certificateX"
        style={{
          position: "relative",
          width: claimer.uploadObj.width,
          height: claimer.uploadObj.height,
        }}
      >
        <LazyLoadImage
          alt="Image Alt"
          height={claimer.uploadObj.height}
          src={claimer.ipfsurl}
          placeholderSrc="/assets/bg-preview.jpg"
          width={claimer.uploadObj.width}
          onLoad={() => setLoaded(!loaded)}
          effect="blur"
        />

        {loaded === true && claimer.status !== "Yes" && (
          <>
            <div style={claimer.uploadObj.style}>{claimer?.claimer}</div>
            <div
              style={{
                position: "absolute",
                right: 0,
                padding: "0 5px",
                bottom: 0,
                color: claimer.uploadObj.style.color,
                fontSize: "12px",
              }}
            >
              Id: {id}
            </div>
          </>
        )}

        {/* <button onClick={deleteData}>delete</button> */}

      </div>
    </>
  );
};

export default UploadPreview;

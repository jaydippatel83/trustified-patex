import React, { useEffect, useState } from "react";
import { 
  doc,
  getDoc, 
} from "firebase/firestore";
import { db } from "../../firebase";

const TemplateEdit = ({ id }) => {
  const [data, setdata] = useState();
  const [uploadLogo, setLogo] = useState("");
  const [uploadSign, setSignature] = useState("");

  const getTemplates = async () => {
    const docRef = doc(db, "Templates", id);
    const querySnapshot = await getDoc(docRef);

    setdata(querySnapshot.data());
  };

  useEffect(() => {
    getTemplates();
  }, [id]);

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setLogo(URL.createObjectURL(image));
  };
  const handleSignature = (e) => {
    const image = e.target.files[0];
    setSignature(URL.createObjectURL(image));
  };

  return (
    <>
      {data && (
        <div
          id="create-temp"
          style={{
            position: "relative",
            width: data.width,
            height: data.height,
          }}
        >
          <img src={data.bgImage} width={data.width} height={data.height} />
          <div  style={data.title.style}>
            {data.title.text}
          </div>
          <div  style={data.subTitle.style}>
            {data.subTitle.text}
          </div>
          <div  style={data.certName.style}>
            {data.certName.text}
          </div>
          <div id="certName"  style={data.name.style}>
            {data.name.text}
          </div>
          <div  style={data.description.style}>
            {data.description.text}
          </div>
          <div id="validity"  style={data.date.style}>
            {data.date.text}
          </div>
          <input
            id="upload-button"
            style={{ display: "none" }}
            onChange={(e) => handleImageChange(e)}
            hidden
            accept="image/*"
            multiple
            type="file"
          />
          <label htmlFor="upload-button" style={data.logo.style}>
            <img
              src={uploadLogo ? uploadLogo : data.logo.img}
              style={{ cursor: "pointer" }}
              width="80"
            />
          </label>

          <input
            id="upload-sign"
            style={{ display: "none" }}
            onChange={(e) => handleSignature(e)}
            hidden
            accept="image/*"
            multiple
            type="file"
          />
          <label htmlFor="upload-sign" style={data.sign.style}>
            <img
              src={uploadSign ? uploadSign : data.sign.img}
              style={{ cursor: "pointer" }}
              width="100"
            />
          </label>
        </div>
      )}
    </>
  );
};

export default TemplateEdit;


import WebFont from 'webfontloader';
import { Box } from '@mui/system';
import { SketchPicker } from 'react-color';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import React, { useState, useMemo, useCallback, useRef, useEffect, createContext } from 'react';
import Draggable from 'react-draggable';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

import { NFTStorage, File } from "nft.storage";


const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });


export const TemplateConext = createContext(undefined);

export const TemplateContextProvider = (props) => {
  const [title, setTitle] = useState({
    x: 143.8812255859375,
    y: -570.6504516601562
  });
  const [subTitle, setSubTitle] = useState({
    x:
      143.41932678222656, y: -525.7605285644531
  });
  const [certName, setCertName] = useState({ x: 154.3270263671875, y: -459.1444396972656 });
  const [name, setName] = useState({ x: 136.3018035888672, y: -389.3641662597656 });
  const [description, setDiscription] = useState({
    x: 138.65078735351562, y:
      -316.35302734375
  });
  const [logo, setLogo] = useState({
    x:
      -437.05692291259766, y: 431.80645751953125
  });
  const [date, setDate] = useState({
    x: 191.7780303955078, y:
      -134.22698974609375
  });
  const [sign, setSign] = useState({ x: -274.06378857421873, y: 453.3707060546875 });
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [uploadBg, setUploadBg] = useState("");
  const [uploadLogo, setUploadLogo] = useState("");
  const [preview, setPreview] = useState("");
  const [uploadSign, setUploadSign] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);
  const nodeRef = React.useRef(false);
  const storage = getStorage();

  const [colors, setColor] = useState("#36219e");
  const [fontSize, setFontSize] = useState(24);
  const [bold, setBold] = useState(500);
  const [certCategory, setCertCategory] = useState("Hackathon");
  const [bgurl, setBgurl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [signUrl, setSignUrl] = useState("");


  const imageRef = React.useRef();

  async function changeBgImage(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setBgurl(url);
    const storageRef = ref(storage, `Photo/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setUploadBg(url);
      });
    });
  }
  async function changeLogo(e) {

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
    const storageRef = ref(storage, `Template/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setUploadLogo(url);
      });
    });
  }
  async function changeSign(e) {

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setSignUrl(url);
    const storageRef = ref(storage, `Photo/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setUploadSign(url);
      });
    });


  }


  const template = {
    bgImage: uploadBg,
    width: 800,
    height: 600,
    preview: preview,
    category: certCategory,
    title: {
      text: 'certificate',
      position: title,
      style: {
        position: 'absolute',
        color: title?.color?.hex ? title?.color?.hex : '#860a1e',
        fontSize: `${title?.size}px` ? `${title?.size}px` : '40px',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '500px',
        margin: '10px auto',
        fontFamily: title?.font ? title?.font : 'Poppins',
        fontWeight: title?.bold ? title?.bold : 800,
        transform: `translate(${title.x}px, ${title.y}px)`
      }
    },
    subTitle: {
      text: 'of Achievement',
      position: subTitle,
      style: {
        position: 'absolute',
        textAlign: 'center',
        width: '500px',
        margin: '10px auto',
        color: subTitle?.color?.hex ? subTitle?.color?.hex : '##860a1e',
        fontSize: `${subTitle?.size}px` ? `${subTitle?.size}px` : ' 16px',
        textTransform: 'capitalize',
        fontFamily: subTitle?.font ? subTitle?.font : 'Poppins',
        fontWeight: subTitle?.bold ? subTitle?.bold : 600,
        transform: `translate(${subTitle.x}px, ${subTitle.y}px)`
      }
    },
    certName: {
      position: certName,
      text: 'This certificate is awarded to :',
      style: {
        position: 'absolute',
        textAlign: 'center',
        width: '500px',
        margin: '10px auto',
        color: certName?.color?.hex ? certName?.color?.hex : '##860a1e',
        fontSize: `${certName?.size}px` ? `${certName?.size}px` : ' 14px',
        textTransform: 'capitalize',
        fontFamily: certName?.font ? certName?.font : 'Poppins',
        fontWeight: certName?.bold ? certName?.bold : 400,
        transform: `translate(${certName.x}px, ${certName.y}px)`
      }
    },
    name: {
      text: 'Your Name',
      id: 'name',
      position: name,
      style: {
        position: 'absolute',
        textAlign: 'center',
        width: '500px',
        margin: '10px auto',
        color: name?.color?.hex ? name?.color?.hex : ' #860a1e',
        fontSize: `${name?.size}px` ? `${name?.size}px` : ' 40px',
        fontFamily: name?.font ? name?.font : 'Pinyon Script',
        transform: `translate(${name.x}px, ${name.y}px)`,
        fontWeight: name?.bold ? name?.bold : 600,
      }
    },
    description: {
      position: description,
      text: 'This award is given for outstanding achievement for having dedicated a good job for 1 years',
      style: {
        textAlign: 'center',
        position: 'absolute',
        fontSize: `${description?.size}px` ? `${description?.size}px` : ' 14px',
        color: description?.color?.hex ? description?.color?.hex : "",
        width: '500px',
        margin: '10px auto',
        fontFamily: description?.font ? description?.font : 'Poppins',
        lineHeight: 'normal',
        fontWeight: description?.bold ? description?.bold : 400,
        transform: `translate(${description.x}px, ${description.y}px)`
      }
    },
    sign: {
      position: sign,
      img: uploadSign,
      style: {
        position: 'absolute',
        transform: `translate(${sign.x}px, ${sign.y}px)`,
        width: '100px'
      }
    },
    date: {
      position: date,
      text: 'Date',
      style: {
        position: 'absolute',
        fontWeight: date?.bold ? date?.bold : 400,
        color: date?.color?.hex ? date?.color?.hex : '#000',
        fontSize: `${date?.size}px` ? `${date?.size}px` : ' 16px',
        fontFamily: date?.font ? date?.font : 'Poppins',
        transform: `translate(${date.x}px, ${date.y}px)`
      }
    },
    logo: {
      position: logo,
      img: uploadLogo,
      style: {
        position: 'absolute',
        transform: `translate(${logo.x}px, ${logo.y}px)`,
        width: '80px',
        height: '80px'
      }
    },

  };



  useMemo(() => {
    WebFont.load({
      google: {
        families: ['Roboto',
          'Borsok', 'Open Sans',
          'Lato', 'Poppins', 'Zeyada',
          'Babylonica', 'Dancing Script',
          'Lobster', 'Pacifico', 'Caveat',
          'Satisfy', 'Great Vibes', 'Ole', 'Coiny', 'Kenia', 'Rubik Beastly', 'Londrina Sketch', 'Neonderthaw',
          'Kumar One', 'Ribeye', 'Emblema One', 'Ewert', 'Kavoon', 'Moul', 'Rubik Moonrocks', 'Rubik Iso',
          'Unifraktur Cook', 'Germania One', 'Monoton', 'Orbitron', 'Rampart One', 'Black Ops One',
          'Aldrich', 'Schoolbell','UnifrakturMaguntia', 'Montez', 'DotGothic16', 'Lexend Zetta', 'UnifrakturCook',
          'Iceland'
        ],
      },
      active: () => setSelectedFont('Roboto'),
    });
  }, []);

  function generateClaimToken(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678910";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const uploadTemplate = async () => {
    await html2canvas(imageRef.current, {
      useCORS: true,
      allowTaint: true,
    }).then(async (canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const name = generateClaimToken(10);
      const imageData = await fetch(imgData).then(r => r.blob());
      const canvasRef = ref(storage, `Templates/${name}.png`);
      await uploadBytes(canvasRef, imageData);
      const downloadURL = await getDownloadURL(canvasRef);
      template.preview = downloadURL;
      await addDoc(collection(db, "Templates"), template);
      toast.success("Save Successfully!")
    });
  }

  const handleFontChange = useCallback(event => {
    setSelectedFont(event.target.value);
  }, []);

  const handleSizeChange = useCallback(e => {
    setFontSize(e.target.value)
  }, []);

  const handleBoldChange = useCallback(e => {
    setBold(e.target.value)
  }, []);

  useEffect(() => {
    if (selectedElement === "title") {
      setTitle({ ...title, font: selectedFont, color: colors, size: fontSize, bold: bold });
    } else if (selectedElement === "sub-title") {
      setSubTitle({ ...subTitle, font: selectedFont, color: colors, size: fontSize, bold: bold });
    } else if (selectedElement === "cert-name") {
      setCertName({ ...certName, font: selectedFont, color: colors, size: fontSize, bold: bold });
    } else if (selectedElement === "name") {
      setName({ ...name, font: selectedFont, color: colors, size: fontSize, bold: bold });
    } else if (selectedElement === "description") {
      setDiscription({ ...description, font: selectedFont, color: colors, size: fontSize, bold: bold });
    } else {
      setDate({ ...date, font: selectedFont, color: colors, size: fontSize, bold: bold });
    }
  }, [selectedFont, colors, fontSize, bold])



  const handleDivClick = (event) => {
    event.stopPropagation();
    setSelectedElement(event.currentTarget.id);
  };

  const handleChangeColor = (color) => {
    setColor(color)
  }

  const handleChangeCategory = useCallback(e => {
    setCertCategory(e.target.value)
  }, []);


  return (
    <TemplateConext.Provider
      value={{
        colors,
        handleChangeColor,
        title,
        setTitle,
        certName,
        setCertName,
        name,
        setName,
        description,
        setDiscription,
        handleDivClick,
        logo,
        setLogo,
        date,
        setDate,
        sign,
        setSign,
        uploadBg,
        uploadLogo,
        uploadSign,
        nodeRef,
        template,
        uploadTemplate,
        changeBgImage,
        changeLogo,
        changeSign,
        selectedFont,
        handleFontChange,
        fontSize,
        handleSizeChange,
        bold,
        handleBoldChange,
        certCategory,
        handleChangeCategory,
        imageRef,
        subTitle,
        setSubTitle,
        bgurl,
        logoUrl,
        signUrl,
      }}
      {...props}
    >
      {props.children}
    </TemplateConext.Provider>
  );

}





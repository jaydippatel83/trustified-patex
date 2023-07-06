import React from "react";

const TemplatePreview = ({ id, data, name, issueDate }) => {

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  } 
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
          <img src={data.bgImage} width={data.width} height={data.height} alt="" />
          <div className="claim-margin" style={data.title.style} >{data.title.text}</div>
          <div style={data.subTitle.style}>{data.subTitle.text}</div>
          <div style={data.certName.style}>{data.certName.text}</div>
          <div className="claim-margin"  id="certName"  style={data.name.style}>
            {name}
          </div>
          <div style={data.description.style}>{data.description.text}</div>

          <div id="validity" style={data.date.style}>
            {formatDate(new Date(issueDate?.seconds * 1000))}
          </div>

          <label htmlFor="upload-button" style={data.logo.style}>
            <img src={data.logo.img} style={{ cursor: "pointer" }} width="80"  alt=""/>
          </label>

          <label htmlFor="upload-sign" style={data.sign.style}>
            <img
              src={data.sign.img}
              style={{ cursor: "pointer" }}
              width="100"
              alt=""
            />
          </label>
          <div style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            padding: '0 5px',
            color: data.title.style.color,
            fontSize: '18px'
          }}>
            {id}
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatePreview;

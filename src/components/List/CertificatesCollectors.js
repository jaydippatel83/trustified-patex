import * as React from "react";
import Paper from "@mui/material/Paper";

export default function Certificates({ data }) {
  const [certificates, setCertificates] = React.useState([]);

  React.useEffect(() => {
    setCertificates(data);
  }, [data]);

  return (
    <>
      {certificates.map((item, i) => {
        return (
          <div key={i} className="col-lg-3 col-md-4 col-sm-6 col-12">
            <Paper className="certificatesCard">
              <img
                className="certificate"
                src={item?.ipfsurl}
                alt={item.name}
              />

              <span className="certificateDescription"> {item.name}</span>
            </Paper>
          </div>
        );
      })}
    </>
  );
}

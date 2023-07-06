import React, { useEffect } from "react";
import { Paper } from "@mui/material";

const Badges = ({ data }) => {
  const [badges, setBadges] = React.useState([]);

  useEffect(() => {
    setBadges(data);
  }, [data]);

  return (
    <>
      {badges.map((item, i) => {
        return (
          <div key={i} className="col-lg-3 col-md-4 col-sm-6 col-12">
            <Paper className="badgeCard" sx={{ borderRadius: "2em" }}>
              <img
                className="badgeItem m-auto m-2"
                src={item?.ipfsurl}
                alt={item.name}
              />

              <span className="badgeDescription"> {item.name}</span>
              <span className="optionspan">
                <a target="_blank" rel="noreferrer" href={item?.ipfsurl}>
                  Preview
                </a>
              </span>
            </Paper>
          </div>
        );
      })}
    </>
  );
};

export default Badges;

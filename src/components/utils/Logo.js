import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// material
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/" className="navbar-brand" style={{ padding: "20px" }}>
      {/* <Box component="img" src="/images/logo.png" sx={{ padding: '10px',margin:'15px 5px', height: 60, ...sx }} /> */}

      <img
        src="/images/logo.png"
        className="main-logo"
        width="119"
        alt="alter text"
      />
    </RouterLink>
  );
}

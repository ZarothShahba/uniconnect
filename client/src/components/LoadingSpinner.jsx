import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5rem",
        // height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default LoadingSpinner;

import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      {/* <Box
        width="100%"
        backgroundColor="#FA991C"
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="#FFFFFF">
          UniConnect
        </Typography>
      </Box> */}

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="1rem 1rem 1rem 1rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        // style={{
        //   backgroundImage: `url("https://lh3.googleusercontent.com/proxy/34GJ84VEoFcV5Cj_gSFVubyHr4MpnXxjrah2FmrIQwAaQgU7rgXBotIcyfsyNCCF9PXmIJ-PIroju-4y_COkggyaHiDK6HQeGj-ScUo_GrEb")`, // Set background image
        //   backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
        // }}
      >
        {/* <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to UniConnect, Login into your UniConnect Account!
        </Typography> */}
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;

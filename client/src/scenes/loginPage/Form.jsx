import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setAllUsers } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import toast from "react-hot-toast";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
  otp: yup
    .string()
    .required("required")
    .matches(/^\d{6}$/, "Invalid OTP"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
  otp: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [disableRegister, setDisableRegister] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [sentOTP, setSentOTP] = useState(null);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    try {
      // this allows us to send form info with image
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append("picturePath", values.picture.name);

      const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!savedUserResponse.ok) {
        const errorData = await savedUserResponse.json();
        toast.error(errorData.error);
        return;
      }
      const savedUser = await savedUserResponse.json();
      toast.success("User Registered!");
      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const fetchAllUsers = await fetch("http://localhost:3001/users/getAll", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!loggedInResponse.ok) {
        // Handle non-2xx HTTP status codes (e.g., 4xx, 5xx)
        const errorData = await loggedInResponse.json();
        toast.error(errorData.msg);
        return;
      }

      if (!fetchAllUsers.ok) {
        const errorData = await loggedInResponse.json();
        toast.error("Error fetching all users", errorData);
        return;
      }

      const loggedIn = await loggedInResponse.json();
      toast.success("Logged In!");

      const allUsers = await fetchAllUsers.json();
      dispatch(setAllUsers({ allUsers }));

      onSubmitProps.resetForm();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/home");
      }
    } catch (error) {
      // Handle network errors or exceptions
      toast.error(error.message);
    }
  };

  const sendCode = async (email) => {
    const isEmailEmpty = (email) => {
      return email.trim() === "";
    };
    try {
      if (isEmailEmpty(email)) {
        // Handle the case where the email is empty
        console.error("Email is empty");
        toast.error("Email is Empty!");
        return;
      }
      const response = await fetch(`http://localhost:3001/auth/genOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Error Sending OTP", errorData);
        return;
      }
      const OTP = await response.json();
      toast.success(`OTP Sent To ${email}!`);
      setSentOTP(OTP); // Store OTP in state
      setShowOTP(true);
      return OTP;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const validateOTP = (userEnteredOTP) => {
    setDisableRegister(userEnteredOTP !== sentOTP);
    return userEnteredOTP.trim() === sentOTP.trim();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {/* Left Section with Logo and Text */}
      {isRegister ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="left"
          pr={6} // Adjust the padding as needed
        >
          {/* <img src="/path/to/logo.png" alt="Logo" width="100" height="100" /> */}
          {/* <Typography variant="h1" color="#FA991C" fontWeight="700">
            UniConnect
          </Typography>
          <Typography variant="h5">
            UniConnect helps to unlock <br />
            new knowledge and build connections.
          </Typography> */}
          {/* Add any additional text or components here */}
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="left"
          pr={6} // Adjust the padding as needed
        >
          {/* <img src="/path/to/logo.png" alt="Logo" width="100" height="100" /> */}
          <Typography variant="h1" color="#FA991C" fontWeight="700">
            UniConnect
          </Typography>
          <Typography variant="h5">
            UniConnect helps to unlock <br />
            new knowledge and build connections.
          </Typography>
          {/* Add any additional text or components here */}
        </Box>
      )}

      {/* Right Section with Form */}
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <img
                src="../assets/logo.png"
                alt="twitter"
                height="90"
                width="90"
                style={{ display: "block", margin: "0 auto" }}
              />
              <Typography variant="h3" color="#000000" fontWeight="500">
                UniConnect
              </Typography>
            </div>
            {isRegister && (
              <>
                <Typography
                  variant="h4"
                  color="blue"
                  fontWeight="500"
                  marginBottom="25px"
                >
                  Sign Up
                </Typography>
              </>
            )}
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 2,
                            border: "2px dashed lightgray",
                            borderRadius: 2,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "lightblue",
                            },
                          }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              {isRegister && (
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: "#FA991C",
                    color: palette.background.alt,
                    "&:hover": { color: "#1C768F" },
                  }}
                  onClick={() => sendCode(values.email)}
                >
                  SEND CODE
                </Button>
              )}
              {isRegister && showOTP && (
                <Box display="flex" alignItems="center" gap="10px">
                  <TextField
                    label="OTP"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.otp}
                    name="otp"
                    error={Boolean(touched.otp) && Boolean(errors.otp)}
                    helperText={touched.otp && errors.otp}
                  />
                  <Button
                    fullWidth
                    sx={{
                      m: "2rem 0",
                      p: "1rem",
                      backgroundColor: "#1C768F",
                      color: palette.background.alt,
                      "&:hover": { color: "#FA991C" },
                    }}
                    onClick={() => validateOTP(values.otp)}
                  >
                    VALIDATE OTP
                  </Button>
                </Box>
              )}
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: "#FA991C",
                  color: palette.background.alt,
                  "&:hover": { color: "#1C768F" },
                }}
                disabled={isRegister && disableRegister}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: "#FA991C",
                  "&:hover": {
                    cursor: "pointer",
                    color: "#1C768F",
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;

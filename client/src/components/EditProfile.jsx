// EditUserPopup.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  Avatar,
  Input,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setLogout } from "state";

const EditUserPopup = ({ open, handleClose, user }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [editedUser, setEditedUser] = useState(user);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user.picturePath
      ? `http://localhost:3001/public/assets/picture/${user.picturePath}`
      : null
  );

  const handleInputChange = (event) => {
    // Handle input changes and update the state
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    // Create a new object URL for the selected picture to preview
    const newPreviewUrl = file ? URL.createObjectURL(file) : null;
    setPreviewUrl(newPreviewUrl);

    // Save the selected file
    setProfilePicture(file);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("id", editedUser._id);

      // Update only the fields that have changed
      if (editedUser.password) {
        formData.append("password", editedUser.password);
      }

      if (editedUser.firstName) {
        formData.append("firstName", editedUser.firstName);
      }

      if (editedUser.lastName) {
        formData.append("lastName", editedUser.lastName);
      }

      if (editedUser.location) {
        formData.append("location", editedUser.location);
      }

      if (editedUser.occupation) {
        formData.append("occupation", editedUser.occupation);
      }

      if (profilePicture) {
        formData.append("picture", profilePicture);
      }
      // Log the content of the FormData to the console
      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const response = await fetch(
        `http://localhost:3001/users/${editedUser._id}/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Profile updated successfully");
        toast.success("Profile Updated!, Please Login Again");
        handleClose();
        dispatch(setLogout());
      } else {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData.error);
        // Handle errors here, display an error message to the user
        toast.error(errorData);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      // Handle errors here, display an error message to the user
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${editedUser._id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Profile Deleted successfully");
        toast.success("Profile Deleted!");
        handleClose();
        dispatch(setLogout());
      } else {
        const errorData = await response.json();
        console.error("Error Deleting User:", errorData.error);
        // Handle errors here, display an error message to the user
        toast.error(errorData);
      }
    } catch (error) {
      console.error("Error Delete profile:", error.message);
      // Handle errors here, display an error message to the user
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User Information</DialogTitle>
      <Divider />
      <DialogContent>
        {/* Profile Picture */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Profile Picture */}
          <Avatar
            alt={`${editedUser.firstName} ${editedUser.lastName}`}
            src={previewUrl}
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />

          {/* File Input for Changing Profile Picture */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            sx={{ marginBottom: 2 }}
          />
        </Box>
        <TextField
          label="First Name"
          name="firstName"
          value={editedUser.firstName}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Last Name"
          name="lastName"
          value={editedUser.lastName}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Location"
          name="location"
          value={editedUser.location}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Occupation"
          name="occupation"
          value={editedUser.occupation}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          placeholder="********" // Use any placeholder text you prefer
          value={editedUser.password || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {/* Add more fields as needed */}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <Box>
          <Button onClick={handleDelete} color="error">
            Delete User
          </Button>
        </Box>
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserPopup;

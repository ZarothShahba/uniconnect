import {
  Typography,
  Avatar,
  Button,
  Box,
  IconButton,
  Input,
} from "@mui/material";
import React, { useState } from "react";
import { Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setGroups } from "state";
import toast from "react-hot-toast";

const CreateGroupForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);

  // State to manage form inputs
  const [groupData, setGroupData] = useState({
    profilePicture: "",
    groupName: "",
    groupDescription: "",
    groupMembers: [],
    newPreviewUrl: null,
  });

  const [newPreviewUrl, setNewPreviewUrl] = useState(null);

  // Function to handle file selection for profile picture
  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];

    // Update the state to store the selected file
    setGroupData((prevData) => ({
      ...prevData,
      profilePicture: selectedFile,
    }));

    // Update the preview URL state
    setNewPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  // Function to handle form submission
  const handleCreateGroup = async () => {
    try {
      // Check if required fields are filled
      if (
        !groupData.groupName ||
        !groupData.groupDescription ||
        !groupData.groupMembers.length
      ) {
        toast.error("Fill all the Fields");
        return;
      }

      // Create FormData to send a multipart/form-data request
      const formData = new FormData();
      formData.append("creatorId", _id);
      formData.append("groupName", groupData.groupName);
      formData.append("groupDescription", groupData.groupDescription);
      formData.append("picture", groupData.profilePicture);
      // Append each member ID to the FormData
      groupData.groupMembers.forEach((memberId) => {
        formData.append("groupMembers", memberId);
      });

      // Log the content of the FormData to the console
      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      console.log(groupData.groupMembers.length);

      // Make the API request to create a group
      const response = await fetch("http://localhost:3001/group/create", {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // Check if the request was unsuccessful
        const errorData = await response.json();
        console.error("Error creating group:", errorData.error);
        toast.error(errorData);
        return;
      }

      // If the group is successfully created
      const data = await response.json();
      console.log("Group created successfully:", data);
      toast.success("Group Created!");

      // Refresh groups data by dispatching the updated data
      dispatch(setGroups({ groups: data.allGroups }));

      // Reset form data
      setGroupData({
        profilePicture: "",
        groupName: "",
        groupDescription: "",
        groupMembers: [],
      });

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Group
        </Typography>
        <IconButton onClick={onClose} sx={{ marginLeft: 38, marginTop: -7 }}>
          <CloseIcon color="error" />
        </IconButton>

        {/* Profile Picture */}
        {/* You can use the Avatar component to display the profile picture */}
        <Avatar
          alt="Group Avatar"
          src={newPreviewUrl || groupData.profilePicture}
          sx={{ width: 64, height: 64, mb: 2 }}
        />
        {/* File Input for Changing Profile Picture */}
        <Input
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          sx={{ mb: 2 }}
        />

        {/* Group Name */}
        <TextField
          label="Group Name"
          fullWidth
          value={groupData.groupName}
          onChange={(e) =>
            setGroupData({ ...groupData, groupName: e.target.value })
          }
          margin="normal"
        />

        {/* Group Description */}
        <TextField
          label="Group Description"
          fullWidth
          multiline
          rows={4}
          value={groupData.groupDescription}
          onChange={(e) =>
            setGroupData({ ...groupData, groupDescription: e.target.value })
          }
          margin="normal"
        />

        {/* Group Members */}
        {/* You can list all users and let the user select members */}
        {/* You might want to replace the div with a proper dropdown or a list of users */}
        <div>
          <Typography variant="subtitle1" mb={1}>
            Group Members
          </Typography>
          {/* Replace this with your actual implementation */}
          <div>
            {/* List of users with checkboxes or some other interaction */}
            {/* Example: */}
            {/* Assume you have a list of allUsers in your Redux state */}
            {allUsers.map((user) => (
              <div key={user._id}>
                <input
                  type="checkbox"
                  id={user._id}
                  checked={groupData.groupMembers.includes(user._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Add the user to the selected group members
                      setGroupData((prevData) => ({
                        ...prevData,
                        groupMembers: [...prevData.groupMembers, user._id],
                      }));
                    } else {
                      // Remove the user from the selected group members
                      setGroupData((prevData) => ({
                        ...prevData,
                        groupMembers: prevData.groupMembers.filter(
                          (id) => id !== user._id
                        ),
                      }));
                    }
                  }}
                />
                <label htmlFor={user._id}>{user.firstName}</label>
              </div>
            ))}
          </div>
        </div>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGroup}
          >
            Create Group
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateGroupForm;

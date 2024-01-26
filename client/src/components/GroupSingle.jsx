import React from "react";
import {
  Card,
  Avatar,
  Divider,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DeleteForeverOutlined } from "@mui/icons-material";
import { setGroups } from "state";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GroupSingle = ({ groupId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const allGroups = useSelector((state) => state.groups);
  const user = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  // Find the group with the specified groupId
  const group = allGroups.find((group) => group._id === groupId);
  const isGroupOwner = group.creatorId === user;
  if (!group) {
    // Handle the case where the group is not found
    return null;
  }

  const deleteGroup = async (evt) => {
    evt.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:3001/groups/delete/${groupId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const deletedGroup = await response.json();

      const updatedGroups = allGroups.filter(
        (group) => group._id !== deletedGroup._id
      );
      dispatch(setGroups({ groups: updatedGroups }));

      toast.success("Group deleted successfully!");
    } catch (error) {
      console.error("Error deleting Group:", error);
      toast.error(error.message);
    }
  };

  const groupAvatarSrc =
    `http://localhost:3001/public/assets/picture/${group.profilePicture}` ||
    "https://www.govloop.com/wp-content/uploads/2015/06/data-brain-e1448373467709.jpg";

  return (
    <Card
      onClick={() => navigate(`/groups/${groupId}`)}
      sx={{
        borderRadius: "1rem",
        margin: "8px",
        position: "relative",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          cursor: "pointer",
        },
      }}
    >
      {/* Group Profile Picture */}
      <div
        style={{
          backgroundColor: theme.palette.mode === "light" ? "#BBD6DD" : "grey",
          padding: "1rem",
          borderRadius: "1rem 1rem 0 0",
        }}
      >
        <Avatar
          alt={group.groupName}
          src={groupAvatarSrc}
          sx={{ width: 56, height: 56 }}
        />
      </div>
      {/* Group Name and Member Count on the Right Side */}
      <div style={{ padding: "1rem" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "#1C768F", marginBottom: "0.5rem" }}
        >
          {group.groupName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Members: {`${group.groupMembers.length}`}
        </Typography>
      </div>
      {isGroupOwner && (
        <IconButton
          sx={{
            position: "absolute",
            top: "15px",
            right: "15px",
            color: "#1C768F",
            "&:hover": {
              color: "red",
            },
          }}
          onClick={(evt) => deleteGroup(evt)}
        >
          <DeleteForeverOutlined />
        </IconButton>
      )}
      <Divider />
    </Card>
  );
};

export default GroupSingle;

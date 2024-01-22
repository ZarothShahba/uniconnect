import React from "react";
import { Card, Avatar, Divider, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useSelector, useDispatch } from "react-redux";
import { DeleteForeverOutlined } from "@mui/icons-material";
import { setGroups } from "state";
import toast from "react-hot-toast";

const GroupSingle = ({ groupId }) => {
  const dispatch = useDispatch();
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
  const deleteGroup = async () => {
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

      const deleteGroup = await response.json();

      const updatedGroups = allGroups.filter(
        (group) => group._id !== deleteGroup._id
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
    <Card sx={{ borderRadius: "1rem", margin: "8px", position: "relative" }}>
      {/* Group Profile Picture */}
      <FlexBetween padding="2rem">
        <Avatar
          alt={group.groupName}
          src={groupAvatarSrc}
          sx={{ width: 56, height: 56 }}
        />
        {/* Group Name and Member Count on the Right Side */}
        <div>
          <Typography variant="h5" component="div">
            {group.groupName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Members: {`${group.groupMembers.length}`}
          </Typography>
        </div>
        {isGroupOwner && (
          <DeleteForeverOutlined
            sx={{
              position: "absolute",
              top: "15px",
              right: "15px",
              color: "#1C768F",
              "&:hover": {
                color: "red",
                cursor: "pointer",
              },
            }}
            onClick={() => deleteGroup()}
          />
        )}
      </FlexBetween>
      <Divider />
    </Card>
  );
};

export default GroupSingle;

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import GroupSingle from "components/GroupSingle";

const GroupList = () => {
  const allGroups = useSelector((state) => state.groups);

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Groups
      </Typography>
      <List>
        {allGroups.map((group) => (
          <GroupSingle key={group._id} groupId={group._id} />
        ))}
      </List>
    </Box>
  );
};

export default GroupList;

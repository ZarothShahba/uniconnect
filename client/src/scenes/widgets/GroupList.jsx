import React from "react";
import { Box, List, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import GroupSingle from "components/GroupSingle";

const GroupList = () => {
  const userId = useSelector((state) => state.user._id);
  const allGroups = useSelector((state) => state.groups);

  // Filter out groups where the current user is not a member
  const userGroups = allGroups.filter((group) =>
    group.groupMembers.includes(userId)
  );

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Groups
      </Typography>
      {userGroups.length ? (
        <List>
          {userGroups.map((group) => (
            <GroupSingle key={group._id} groupId={group._id} />
          ))}
        </List>
      ) : (
        <Typography>You are not a member of any groups.</Typography>
      )}
    </Box>
  );
};

export default GroupList;

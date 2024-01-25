import {
  Avatar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useParams } from "react-router-dom";

const GroupFeedPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  const { _id, picturePath } = useSelector((state) => state.user);
  const { groupId } = useParams();
  const allGroups = useSelector((state) => state.groups);
  const group = allGroups.find((group) => group._id === groupId);
  const groupAvatarSrc =
    `http://localhost:3001/public/assets/picture/${group.profilePicture}` ||
    "https://www.govloop.com/wp-content/uploads/2015/06/data-brain-e1448373467709.jpg";

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <div
            style={{
              backgroundColor:
                theme.palette.mode === "light" ? "#BBD6DD" : "grey",
              padding: "1rem",
              borderRadius: "1rem 1rem 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={group.groupName}
                src={groupAvatarSrc}
                sx={{ width: 56, height: 56, marginRight: "1rem" }}
              />
              <Typography
                variant="h2"
                component="div"
                sx={{ color: "#032539" }}
              >
                {group.groupName}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">
                Members: {`${group.groupMembers.length}`}
              </Typography>
            </div>
          </div>
          <MyPostWidget picturePath={picturePath} />
          {/* <Typography style={{ fontSize:"34px"}}>
            Group Post Only
          </Typography> */}
          <PostsWidget userId={_id} groupId={group} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GroupFeedPage;

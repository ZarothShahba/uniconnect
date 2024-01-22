import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  BookmarkBorderOutlined,
  Send,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const GroupPostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  videoPath,
  userPicturePath,
  likes,
  comments,
  shares,
  saves,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const isSaved = saves ? Boolean(saves[loggedInUserId]) : false;
  const likeCount = Object.keys(likes).length;
  const saveCount = saves ? Object.keys(saves).length : 0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchSave = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/saved`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <DeleteForeverOutlined
          sx={{
            fontSize: "2rem",
            color: "#1C768F",
            "&:hover": {
              color: "red",
              cursor: "pointer",
            },
          }}
        />
      </FlexBetween>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/public/assets/picture/${picturePath}`}
        />
      )}
      {videoPath && (
        <video
          loop
          autoPlay
          muted
          width="100%"
          alt="video post"
          controls // Add controls for video playback
          style={{
            borderRadius: "0.75rem",
            marginTop: "0.75rem",
            maxHeight: "500px",
          }}
        >
          <source
            src={`http://localhost:3001/public/assets/videos/${videoPath}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchSave}>
              {isSaved ? (
                <BookmarkBorderOutlined sx={{ color: primary }} />
              ) : (
                <BookmarkBorderOutlined />
              )}
            </IconButton>
            <Typography>{saveCount}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <FlexBetween>
            <TextField label="Add Comment" sx={{ width: "38rem" }} />
            <Send sx={{ fontSize: "2rem", color: "#1C768F" }} />
          </FlexBetween>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {`${comment.firstName || ""} ${comment.lastName || ""}: ${
                    comment.commentText || ""
                  }`}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
              No comments available.
            </Typography>
          )}

          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default GroupPostWidget;

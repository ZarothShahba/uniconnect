import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  BookmarkBorderOutlined,
  Send,
  DeleteForeverOutlined,
  RestartAltOutlined,
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
import { setPost, setPosts } from "state";
import toast from "react-hot-toast";

const PostWidget = ({
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
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const isLiked = Boolean(likes[loggedInUserId]);
  const isSaved = saves ? Boolean(saves[loggedInUserId]) : false;
  const likeCount = Object.keys(likes).length;
  const saveCount = saves ? Object.keys(saves).length : 0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const repostedBy = shares.length > 0 ? shares[0].userId : null;
  const isReposted = Boolean(repostedBy);
  // Check if the logged-in user is the owner of the post
  const isOwner = loggedInUserId === postUserId;
  const originalPostUserId = isReposted ? repostedBy : postUserId;

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

  const handleComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment`, // Assuming this is your API endpoint for adding comments
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            commentText: commentText,
            firstName: user.firstname,
            lastname: user.lastname,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error);
        return;
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));

      //Clear the comment text after successful submission
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message);
    }
  };

  const handleRepost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/shared`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error);
        return;
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));

      toast.success("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing post:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const deletedPost = await response.json();
      // Remove the deleted post from the state.posts array
      const updatedPosts = posts.filter((post) => post._id !== deletedPost._id);
      dispatch(setPosts({ posts: updatedPosts }));

      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.message);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween>
        <Friend
          friendId={originalPostUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        {isReposted && (
          <Typography
            sx={{ color: "#1C768F", display: "flex", alignItems: "center" }}
          >
            <RestartAltOutlined
              sx={{ marginRight: "0.5rem", color: "#1C768F" }}
            />{" "}
            Reposted
          </Typography>
        )}
        {isOwner && (
          <DeleteForeverOutlined
            sx={{
              fontSize: "1.5rem",
              color: "#1C768F",
              "&:hover": {
                color: "red",
                cursor: "pointer",
              },
            }}
            onClick={() => handleDelete()}
          />
        )}
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
          {/* LIKE */}
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

          {/* COMMENT */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>

          {/*SAVE  */}
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
          <ShareOutlined onClick={() => handleRepost()} />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <FlexBetween>
            <TextField
              label="Add Comment"
              sx={{ width: "38rem" }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Send
              sx={{ fontSize: "2rem", color: "#1C768F" }}
              onClick={() => handleComment()}
            />
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

export default PostWidget;

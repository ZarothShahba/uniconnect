import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Error fetching Feeds");

        console.log(errorData);
        throw new Error(
          `Failed to fetch posts. Status: ${response.status}, Message: ${errorData.message}`
        );
      }
      const data = await response.json();
      dispatch(
        setPosts({
          posts: data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        })
      );
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      toast.error(error.message);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        toast.error("Unable to fetch user posts");
        return;
      }
      const data = await response.json();
      dispatch(
        setPosts({
          posts: data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        })
      );
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts && Array.isArray(posts) ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            videoPath,
            userPicturePath,
            likes,
            comments,
            shares,
            saves,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName || ""} ${lastName || ""}`}
              description={description}
              location={location}
              picturePath={picturePath}
              videoPath={videoPath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              shares={shares}
              saves={saves}
            />
          )
        )
      ) : (
        <Typography>Error: Unable to fetch posts</Typography>
      )}
    </>
  );
};

export default PostsWidget;

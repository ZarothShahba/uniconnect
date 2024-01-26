import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import LoadingSpinner from "components/LoadingSpinner";

const PostsWidget = ({ userId, isProfile = false, groupId, isSavedPosts }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [isLoading, setisLoading] = useState(false);

  const getPosts = async () => {
    try {
      setisLoading(true);
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
    } finally {
      setisLoading(false);
    }
  };

  const getUserPosts = async () => {
    try {
      setisLoading(true);
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
    } finally {
      setisLoading(false);
    }
  };

  const getUserSavedPosts = async () => {
    try {
      setisLoading(true);
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/saved-posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        toast.error("Unable to fetch user saved posts");
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
    } finally {
      setisLoading(false);
    }
  };

  const getGroupPosts = async () => {
    try {
      setisLoading(true);
      const response = await fetch(
        `http://localhost:3001/groups/${groupId}/posts`,
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
      console.error("Error fetching group posts:", error.message);
      toast.error(error.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else if (groupId) {
      getGroupPosts();
    } else if (isSavedPosts) {
      getUserSavedPosts();
    } else {
      getPosts();
    }
  }, [groupId, isProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <LoadingSpinner />;
  }
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

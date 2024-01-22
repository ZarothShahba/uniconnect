import Post from "../models/Post.js";
import User from "../models/User.js";
import Events from "../models/Event.js";
import Group from "../models/Group.js";

/* CREATE POST*/
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, videoPath } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      // Handle the case when the user is not found
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      videoPath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* GET USER POSTS */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (userId !== post.userId) {
      return res.status(401).json({ message: "Access Denied!" });
    }
    const deletePost = await Post.findByIdAndDelete(post);
    if (!deletePost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(deletePost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* ADD COMMENTS */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, commentText } = req.body;

    const post = await Post.findById(id);
    const commentedUser = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      commentText,
      firstName: commentedUser.firstName,
      lastName: commentedUser.lastName,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* CREATE EVENT */
export const createEvent = async (req, res) => {
  try {
    const { userId, title, description, startDate, time, venue } = req.body;
    const user = await User.findById(userId);
    //Checking for required fields
    if (!title || !description || !startDate || !time || !venue) {
      throw new Error("Please provide all the details");
    }
    //Creating an Event
    const newEvent = new Events({
      userId,
      title,
      description,
      startDate,
      time,
      venue,
    });
    await newEvent.save();
    const event = await Events.find();
    res.status(201).json(event);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* GET EVENTS */
export const getEvents = async (req, res) => {
  try {
    const event = await Events.find();
    res.status(200).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* SHARE POST */
export const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const originalPost = await Post.findById(id);

    if (!originalPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post has already been shared by the current user
    const isShared = originalPost.shares.some(
      (share) => share.userId === userId
    );
    if (!isShared) {
      originalPost.shares.push({ userId });
      await originalPost.save();

      // Create a new post based on the shared post
      const newPost = new Post({
        userId,
        firstName: originalPost.firstName,
        lastName: originalPost.lastName,
        location: originalPost.location,
        description: originalPost.description,
        userPicturePath: originalPost.userPicturePath,
        picturePath: originalPost.picturePath,
        videoPath: originalPost.videoPath,
        likes: {},
        comments: [],
        shares: [], // Clear shares to avoid duplication
      });

      await newPost.save();
    }

    const post = await Post.find();
    res.status(201).json(post);
    // const updatedPost = await Post.findById(id);
    // res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* SAVE POST */
export const savePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isSaved = post.saves && post.saves.get(userId);

    if (isSaved) {
      post.saves.delete(userId);
    } else {
      // Initialize 'saves' as an empty Map if it's undefined
      if (!post.saves) {
        post.saves = new Map();
      }
      post.saves.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { saves: post.saves },
      { new: true }
    );

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* CREATE GROUP */
export const createGroup = async (req, res) => {
  try {
    const { creatorId, groupName, groupDescription, groupMembers } = req.body;

    const newGroup = new Group({
      creatorId,
      groupName,
      groupDescription,
      groupMembers,
    });
    // Handle profile picture upload (if available)
    if (req.files && req.files.picture) {
      const profilePicture = req.files.picture[0];
      newGroup.profilePicture = profilePicture.filename;
    }

    // Save the new group to the database
    const savedGroup = await newGroup.save();
    //all groups
    const allGroups = await Group.find();

    res.status(201).json({
      group: savedGroup,
      allGroups,
      message: "Group created successfully",
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* GET GROUPS */
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error getting groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* GET GRUP BY ID */
export const getGroupById = async (req, res) => {
  try {
    // Extract the group ID from the request parameters
    const groupId = req.params.groupId;

    // Find the group by ID
    const group = await Group.findById(groupId);

    // Check if the group was found
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Return the group details
    res.status(200).json(group);
  } catch (error) {
    console.error("Error getting group by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* DELETE A GROUP BY ID */
export const deleteGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(400)
        .json({ groupId, error: "No group with given id." });
    }
    const deleteGroup = await Group.findByIdAndDelete(groupId);
    res.status(200).json(deleteGroup);
  } catch (error) {
    console.error("Error Deleting new Group by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

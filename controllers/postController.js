const Post = require("../models/Post");

// Public: sab posts (home page)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email"); // 👈 author include

    res.json(posts);
  } catch (err) {
    console.error("getPosts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Logged in user ke apne posts
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(posts);
  } catch (err) {
    console.error("getMyPosts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Single post (public read)
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("getPostById error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create: logged-in user ka post
const createPost = async (req, res) => {
  try {
    const { title, summary, content, tags } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPost = await Post.create({
      user: req.user._id, // 👈 yahi owner hai
      title,
      summary,
      content,
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("createPost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



// Update: sirf owner allowed
const updatePost = async (req, res) => {
  try {
    const { title, summary, content, tags } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Sirf owner ko edit karne do (agar user field hai)
    if (post.user && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    post.title = title ?? post.title;
    post.summary = summary ?? post.summary;
    post.content = content ?? post.content;
    post.tags = Array.isArray(tags) ? tags : post.tags;

    const updated = await post.save();
    res.json(updated);
  } catch (err) {
    console.error("updatePost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



// Delete: sirf owner allowed
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Sirf owner delete kar sakta hai (agar user field hai)
    if (post.user && post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("deletePost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// helper: sirf owner ko write access
const isOwner = (req) => {
  // Yaha apna email daalna hai jo tumne register/login ke time use kiya
  return req.user && req.user.email === "tumhara-email@example.com";
};



module.exports = {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};

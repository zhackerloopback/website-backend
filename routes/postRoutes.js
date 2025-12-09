const express = require("express");
const router = express.Router();
const {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getPosts);          // sabke liye visible
router.get("/:id", getPostById);    // ek post

// Private (JWT required)
router.get("/me/my", protect, getMyPosts); // 👈 current user ke posts
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;

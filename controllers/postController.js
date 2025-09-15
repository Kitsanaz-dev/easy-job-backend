const Post = require('../models/postModel');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userID = req.user.userID;

    const newPost = new Post({ title, description, userID });
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Posts (missing before)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userID', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userID', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Post
exports.updatePost = async (req, res) => {
  try {
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, userID: req.user.userID },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Post not found or not yours' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, userID: req.user.userID });
    if (!deleted) return res.status(404).json({ message: 'Post not found or not yours' });
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const comment = req.body.comment;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comment } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = req.body.comment;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { comment } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Like Post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likeCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post liked', likeCount: post.likeCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Unlike Post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likeCount > 0) post.likeCount -= 1;
    await post.save();

    res.status(200).json({ message: 'Post unliked', likeCount: post.likeCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

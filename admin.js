const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Post = require('../Models/Post');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(403).json({ msg: 'Admin users cannot be deleted' });
    }

    // Delete all posts by this user if they're a vendor
    if (user.role === 'vendor') {
      await Post.deleteMany({ vendor: user._id });
    }

    await user.remove();
    res.json({ msg: 'User deleted' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Get all posts
router.get('/posts', auth, isAdmin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('vendor', 'name email')
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a post
router.delete('/posts/:id', auth, isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
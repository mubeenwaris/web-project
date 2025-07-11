const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Vendor = require('../Models/Vendor');
const Post = require('../Models/Post');

// Get vendor profile
router.get('/profile', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.userId).select('-password');
    if (!vendor) {
      return res.status(404).json({ msg: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update vendor profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, company } = req.body;
    const vendor = await Vendor.findById(req.user.userId);
    
    if (!vendor) {
      return res.status(404).json({ msg: 'Vendor not found' });
    }

    // Update fields
    if (name) vendor.name = name;
    if (phone) vendor.phone = phone;
    if (address) vendor.address = address;
    if (company) vendor.company = company;

    await vendor.save();
    res.json(vendor);
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get vendor's posts
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ vendor: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching vendor posts:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a new post
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, description, price, city, images, phone } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !city || !images || !phone) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const newPost = new Post({
      vendor: req.user.userId,
      title,
      description,
      price: Number(price),
      city,
      images: Array.isArray(images) ? images : [images],
      phone
    });

    const post = await newPost.save();
    
    // Add post reference to vendor
    await Vendor.findByIdAndUpdate(
      req.user.userId,
      { $push: { posts: post._id } }
    );

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// Update a post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check post ownership
    if (post.vendor.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check post ownership
    if (post.vendor.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Use deleteOne instead of remove (which is deprecated)
    await Post.deleteOne({ _id: req.params.id });
    
    // Remove post reference from vendor
    await Vendor.findByIdAndUpdate(
      req.user.userId,
      { $pull: { posts: req.params.id } }
    );

    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 
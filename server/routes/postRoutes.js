const express = require('express');
const router = express.Router();
const { getPosts, addPost, likePost, addComment } = require('../models/post');

// Get all posts
router.get('/', getPosts);

// Add a new post
router.post('/', addPost);

// Like a post
router.put('/like/:id', likePost);

// Add comment to post
router.put('/comment/:id', addComment);

module.exports = router;

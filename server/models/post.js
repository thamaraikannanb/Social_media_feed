const express = require('express');
const db = require('../db');  // Import the database connection

const router = express.Router();

// Route: Get all posts
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM posts LEFT JOIN comments ON posts.id = comments.postId';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    // Group comments by post
    const posts = results.reduce((acc, row) => {
      const { id, username, content, likes, commentId, commentContent } = row;
      let post = acc.find(p => p.id === id);

      if (!post) {
        post = { id, username, content, likes, comments: [] };
        acc.push(post);
      }

      if (commentId) {
        post.comments.push({ id: commentId, content: commentContent });
      }

      return acc;
    }, []);
    
    res.json(posts);  // Return posts with comments
  });
});

// Route: Add a new post
router.post('/', (req, res) => {
  const { username, content } = req.body;
  const sql = 'INSERT INTO posts (username, content, likes) VALUES (?, ?, 0)';
  
  db.query(sql, [username, content], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add post' });
    }
    res.status(201).json({
      id: result.insertId,
      username,
      content,
      likes: 0,
      comments: [],
    });
  });
});

// Route: Like a post
router.put('/:postId/like', (req, res) => {
  const { postId } = req.params;
  const sql = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
  
  db.query(sql, [postId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to like post' });
    }
    // Get the updated post data
    const sqlGet = 'SELECT * FROM posts WHERE id = ?';
    db.query(sqlGet, [postId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch updated post' });
      }
      res.status(200).json(result[0]);  // Return the updated post
    });
  });
});


// Route: Add a comment to a post
router.post('/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const sql = 'INSERT INTO comments (postId, content) VALUES (?, ?)';
  
  db.query(sql, [postId, content], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add comment' });
    }
    res.status(201).json({
      id: result.insertId,
      content,
    });
  });
});

module.exports = router;  // Export the router for use in server.js

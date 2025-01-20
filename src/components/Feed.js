import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, TextField, Box } from '@mui/material';

function Feed() {
  const [posts, setPosts] = useState([]); // Initialize as an empty array
  const [newPost, setNewPost] = useState({
    username: '',
    content: ''
  });
  const [commentContent, setCommentContent] = useState('');

  // Fetch posts from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  // Handle liking a post
  const likePost = (postId) => {
    axios.put(`http://localhost:5000/api/posts/${postId}/like`)
      .then(() => {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
      })
      .catch(error => {
        console.error('Error liking post:', error);
      });
  };

  // Handle adding a comment to a post
  const addComment = (postId) => {
    axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { content: commentContent })
      .then(response => {
        const updatedPosts = posts.map(post => 
          post.id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        );
        setPosts(updatedPosts);
        setCommentContent(''); // Clear the comment input
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };

  // Handle creating a new post
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (newPost.username && newPost.content) {
      axios.post('http://localhost:5000/api/posts', newPost)
        .then(response => {
          setPosts([response.data, ...posts]);  // Prepend the new post to the list
          setNewPost({ username: '', content: '' });  // Reset the form
        })
        .catch(error => {
          console.error('Error creating new post:', error);
        });
    }
  };

  return (
    <div>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Username"
          name="username"
          value={newPost.username}
          onChange={handlePostChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          name="content"
          value={newPost.content}
          onChange={handlePostChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Post
        </Button>
      </Box>

      <div>
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <Card key={post.id} sx={{ margin: 2 }}>
              <CardContent>
                <Typography variant="h6">{post.username}</Typography>
                <Typography variant="body1">{post.content}</Typography>
                <Typography variant="body2">{post.likes} Likes</Typography>
                <Button onClick={() => likePost(post.id)} variant="contained" color="primary">
                  Like
                </Button>

                <div>
                  <TextField
                    label="Add a comment"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button onClick={() => addComment(post.id)} variant="contained" color="secondary">
                    Add Comment
                  </Button>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map(comment => (
                      <Typography key={comment.id} variant="body2" sx={{ marginLeft: 2 }}>
                        {comment.content}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ marginLeft: 2 }}>
                      No comments yet.
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6">No posts available</Typography>
        )}
      </div>
    </div>
  );
}

export default Feed;

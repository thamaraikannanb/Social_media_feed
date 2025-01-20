import React, { useState } from 'react';

const NewPostForm = ({ onAddPost }) => {
    const [username, setUsername] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !content) return alert('Please fill out both fields!');
        // Pass the new post data to the parent component
        onAddPost({ username, content, likes: 0, comments: [] });
        setUsername('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginBottom: '10px', display: 'block', width: '100%' }}
                />
            </div>
            <div>
                <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ marginBottom: '10px', display: 'block', width: '100%' }}
                ></textarea>
            </div>
            <button type="submit">Post</button>
        </form>
    );
};

export default NewPostForm;

import React, { useState } from 'react';

const CommentSection = ({ postId, comments, onAddComment }) => {
    const [comment, setComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!comment) return;
        onAddComment(postId, comment);
        setComment('');
    };

    return (
        <div style={{ marginTop: '10px' }}>
            <h4>Comments</h4>
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <button type="submit">Add Comment</button>
            </form>
            <div>
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment, index) => (
                        <p key={index} style={{ borderBottom: '1px solid #ccc', padding: '5px 0' }}>
                            {comment}
                        </p>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;

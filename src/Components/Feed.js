import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Feed.css";

const Feed = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const allPosts = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        user: 'user',
        caption: 'Пост №${i+1}',
        imageUrl: 'https://loremflickr.com/300/300',
    }));

    return (
    <div className="feedContainer">
      <header className="header">
        <h2>CoffeGram</h2>
        <button onClick={handleLogout} className="logoutBtn">
          Выйти
        </button>
      </header>

      <div className="postsGrid">
        {posts.map((post) => (
          <div key={post.id} className="postCard">
            <img src={post.imageUrl} alt={post.caption} className="postImage" />
            <p>
              <strong>{post.user}</strong>: {post.caption}
            </p>
          </div>
        ))}
      </div>

      {hasMore && <div className="loading">Загрузка...</div>}
    </div>
  );

}

export default Feed;

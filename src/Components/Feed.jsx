import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ru from "date-fns/locale/ru";
import "../css/Feed.css";
import HeaderLogo from "../Images/HeaderLogo.png";
import { BiSolidLogOut } from "react-icons/bi";
import { MdAddToPhotos } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";
import { IoSunny } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

import PostEditor from "./PostEditor";
import { generatePosts as generatePostsHandler, 
  loadMorePosts as loadMorePostsHandler, 
  setupScrollListener } 
  from "./postHandlers";
import { handleLike as likeHandler, 
  handleAddComment as addCommentHandler } 
  from "./postInteractions";
import SearchBar from "./SearchBar";

import images from "../Data/images.json";

const Feed = () => {
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 6;

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const currentUser = localStorage.getItem("user");

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditPost, setCurrentEditPost] = useState(null);

  const[searchQuery, setSearchQuery] = useState("");

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
  const generateImageUrl = useCallback(() => getRandomItem(images), []);

  const generatePosts = useCallback(
    (count) => generatePostsHandler(count, getRandomItem, generateImageUrl),
    [generateImageUrl]
  );

  const loadMorePosts = useCallback(
    () => loadMorePostsHandler(generatePosts, POSTS_PER_PAGE, setPosts, setHasMore),
    [generatePosts]
  );

  useEffect(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  useEffect(() => {
    return setupScrollListener(hasMore, loadMorePosts);
  }, [hasMore, loadMorePosts]);

  const handleLike = (postId) => {
    likeHandler(postId, likedPosts, setLikedPosts, setPosts);
  };

  const handleAddComment = (postId) => {
    const commentText = commentTexts[postId] || '';
    if (!commentText.trim()) return;

    addCommentHandler(postId, setPosts, currentUser, commentText);
    setCommentTexts(prev => ({...prev, [postId]: ''}));

    setShowComments(prev => ({...prev, [postId]: true}));
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts(prev => ({...prev, [postId]: String(text)}));
  }

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), {addSuffix: true, locale: ru});
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts')
    if(savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      loadMorePosts();
    }
  }, [loadMorePosts]);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleSavePost = (postData) => {
    if(currentEditPost) {
      setPosts(posts.map(post =>
          post.id === postData.id ? postData : post
      ));
    } else {
      setPosts(prev => [postData, ...prev]);
    }
    setIsEditing(false);
    setCurrentEditPost(null);
  };

  const handleEditPost = (post) => {
    setCurrentEditPost(post);
    setIsEditing(true);

    setCommentTexts(prev => ({...prev, [post.id]: post.comments.map(comment => comment.text).join('\n')}));
  };

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handleDeleteComment = (postId, commentIndex) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if(post.id === postId) {
        const updatedComments = post.comments.filter((_, i) => i !== commentIndex);
        return {
          ...post,
          comments: updatedComments,
          commentCount: updatedComments.length
          };
        }
        return post;
      })
    );
  };

  const filteredPosts = posts.filter(post =>
    post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="feedContainer">
      <header className="header">
        <img src={HeaderLogo} alt="HeaderLogo" className="HeaderLogo"/>
        <div>
          <BiSolidLogOut className="exitIcon" alt="Выйти" onClick={handleLogout}/>
        </div>
      </header>

      {isEditing && (
        <>
          <div className="overlay" onClick={() => setIsEditing(false)}/>
          <PostEditor 
            onSave={handleSavePost}
            initialPost={currentEditPost}
            onCancel={() => setIsEditing(false)}
          />
        </>
      )}

      <div className="sideNav">
        <div className="navIcons">
          {!isEditing && localStorage.getItem('user') && (
            <MdAddToPhotos 
              className="navIcon"
              onClick={() => setIsEditing(true)}
              title="Добавить пост"
            />
          )}
          <BsChatDotsFill className="navIcon"/>
          <IoSunny className="navIcon"/>
        </div>
      </div>

      <SearchBar onSearch={setSearchQuery} />

      <div className="postsFlex">
        {filteredPosts.map((post) => (
            <motion.div 
            key={post.id} 
            className="postCard"
            whileHover={{ scale: 1.1 }}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="post-header">
              <strong className="username">{post.user}</strong>
                {post.user === localStorage.getItem('user') && (
                    <MdEdit
                        onClick={() => handleEditPost(post)}
                        className="edit-post-btn"
                    />
                )}
            </div>
            
            {post.imageUrl && (
              <div className="media-preview">
                {post.mediaType === 'video' ? (
                  <video src={post.imageUrl} controls className="postImage" />
                ) : (
                  <img src={post.imageUrl} alt={post.caption} className="postImage" />
                )}
              </div>
            )}


            {/* <img src={post.imageUrl} alt={post.caption} className="postImage" /> */}
            <div className="caption">
              <strong>{post.user}</strong>: {post.caption}
              {post.hashtags?.length > 0 && (
                <div className="hashtags">
                  {post.hashtags.map(tag => (
                    <span key={tag} className="hashtag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="engagement-buttons">
              <button onClick={() => handleLike(post.id)}>
                {likedPosts.includes(post.id) ? '🖤' : '❤️'} {post.likes}
              </button>
              <button onClick={() => handleAddComment(post.id)}>
                💬 {post.commentCount}
              </button>
            </div>

            <div className="comments">
              <button onClick={() => toggleComments(post.id)}>
                {showComments[post.id] ? 'Скрыть комментарии' : 'Показать комментарии'} ({post.commentCount})
              </button>
              {showComments[post.id] && (
                <div className="comments-section">
                  <ul className="comments-list">
                    {post.comments.map((comment, index) => (
                      <li key={index} className="comment-item">
                        <div className="comment-text">
                          <strong>{comment.author}</strong>: {comment.text}
                        </div>
                        {comment.author === currentUser && (
                          <MdDeleteForever onClick={() => handleDeleteComment(post.id, index)} 
                            className="delete-comment-icon"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="add-comment">
                    <input
                      type="text"
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      placeholder="Напишите комментарий..."
                      className="comment-input"
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="comment-submit"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="post-footer">
                {post.user === localStorage.getItem('user') && (
                    <MdDeleteForever className="delete-icon" onClick={() => handleDeletePost(post.id)}/>
                )}
                <p className="postDate">{formatTimeAgo(post.createdAt)}</p>
            </div>
            </motion.div>
        ))}
      </div>

      {hasMore && <div className="loading">Загрузка...</div>}
    </div>
  );
};

export default Feed;
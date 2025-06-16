import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ru from "date-fns/locale/ru";
import "../css/Feed.css";
import HeaderLogo from "../Images/HeaderLogo.png";
import { BiSolidLogOut } from "react-icons/bi";

import { generatePosts as generatePostsHandler,
    loadMorePosts as loadMorePostsHandler,
    setupScrollListener
} from "./postHandlers";
import { handleLike as likeHandler, 
    handleAddComment as addCommentHandler 
} from "./postInteractions";

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
        if(!commentText.trim()) return;

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

    return (
        <div className="feedContainer">
            <header className="header">
                <img src={HeaderLogo} alt="HeaderLogo" className="HeaderLogo"/>
                <div>
                    <BiSolidLogOut className="exitIcon" alt="Выйти" onClick={handleLogout}/>
                </div>
            </header>

            <div className="postsFlex">
                {posts.map((post) => (
                    <motion.div 
                        key={post.id} 
                        className="postCard"
                        whileHover={{ scale: 1.1 }}
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="username">
                            <strong>{post.user}</strong>
                        </p>
                        <img src={post.imageUrl} alt={post.caption} className="postImage" />
                        <p className="caption">
                            <strong>{post.user}</strong>: {post.caption}
                        </p>
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
                                            <li key={index}>
                                                <strong>{comment.author}</strong>: {comment.text}
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
                        <p className="postDate">{formatTimeAgo(post.createdAt)}</p>
                    </motion.div>
                ))}
            </div>

            {hasMore && <div className="loading">Загрузка...</div>}
        </div>
    );
};

export default Feed;
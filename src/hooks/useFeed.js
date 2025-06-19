import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ru from "date-fns/locale/ru";
import { generatePosts as generatePostsHandler, 
  loadMorePosts as loadMorePostsHandler, 
  setupScrollListener } from "../utils/postHandlers";
import { handleLike as likeHandler, 
  handleAddComment as addCommentHandler } from "../utils/postInteractions";
import images from "../Data/images.json";

const POSTS_PER_PAGE = 6;

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const useFeed = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [showComments, setShowComments] = useState({});
    const [likedPosts, setLikedPosts] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditPost, setCurrentEditPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const currentUser = localStorage.getItem("user");

    const generateImageUrl = useCallback(() => getRandomItem(images), []);

    const generatePosts = useCallback(
        (count) => generatePostsHandler(count, getRandomItem, generateImageUrl),
        [generateImageUrl]
    );

    const loadMorePosts = useCallback(
        () => loadMorePostsHandler(generatePosts, POSTS_PER_PAGE, setPosts, setHasMore),
        [generatePosts]
    );

    const handleLike = useCallback((postId) => {
        likeHandler(postId, likedPosts, setLikedPosts, setPosts);
    }, [likedPosts]);

    const handleAddComment = useCallback((postId) => {
        const commentText = commentTexts[postId] || '';
        if (!commentText.trim()) return;

        addCommentHandler(postId, setPosts, currentUser, commentText);
        setCommentTexts(prev => ({...prev, [postId]: ''}));
        setShowComments(prev => ({...prev, [postId]: true}));
    }, [commentTexts, currentUser]);

    const handleCommentChange = useCallback((postId, text) => {
        setCommentTexts(prev => ({...prev, [postId]: String(text)}));
    }, []);

    const toggleComments = useCallback((postId) => {
        setShowComments((prev) => ({
        ...prev,
        [postId]: !prev[postId],
        }));
    }, []);

    const formatTimeAgo = useCallback((date) => {
        return formatDistanceToNow(new Date(date), {addSuffix: true, locale: ru});
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        navigate('/');
  }, [navigate]);

  const handleSavePost = useCallback((postData) => {
    if(currentEditPost) {
      setPosts(posts.map(post =>
          post.id === postData.id ? postData : post
      ));
    } else {
      setPosts(prev => [postData, ...prev]);
    }
    setIsEditing(false);
    setCurrentEditPost(null);
  }, [currentEditPost, posts]);

  const handleEditPost = useCallback((post) => {
    setCurrentEditPost(post);
    setIsEditing(true);
    setCommentTexts(prev => ({...prev, [post.id]: post.comments.map(comment => comment.text).join('\n')}));
  }, []);

  const handleDeletePost = useCallback((postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  const handleDeleteComment = useCallback((postId, commentIndex) => {
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
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if(savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      loadMorePosts();
    }
  }, [loadMorePosts]);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  useEffect(() => {
    return setupScrollListener(hasMore, loadMorePosts);
  }, [hasMore, loadMorePosts]);

  const filteredPosts = posts.filter(post =>
    post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    filteredPosts,
    isEditing,
    currentEditPost,
    showComments,
    likedPosts,
    commentTexts,
    hasMore,
    currentUser,
    
    handleLike,
    handleAddComment,
    handleCommentChange,
    toggleComments,
    formatTimeAgo,
    handleLogout,
    handleSavePost,
    handleEditPost,
    handleDeletePost,
    handleDeleteComment,
    setSearchQuery,
    setIsEditing,
  };
};

export default useFeed;
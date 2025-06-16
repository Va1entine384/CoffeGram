import usernames from "../Data/usernames.json";
import comments from "../Data/comments.json";

export const generateRandomComments = (getRandomItem, count) => {
    return Array.from({ length: count }, () => ({
        author: getRandomItem(usernames),
        text: getRandomItem(comments).text,
    }));
};

export const handleLike = (postId, likedPosts, setLikedPosts, setPosts) => {
    if (likedPosts.includes(postId)) {
        setLikedPosts((prev) => prev.filter(id => id !== postId));
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes - 1} : post
        ));
    } else {
        setLikedPosts([...likedPosts, postId]);
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1} : post
        ));
    }
};

export const handleAddComment = (postId, setPosts, getRandomItem) => {
    const randomComment = {
        author: getRandomItem(usernames),
        text: getRandomItem(comments).text,
    };
    
    setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId 
            ? { 
                ...post, 
                comments: [...post.comments, randomComment],
                commentCount: post.commentCount + 1
              } 
            : post
    ));
};
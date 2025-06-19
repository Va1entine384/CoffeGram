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
            post.id === postId ? { ...post, likes: post.likes - 1 } : post
        ));
    } else {
        setLikedPosts([...likedPosts, postId]);
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
    }
};

export const handleAddComment = (postId, setPosts, currentUser, commentText) => {
    if (!commentText || typeof commentText !== 'string' || !commentText.trim()) return;

    const newComment = {
        author: currentUser || 'Аноним',
        text: commentText.trim(),
        timestamp: new Date().toISOString()
    };

    setPosts(prevPosts =>
        prevPosts.map(post => {
            if (post.id === postId) {
                const updatedComments = [...post.comments, newComment];
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
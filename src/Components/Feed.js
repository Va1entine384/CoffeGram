import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useCallback } from "react";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import ru from "date-fns/locale/ru";
import "../css/Feed.css";
import HeaderLogo from "../Images/HeaderLogo.png";
import { VscDiffRenamed } from "react-icons/vsc";


import usernames from "../Data/usernames.json";
import captions from "../Data/captions.json";
import images from "../Data/images.json";

const Feed = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const POSTS_PER_PAGE = 6;

    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const getRandomItem = (array) => 
        array[Math.floor(Math.random() * array.length)];

    const randomDate = () => {
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 72 ))
        return date;
    }

    const formatTimeAgo = (date) => {
        return formatDistanceToNow(new Date(date), {addSuffix: true, locale: ru});
    }

    const generateImageUrl = useCallback(() => getRandomItem(images), []);

    const generatePosts = useCallback((count) => {
        return Array.from({ length: count }, () => ({
            id: uuidv4(),
            user: getRandomItem(usernames),
            caption: getRandomItem(captions),
            imageUrl: generateImageUrl(),
            createdAt: randomDate(),
        }));
    }, [generateImageUrl]);

    const loadMorePosts = useCallback(() => {
        setTimeout(() => {
            const nextPosts = generatePosts(POSTS_PER_PAGE);
            if (nextPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...nextPosts]);
            }
        }, 500); 
    }, [generatePosts]); 

    useEffect(() => {
        loadMorePosts();
    }, [loadMorePosts]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
                hasMore
            ) {
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadMorePosts]);

    return (
        <div className="feedContainer">
            <header className="header">
                <img src={HeaderLogo} alt="HeaderLogo" className="HeaderLogo"/>
                <div>
                    <VscDiffRenamed className="exitIcon" alt="Выйти" onClick={handleLogout}/>
                </div>
            </header>

            <div className="postsFlex">
                {posts.map((post) => (
                    <motion.div key={post.id} 
                        className="postCard"
                        whileHover={{
                            scale: 1.1,
                        }}
                        >
                        <p className="username">
                            <strong>{post.user}</strong>
                        </p>
                        <img src={post.imageUrl} alt={post.caption} className="postImage" />
                        <p className="caption">
                            <strong>{post.user}</strong>: {post.caption}
                        </p>
                        <p className="postDate">{formatTimeAgo(post.createdAt)}</p>
                    </motion.div>
                ))}
            </div>

            {hasMore && <div className="loading">Загрузка...</div>}
        </div>
    );
};

export default Feed;
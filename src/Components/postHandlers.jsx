import { v4 as uuidv4 } from "uuid";
import { generateRandomComments } from "./postInteractions";
import usernames from "../Data/usernames.json";
import captions from "../Data/captions.json";
import hashtags from "../Data/hashtags.json";

export const generatePosts = (count, getRandomItem, generateImageUrl) => {
    const randomDate = () => {
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 72));
        return date;
    };

    const generateHashtags = (count = 2) => {
        const shuffled = hashtags.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    return Array.from({ length: count }, () => {
        const commentCount = Math.floor(Math.random() * 6);
        return {
            id: uuidv4(),
            user: getRandomItem(usernames),
            caption: getRandomItem(captions),
            imageUrl: generateImageUrl(),
            createdAt: randomDate(),
            likes: Math.floor(Math.random() * 50) + 1,
            comments: generateRandomComments(getRandomItem, commentCount),
            commentCount: commentCount,
            hashtags: generateHashtags(),
        };
    });
};

export const loadMorePosts = async (generatePosts, POSTS_PER_PAGE, setPosts, setHasMore) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const nextPosts = generatePosts(POSTS_PER_PAGE);
            if (nextPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...nextPosts]);
            }
            resolve();
        }, 500);
    });
};

export const setupScrollListener = (hasMore, loadMorePosts) => {
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
};
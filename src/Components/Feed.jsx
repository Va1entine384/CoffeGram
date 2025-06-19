import { motion } from "framer-motion";
import "../css/Feed.css";

import PostEditor from "./PostComponents/PostEditor";
import SearchBar from "./FeedComponents/SearchBar";
import FeedHeader from "./FeedComponents/FeedHeader";
import EngagementButtons from "./PostComponents/EngagementButtons";
import CommentsSection from "./PostComponents/CommentsSection";
import SideNav from "./FeedComponents/SideNav";
import PostHeader from "./PostComponents/Post-Header";
import PostCaption from "./PostComponents/PostCaption";
import PostFooter from "./PostComponents/PostFooter";
import PostMedia from "./PostComponents/PostMedia";

import useFeed from "../hooks/useFeed";

const Feed = () => {

  const {
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
  } = useFeed();


  return (
    <div className="feedContainer">
      <FeedHeader onLogout={handleLogout} />

      {isEditing && (
        <>
          <div className="overlay" onClick={() => setIsEditing(false)} />
          <PostEditor
            onSave={handleSavePost}
            initialPost={currentEditPost}
            onCancel={() => setIsEditing(false)}
          />
        </>
      )}

      <SideNav
        isEditing={isEditing}
        currentUser={currentUser}
        onAddPost={() => setIsEditing(true)}
      />

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

            <PostHeader
              username={post.user}
              currentUser={currentUser}
              onEdit={() => handleEditPost(post)}
            />

            <PostMedia mediaType={post.mediaType} imageUrl={post.imageUrl} caption={post.caption} />

            <PostCaption
              username={post.user}
              caption={post.caption}
              hashtags={post.hashtags}
            />

            <EngagementButtons
              postId={post.id}
              isLiked={likedPosts.includes(post.id)}
              likes={post.likes}
              commentCount={post.commentCount}
              onLike={handleLike}
            />

            <CommentsSection
              post={post}
              currentUser={currentUser}
              show={showComments[post.id]}
              onToggle={() => toggleComments(post.id)}
              commentText={commentTexts[post.id] || ""}
              onChange={handleCommentChange}
              onAdd={handleAddComment}
              onDelete={handleDeleteComment}
            />

            <PostFooter
              postUser={post.user}
              currentUser={currentUser}
              createdAt={formatTimeAgo(post.createdAt)}
              onDelete={() => handleDeletePost(post.id)}
            />
          </motion.div>
        ))}
      </div>

      {hasMore && <div className="loading">Загрузка...</div>}
    </div>
  );
};

export default Feed;
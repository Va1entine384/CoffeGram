const EngagementButtons = ({
  postId,
  isLiked,
  likes,
  commentCount,
  onLike,
  onComment
}) => {
  return (
    <div className="engagement-buttons">
      <button onClick={() => onLike(postId)}>
        {isLiked ? "🖤" : "❤️"} {likes}
      </button>
      <button>
        💬 {commentCount}
      </button>
    </div>
  );
};

export default EngagementButtons;
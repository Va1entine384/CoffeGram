const PostCaption = ({ username, caption, hashtags = [] }) => {
  return (
    <div className="caption">
      <strong>{username}</strong>: {caption}
      {hashtags.length > 0 && (
        <div className="hashtags">
          {hashtags.map((tag) => (
            <span key={tag} className="hashtag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCaption;
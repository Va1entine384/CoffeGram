const PostMedia = ({ mediaType, imageUrl, caption }) => {
  if (!imageUrl) return null;

  return (
    <div className="media-preview">
      {mediaType === 'video' ? (
        <video src={imageUrl} controls className="postImage" />
      ) : (
        <img src={imageUrl} alt={caption} className="postImage" />
      )}
    </div>
  );
};

export default PostMedia;
import { MdDeleteForever } from "react-icons/md";

const PostFooter = ({ postUser, currentUser, createdAt, onDelete }) => {
  return (
    <div className="post-footer">
      {postUser === currentUser && (
        <MdDeleteForever
          className="delete-icon"
          onClick={onDelete}
          title="Удалить пост"
        />
      )}
      <p className="postDate">{createdAt}</p>
    </div>
  );
};

export default PostFooter;
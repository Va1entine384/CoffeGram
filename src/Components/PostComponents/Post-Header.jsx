import { MdEdit } from "react-icons/md";

const PostHeader = ({ username, currentUser, onEdit }) => {
  return (
    <div className="post-header">
      <strong className="username">{username}</strong>
      {username === currentUser && (
        <MdEdit
          onClick={onEdit}
          className="edit-post-btn"
          title="Редактировать пост"
        />
      )}
    </div>
  );
};

export default PostHeader;
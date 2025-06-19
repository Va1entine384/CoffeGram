import { MdDeleteForever } from "react-icons/md";

const CommentsSection = ({
  post,
  currentUser,
  show,
  onToggle,
  commentText,
  onChange,
  onAdd,
  onDelete
}) => {
  return (
    <div className="comments">
      <button onClick={onToggle}>
        {show ? "Скрыть комментарии" : "Показать комментарии"} ({post.commentCount})
      </button>

      {show && (
        <div className="comments-section">
          <ul className="comments-list">
            {post.comments.map((comment, index) => (
              <li key={index} className="comment-item">
                <div className="comment-text">
                  <strong>{comment.author}</strong>: {comment.text}
                </div>
                {comment.author === currentUser && (
                  <MdDeleteForever
                    onClick={() => onDelete(post.id, index)}
                    className="delete-comment-icon"
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="add-comment">
            <input
              type="text"
              value={commentText}
              onChange={(e) => onChange(post.id, e.target.value)}
              placeholder="Напишите комментарий..."
              className="comment-input"
            />
            <button onClick={() => onAdd(post.id)} className="comment-submit">
              Отправить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
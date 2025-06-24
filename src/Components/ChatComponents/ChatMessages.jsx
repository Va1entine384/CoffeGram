import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useEffect, useRef } from "react";

const ChatMessages = ({ messages, currentUser, onEdit, onDelete }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${
            msg.sender === currentUser ? "sent" : "received"
          }`}
        >
          <div className="message-content">{msg.text}</div>
          <div className="message-time">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {msg.sender === currentUser && (
            <div className="message-actions">
              <MdEdit className="edt-btn" onClick={() => onEdit(msg)} title="Редактировать" />
              <MdDeleteForever
                className="dlt-btn"
                onClick={() => onDelete(msg.id)}
                title="Удалить"
              />
            </div>
          )}
        </div>
      ))}
      <div ref={endRef} style={{height: "1px"}}/>
    </div>
  );
};

export default ChatMessages;

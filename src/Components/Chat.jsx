import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Chat.css";
import { BiSolidLogOut } from "react-icons/bi";

//Потом весь компонент разделить на отдельные компоненты и хуки

const mockUsers = [
  { id: 1, name: "Анна", avatar: "A" },
  { id: 2, name: "Борис", avatar: "B" },
  { id: 3, name: "Виктор", avatar: "V" },
  { id: 4, name: "Галина", avatar: "G" },
  { id: 5, name: "Дмитрий", avatar: "D" },
];

const Chat = ({ currentUser }) => {
  const [dialogs, setDialogs] = useState([]);
  const [activeDialog, setActiveDialog] = useState(null);
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    const availableRecipients = mockUsers.filter(
      (user) => user.name !== currentUser
    );
    setRecipients(availableRecipients);

    const savedDialogs = JSON.parse(localStorage.getItem("chatDialogs")) || [];
    setDialogs(savedDialogs);

    if (savedDialogs.length > 0) {
      setActiveDialog(savedDialogs[0].recipient);
    }
  }, [currentUser, navigate]);

  const handleDialogChange = (recipient) => {
    setActiveDialog(recipient);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeDialog) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      recipient: activeDialog,
      text: message,
      timestamp: new Date().toISOString(),
    };

    const updatedDialogs = [...dialogs];
    const dialogIndex = updatedDialogs.findIndex(
      (d) => d.recipient === activeDialog
    );

    if (dialogIndex === -1) {
      updatedDialogs.push({
        recipient: activeDialog,
        messages: [newMessage],
      });
    } else {
      updatedDialogs[dialogIndex].messages.push(newMessage);
    }

    setDialogs(updatedDialogs);
    localStorage.setItem("chatDialogs", JSON.stringify(updatedDialogs));
    setMessage("");
  };

  const getActiveDialogMessages = () => {
    if (!activeDialog) return [];
    const dialog = dialogs.find((d) => d.recipient === activeDialog);
    return dialog ? dialog.messages : [];
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Диалоги</h3>
        <div className="recipients-list">
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className={`recipient-item ${
                activeDialog === recipient.name ? "active" : ""
              }`}
              onClick={() => handleDialogChange(recipient.name)}
            >
              <div className="recipient-avatar">{recipient.avatar}</div>
              <div className="recipient-name">{recipient.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        {activeDialog ? (
          <>
            <div className="chat-header">
              <h3>{activeDialog}</h3>
              <BiSolidLogOut
                className="exit-chats"
                alt="Выйти"
                onClick={() => navigate("/feed")}
              />
            </div>
            <div className="chat-messages">
              {getActiveDialogMessages().map((msg) => (
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
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите сообщение..."
              />
              <button type="submit">Отправить</button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <p>Выберите диалог для начала общения</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

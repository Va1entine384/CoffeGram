import { useNavigate } from "react-router-dom";
import ChatSidebar from "./ChatComponents/ChatSidebar";
import ChatHeader from "./ChatComponents/ChatHeader";
import ChatMessages from "./ChatComponents/ChatMessages";
import ChatInput from "./ChatComponents/ChatInput";

import "../css/Chat.css";

import useChat from "../hooks/useChat";

const Chat = ({ currentUser }) => {
  const {
    editingMessageId,
    message,
    activeDialog,
    recipients,
    getMessages,
    setMessage,
    setEditingMessageId,
    handleSendMessage,
    handleDeleteMessage,
    selectDialog,
  } = useChat(currentUser);

  const navigate = useNavigate();
  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <div className="chat-container">
      <ChatSidebar
        recipients={recipients}
        activeDialog={activeDialog}
        onSelect={selectDialog}
      />
      <div className="chat-main">
        {activeDialog ? (
          <>
            <ChatHeader recipient={activeDialog} onExit={() => navigate("/feed")} />
            <ChatMessages
              messages={getMessages()}
              currentUser={currentUser}
              onEdit={(msg) => {
                setEditingMessageId(msg.id);
                setMessage(msg.text);
              }}
              onDelete={handleDeleteMessage}
            />
            <ChatInput
              message={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              isEditing={!!editingMessageId}
            />
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
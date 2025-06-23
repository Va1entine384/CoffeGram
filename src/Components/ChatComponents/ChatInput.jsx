const ChatInput = ({ message, onChange, onSend, isEditing }) => (
  <form onSubmit={onSend} className="chat-input">
    <input
      type="text"
      value={message}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Напишите сообщение..."
    />
    <button type="submit">{isEditing ? "Сохранить" : "Отправить"}</button>
  </form>
);

export default ChatInput;
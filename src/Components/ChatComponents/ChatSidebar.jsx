const ChatSidebar = ({ recipients, activeDialog, onSelect }) => (
  <div className="chat-sidebar">
    <h3>Диалоги</h3>
    <div className="recipients-list">
      {recipients.map((r) => (
        <div
          key={r.id}
          className={`recipient-item ${activeDialog === r.name ? "active" : ""}`}
          onClick={() => onSelect(r.name)}
        >
          <div className="recipient-avatar">{r.avatar}</div>
          <div className="recipient-name">{r.name}</div>
        </div>
      ))}
    </div>
  </div>
);

export default ChatSidebar;
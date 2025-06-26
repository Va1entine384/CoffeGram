import { useEffect, useState } from "react";
import repliesTemplates from "../Data/replies.json";

const mockUsers = [
  { id: 1, name: "Анна", avatar: "A" },
  { id: 2, name: "Борис", avatar: "B" },
  { id: 3, name: "Виктор", avatar: "V" },
  { id: 4, name: "Галина", avatar: "G" },
  { id: 5, name: "Дмитрий", avatar: "D" },
];

const useChat = (currentUser) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [dialogs, setDialogs] = useState([]);
  const [activeDialog, setActiveDialog] = useState(null);
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const available = mockUsers.filter((u) => u.name !== currentUser);
    setRecipients(available);

    const stored = JSON.parse(localStorage.getItem("chatDialogs")) || [];
    setDialogs(stored);

    if (stored.length > 0) {
      setActiveDialog(stored[0].recipient);
    }
  }, [currentUser]);

  const selectDialog = (recipient) => {
    setActiveDialog(recipient);
  };

  const saveDialogs = (updated) => {
    setDialogs(updated);
    localStorage.setItem("chatDialogs", JSON.stringify(updated));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeDialog) return;

    const updated = [...dialogs];
    const index = updated.findIndex((d) => d.recipient === activeDialog);

    if (editingMessageId) {
      const dialog = updated[index];
      const msgIndex = dialog.messages.findIndex(
        (m) => m.id === editingMessageId && m.sender === currentUser
      );
      if (msgIndex !== -1) {
        dialog.messages[msgIndex].text = message;
        dialog.messages[msgIndex].timestamp = new Date().toISOString();
      }
      setEditingMessageId(null);
    } else {
      const newMsg = {
        id: Date.now(),
        sender: currentUser,
        recipient: activeDialog,
        text: message || "",
        timestamp: new Date().toISOString(),
      };

      if (index === -1) {
        updated.push({ recipient: activeDialog, messages: [newMsg] });
      } else {
        updated[index].messages.push(newMsg);
      }

      setTimeout(() => {
        const lower = message.toLowerCase();
        const found = repliesTemplates.find((template) =>
          template.keywords.some((kw) => lower.includes(kw))
        );
        const reply = found
          ? found.response
          : "Интересно! Расскажи поподробнее.";

        const replyMessage = {
          id: Date.now() + 1,
          sender: activeDialog,
          recipient: currentUser,
          text: reply,
          timestamp: new Date().toISOString(),
        };

        const u = [...updated];
        const i = u.findIndex((d) => d.recipient === activeDialog);
        if (i !== -1) {
          u[i].messages.push(replyMessage);
        }
        saveDialogs(u);
      }, 800);
    }

    saveDialogs(updated);
    setMessage("");
  };

  const handleDeleteMessage = (id) => {
    const updated = dialogs.map((dialog) => {
      if (dialog.recipient === activeDialog) {
        return {
          ...dialog,
          messages: dialog.messages.filter(
            (m) => m.id !== id || m.sender !== currentUser
          ),
        };
      }
      return dialog;
    });
    saveDialogs(updated);
  };

  const getMessages = () => {
    const d = dialogs.find((d) => d.recipient === activeDialog);
    return d ? d.messages : [];
  };

  return {
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
  };
};

export default useChat;
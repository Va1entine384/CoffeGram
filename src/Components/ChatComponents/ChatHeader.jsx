import { BiSolidLogOut } from "react-icons/bi";

const ChatHeader = ({ recipient, onExit }) => (
  <div className="chat-header">
    <h3>{recipient}</h3>
    <BiSolidLogOut className="exit-chats" onClick={onExit} />
  </div>
);

export default ChatHeader;
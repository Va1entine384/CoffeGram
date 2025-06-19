import HeaderLogo from "../../Images/HeaderLogo.png"
import { BiSolidLogOut } from "react-icons/bi";

const FeedHeader = ({ onLogout }) => {
  return (
    <header className="header">
      <img src={HeaderLogo} alt="HeaderLogo" className="HeaderLogo" />
      <BiSolidLogOut className="exitIcon" alt="Выйти" onClick={onLogout} />
    </header>
  );
};

export default FeedHeader;
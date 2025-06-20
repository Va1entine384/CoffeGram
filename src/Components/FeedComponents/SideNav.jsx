import { MdAddToPhotos } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";
import { IoSunny } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SideNav = ({ isEditing, currentUser, onAddPost }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/chat");
  };

  return (
    <div className="sideNav">
      <div className="navIcons">
        {!isEditing && currentUser && (
          <MdAddToPhotos
            className="navIcon"
            onClick={onAddPost}
            title="Добавить пост"
          />
        )}
        <BsChatDotsFill className="navIcon" title="Чат" onClick={handleChatClick}  />
        <IoSunny className="navIcon" title="Тема" />
      </div>
    </div>
  );
};

export default SideNav;
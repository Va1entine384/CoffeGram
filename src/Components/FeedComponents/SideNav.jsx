import { MdAddToPhotos } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";
import { IoSunny } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SideNav = ({ isEditing, currentUser, onAddPost }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/chat");
  };

  const handleThemeToggle = () => {
    const currentTheme = document.body.classList.contains("theme-dark")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.classList.remove(`theme-${currentTheme}`);
    document.body.classList.add(`theme-${newTheme}`);

    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(`theme-${savedTheme}`);
  }, []);

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
        <BsChatDotsFill
          className="navIcon"
          title="Чат"
          onClick={handleChatClick}
        />
        <IoSunny className="navIcon" title="Тема" onClick={handleThemeToggle} />
      </div>
    </div>
  );
};

export default SideNav;

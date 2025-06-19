import { useState } from "react";
import { IoSearch } from "react-icons/io5";


const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    return (
        <div className="search-field">
            <div className="search-wrapper">
                <IoSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Введите имя пользователя или хэштег"
                    value={searchQuery}
                    onChange={handleChange}
                    className="search-input"
                />
            </div>
        </div>
    )
}

export default SearchBar;
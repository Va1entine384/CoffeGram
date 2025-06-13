import { useEffect, useState } from "react";
import "../css/UsersList.css";


const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);
    }, []);

    return (
        <div className="users-container">
            <h2 className="users-label">Все пользователи</h2>
            <ul className="users-list">
                {users.map((user, index) => (
                    <li ket = {index}>
                        <strong>{user.username}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidLogOut } from "react-icons/bi";
import "../css/UsersList.css";


const UserList = () => {
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);
    }, []);

    return (
        <div className="users-container">
            <div className="bicon-wrapper">
                <BiSolidLogOut className="back-icon" onClick={() => navigate("/")}/>
            </div>
            <h2 className="user-label">Все пользователи</h2>
            <motion.ul className="users-list"
            initial = "hidden"
            animate = "visible"
            variants={{
                hidden: {opacity: 0},
                visible: {
                    opacity: 1,
                    transition: {
                        stagglerChildren: 0.1
                    }
                }
            }}
            >
                {users.lenght === 0 && <p>Нет авторизованных пользователей</p>}
                {users.map((user, index) => (
                    <motion.li key = {index}
                    className="user-item"
                    variants={{
                        hidden: { y: 50, opacity: 0},
                        visible: { y: 0, opacity: 1},
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    >
                        <BiSolidUser className="user-icon"/>
                        <strong>{user.username}</strong>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    );
};

export default UserList;
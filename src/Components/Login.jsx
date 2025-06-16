import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { BiCoffeeTogo } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { VscKey } from "react-icons/vsc";
import { BiGroup } from "react-icons/bi";
import { BiSolidLogOut } from "react-icons/bi";//Заменить на неё в Feed.js кнопку для выхода на авторизацию
import "../css/Login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            const hashedPassword = CryptoJS.SHA256(password).toString();
            
            localStorage.setItem("user", username);
            localStorage.setItem("password", hashedPassword);

            const users = JSON.parse(localStorage.getItem("users")) || [];

            const userExists = users.some(user => user.username ===username);

            if(!userExists) {
                users.push({username, passwordHash: hashedPassword});
                localStorage.setItem("users", JSON.stringify(users))
            }

            navigate("/feed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="exist-users">
                    <BiGroup className="real-users" alt = "existedUsers" onClick={() => navigate("/users")}/>
                </div>
                <h1 className="app-name">CoffeGram</h1>
                <div className="icon-wrapper">
                    <BiCoffeeTogo className="account-icon" />
                </div>
                <h2 className="login-title">Вход в аккаунт</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username" className="input-label">Имя пользователя</label>
                        <div className="name-wrapper"> 
                            <VscAccount className="name-icon" />   
                            <input
                                type="text"
                                id="username"
                                placeholder="Введите ваше имя пользователя"
                                style={{paddingLeft: '35px', }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="input-label">Пароль</label>
                        <div className="input-wrapper">
                            <VscKey className="password-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="Введите ваш пароль"
                                style={{paddingLeft: '35px',
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Запомнить меня</span>
                        </label>
                        {/* <a href="/forgot-password" className="forgot-password">Forgot Password?</a> */}
                    </div>
                    
                    <button type="submit" className="login-button">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
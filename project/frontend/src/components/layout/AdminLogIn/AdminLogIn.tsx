import style from "./AdminLogIn.module.scss";
import Button from "../../ui/Button/Button.tsx";
import Input from "../../ui/Input/Input.tsx";
import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!email.trim() || !password.trim()) {
            return "Заполните все поля";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return "Введите корректный email";
        }

        return null;
    };

    const handleLogin = () => {
        const validationError =  validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (email === "admin@gmail.com" && password === "123456") {
            localStorage.setItem("isAdmin", "true");
            navigate("/adminPanel");   // ПЕРЕХОД в админку
        } else {
            setError("Неверный email или пароль");
        }
    };

    return (
        <div className={style["admin"]}>
            <div className={style["admin__card"]}>
                <h2 className={style["admin__title"]}>Admin Log In</h2>

                <div className={style["admin__input"]}>
                    <Input
                        type="email"
                        title="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        title="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className={style["admin__error"]}>{error}</p>}

                    <div className={style["admin__input--actions"]}>
                        <Button title="Log In" background="secondary" onClick={handleLogin} />

                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button title="Домой" background="primary"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogIn;

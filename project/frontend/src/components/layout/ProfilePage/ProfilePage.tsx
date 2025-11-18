import QRCodeGenerator from "../../QRCode/QRCodeGenerator.tsx";
import "./ProfilePage.scss";
import ActionButton from "../../ui/ActionButton/ActionButton.tsx";
import { faHome, faQrcode, faTags } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const ProfilePage = () => {
    const [telegramUsername, setTelegramUsername] = useState<string | null>(null);

    useEffect(() => {
        // Проверяем, доступен ли Telegram WebApp
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            setTelegramUsername(user.username || `${user.first_name || ""} ${user.last_name || ""}`.trim());
        }
    }, []);

    // Используем username в QR-коде (или "Гость", если нет)
    const profileUrl = `${window.location.origin}/profile/${telegramUsername || "guest"}`;

    return (
        <div className="ProfilePage">
            <h1 className="ProfilePage__username">{telegramUsername || "Гость"}</h1>
            <div className="ProfilePage__QRCode">
                <QRCodeGenerator value={profileUrl} />
            </div>

            <div className="ProfilePage__actions">
                <Link to={`/`} style={{ textDecoration: "none" }}>
                    <ActionButton title="Домой" icon={faHome} />
                </Link>

                <Link to={`/profile/offers`} style={{ textDecoration: "none" }}>
                    <ActionButton title="Скидки" icon={faTags} />
                </Link>

                <Link to="/profile" style={{ textDecoration: "none" }}>
                    <ActionButton title="QR" icon={faQrcode} />
                </Link>
            </div>
        </div>
    );
};

export default ProfilePage;

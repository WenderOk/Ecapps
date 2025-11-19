import QRCodeGenerator from "../../QRCode/QRCodeGenerator.tsx";
import "./ProfilePage.scss";
import ActionButton from "../../ui/ActionButton/ActionButton.tsx";
import { faHome, faQrcode, faTags } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiService } from '../../services/api';
import type { User } from '../../services/api';

declare global {
    interface Window {
        Telegram: any;
    }
}

const ProfilePage = () => {
    const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
    const [telegram_id, setTelegramId] = useState<number | null>(null);
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            const username = user.username || `${user.first_name || ""} ${user.last_name || ""}`.trim();
            const telegramId = user.id; // или user.telegram_id
            setTelegramUsername(username);
            setTelegramId(telegramId);

            // Добавляем или получаем пользователя
            apiService.addOrGetUser({
                telegram_id: telegramId,
                username,
                card_number: '', // оставляем пустым, если нет
                card_active: true,
            }).then((userId) => {
                console.log('User ID from API:', userId);

                // Получаем данные пользователя из API
                return apiService.getUser(telegramId);
            }).then((userFromAPI) => {
                setUserData(userFromAPI);
            }).catch((err) => {
                console.error('Failed to add/get user', err);
            });
        }
    }, []);

    const profileUrl = `${window.location.origin}/profile/${telegram_id || "guest"}`;

    return (
        <div className="ProfilePage">
            <h1 className="ProfilePage__username">{userData?.telegram_username || telegramUsername || "Гость"}</h1>

            <div className="ProfilePage__userInfo">
                {userData && (
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={userData.card_active}
                                readOnly
                            />{" "}
                            Карта действительна
                        </label>
                    </div>
                )}
            </div>

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

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService, type User } from "../../services/api.ts";

const ProfileViewPage = () => {
    const { telegram_id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!telegram_id) return;

        apiService.getUser(Number(telegram_id))
            .then((res) => {
                setUser(res);
                setLoading(false);
            })
            .catch(() => {
                setError("Пользователь не найден");
                setLoading(false);
            });
    }, [telegram_id]);

    if (loading) return <h2>Загрузка...</h2>;
    if (error) return <h2>{error}</h2>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Профиль пользователя</h1>

            <p><b>Telegram ID:</b> {user?.telegram_id}</p>
            <p><b>Username:</b> {user?.telegram_username}</p>
            <p><b>Номер карты:</b> {user?.card_number || "—"}</p>
            <p><b>Карта активна:</b> {user?.card_active ? "Да" : "Нет"}</p>
        </div>
    );
};

export default ProfileViewPage;

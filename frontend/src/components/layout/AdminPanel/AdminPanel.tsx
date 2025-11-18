import style from "./AdminPanel.module.scss";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import AdminItem from "./AdminItem/AdminItem";
import { useState} from "react";
import { apiService } from "../../services/api";

interface User {
    telegram_id: number;
    username: string;
    card_number: string;
    card_active: boolean;
}

interface DiscountCard {
    id: number;
    name: string;
    discount: number;
}

const AdminPanel = () => {
    //Состояния для участников
    const [username, setUsername] = useState("");
    const [card_number, setCard_number] = useState("");
    const [card_active, setCard_active] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);

    //Состояния для бизнес карточек
    const [company_name, setCompany_name] = useState("");
    const [discount_percentage, setDiscount_percentage] = useState(0);
    const [cardError, setCardError] = useState<string | null>(null);

    //Состояния для отображения
    const [users, setUsers] = useState<User[]>([]);
    const [discountCards, setDiscountCards] = useState<DiscountCard[]>([]);

    const handleAddUser = () => {
        setUserError(null);

        const newUser: User = {
            telegram_id: Date.now(),
            username,
            card_number,
            card_active
        };

        setUsers(prevUsers => [...prevUsers, newUser]);

        console.log("Добавлен участник:", newUser);
        setUsername("");
        setCard_number("");
        setCard_active(false);

        apiService.addUser(newUser);
    };

    const handleDeleteUser = (id: number) => {
        apiService.deleteUser(id);
        setUsers(prevUsers => prevUsers.filter(user => user.telegram_id !== id));
    };

    const handleAddCard = async () => {
        if (!company_name.trim() || discount_percentage < 0 || discount_percentage > 100) {
            setCardError("Название и скидка (0–100%) обязательны");
            return;
        }

        setCardError(null);

        const discountData = {
            company_name,
            discount_percentage
        };

        try {
            await apiService.addDiscount(discountData);

            window.location.reload();

            setCompany_name("");
            setDiscount_percentage(0);

        } catch (e) {
            console.error("Ошибка добавления:", e);
        }
    };

    const handleDeleteCard = async (id: number) => {
        await apiService.deleteDiscount(id);
        setDiscountCards(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className={style.admin}>
            <h1 className={style["admin__title"]}>Admin Panel</h1>

            {/* --- Участники --- */}
            <section className={style["admin__header"]}>
                <h2 className={style["admin__header--title"]}>Участники Молодёжной Карты</h2>

                <div className={style["admin__form"]}>
                    <Input title="ФИО" value={username} onChange={(e) => setUsername(e.target.value)} type={"text"} placeholder={""} />

                    {userError && <p className={style.error}>{userError}</p>}

                    <Button title="Добавить участника" background="primary" onClick={handleAddUser}/>
                </div>

                <div className={style["admin__list"]} style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {users.map(user => (
                        <AdminItem
                            key={user.telegram_id}
                            telegram_id={user.telegram_id}
                            username={user.username}
                            card_number={user.card_number}
                            card_active={user.card_active}
                            onDelete={() => handleDeleteUser(user.telegram_id)}
                        />
                    ))}
                </div>
            </section>

            {/* --- Бизнес-карточки --- */}
            <section className={style.section}>
                <h2 className={style.sectionTitle}>Бизнес-карточки</h2>

                <div className={style.form}>
                    <Input
                        title="Название компании"
                        value={company_name}
                        onChange={(e) => setCompany_name(e.target.value)}
                        type="text"
                        placeholder="Введите название"
                    />

                    <Input
                        title="Скидка (%)"
                        value={discount_percentage}
                        onChange={(e) => setDiscount_percentage(Number(e.target.value))}
                        type="number"
                        placeholder="0–100"
                    />

                    {cardError && <p className={style.error}>{cardError}</p>}

                    <Button title="Добавить карточку" background="primary" onClick={handleAddCard}/>
                </div>

                <div className={style["admin__list"]} style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {discountCards.map(card => (
                        <div key={card.id} className={style["admin__list--item"]}>
                            <div>
                                <p className={style["admin__list--item__name"]}>{card.name}</p>
                                <p className={style["admin__list--item__info"]}>{card.discount}%</p>
                            </div>
                            <Button title="Удалить" background="secondary" onClick={() => handleDeleteCard(card.id)}/>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminPanel;

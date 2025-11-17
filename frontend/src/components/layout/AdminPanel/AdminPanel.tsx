import style from "./AdminPanel.module.scss";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import AdminItem from "./AdminItem/AdminItem";
import { useState, useEffect} from "react";
import { apiService } from "../../services/api";

interface User {
    id: number;
    fio: string;
    phone: string;
    email: string;
}

interface BusinessCard {
    id: number;
    name: string;
    description: string;
}

const AdminPanel = () => {
    //Состояния для участников
    const [fio, setFio] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [userError, setUserError] = useState<string | null>(null);

    //Состояния для бизнес карточек
    const [cardName, setCardName] = useState("");
    const [cardDesc, setCardDesc] = useState("");
    const [cardError, setCardError] = useState<string | null>(null);

    //Состояния для отображения
    const [users, setUsers] = useState<User[]>([]);
    const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);

    const validateUser = () => {
        if (!fio.trim() || !phone.trim() || !email.trim()) {
            return "Все поля обязательны";
        }

        if (!/^[А-Яа-яЁё\s-]+$/.test(fio)) {
            return "ФИО должно содержать только буквы";
        }

        if (!/^\d+$/.test(phone)) {
            return "Телефон должен содержать только цифры";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Введите корректный email";
        }

        return null;
    };

    const handleAddUser = () => {
        const error = validateUser();
        if (error) {
            setUserError(error);
            return;
        }
        setUserError(null);

        const newUser: User = {
            id: Date.now(),
            fio,
            phone,
            email
        };

        setUsers(prevUsers => [...prevUsers, newUser]); // Добавляем в массив

        console.log("Добавлен участник:", newUser);
        setFio("");
        setPhone("");
        setEmail("");

        apiService.addUser(newUser);
    };

    const handleDeleteUser = (id: number) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    };

    const validateCard = () => {
        if (!cardName.trim() || !cardDesc.trim()) {
            return "Название и описание обязательны";
        }
        return null;
    };

    const handleAddCard = () => {
        const error = validateCard();
        if (error) {
            setCardError(error);
            return;
        }
        setCardError(null);

        const newCard: BusinessCard = {
            id: Date.now(),
            name: cardName,
            description: cardDesc
        };

        setBusinessCards(prevCards => [...prevCards, newCard]);

        console.log("Добавлена карточка бизнеса:", newCard);
        setCardName("");
        setCardDesc("");
    };

    const handleDeleteCard = (id: number) => {
        setBusinessCards(prevCards => prevCards.filter(card => card.id !== id));
    };

    return (
        <div className={style.admin}>
            <h1 className={style["admin__title"]}>Admin Panel</h1>

            {/* --- Участники --- */}
            <section className={style["admin__header"]}>
                <h2 className={style["admin__header--title"]}>Участники Молодёжной Карты</h2>

                <div className={style["admin__form"]}>
                    <Input title="ФИО" value={fio} onChange={(e) => setFio(e.target.value)} type={"email"} placeholder={""} />
                    <Input title="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} type={"email"} placeholder={""} />
                    <Input title="Email" value={email} onChange={(e) => setEmail(e.target.value)} type={"email"} placeholder={""} />

                    {userError && <p className={style.error}>{userError}</p>}

                    <Button title="Добавить участника" background="primary" onClick={handleAddUser}/>
                </div>

                <div className={style["admin__list"]} style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {users.map(user => (
                        <AdminItem
                            key={user.id}
                            name={user.fio}
                            number={user.phone}
                            email={user.email}
                            onDelete={() => handleDeleteUser(user.id)}
                        />
                    ))}
                </div>
            </section>

            {/* --- Бизнес-карточки --- */}
            <section className={style.section}>
                <h2 className={style.sectionTitle}>Бизнес-карточки</h2>

                <div className={style.form}>
                    <Input title="Название" value={cardName} onChange={(e) => setCardName(e.target.value)} type={"email"} placeholder={""} />
                    <Input title="Описание" value={cardDesc} onChange={(e) => setCardDesc(e.target.value)} type={"email"} placeholder={""} />

                    {cardError && <p className={style.error}>{cardError}</p>}

                    <Button title="Добавить карточку" background="primary" onClick={handleAddCard}/>
                </div>

                <div className={style["admin__list"]} style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {businessCards.map(card => (
                        <div key={card.id} className={style["admin__list--item"]}>
                            <div>
                                <p className={style["admin__list--item__name"]}>{card.name}</p>
                                <p className={style["admin__list--item__info"]}>{card.description}</p>
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

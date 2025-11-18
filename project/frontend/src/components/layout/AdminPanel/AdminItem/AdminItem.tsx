import style from "./AdminItem.module.scss";
import Button from "../../../ui/Button/Button.tsx";

type AdminItemProps = {
    telegram_id: number;
    username: string;
    card_number: string;
    card_active: boolean;
    onDelete?: () => void;
}

const AdminItem = ({ telegram_id, username, card_number, card_active, onDelete }:AdminItemProps) => {
    return (
        <>
            <div className={style["adminItem"]}>
                <div className={style["adminItem__info"]}>
                    <p className={style["adminItem__info-telegram_id"]}>{telegram_id}</p>
                    <p className={style["adminItem__info-username"]}>{username}</p>
                    <p className={style["adminItem__info-card_number"]}>{card_number}</p>
                    <p className={style["adminItem__info-card_active"]}>{card_active}</p>
                </div>

                <Button title="Удалить" background="secondary" onClick={onDelete} />
            </div>
        </>
    )
}

export default AdminItem;
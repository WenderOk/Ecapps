import style from "./AdminItem.module.scss";
import Button from "../../../ui/Button/Button.tsx";

type AdminItemProps = {
    name: string;
    number: number;
    email: string;
    onDelete?: () => void;
}

const AdminItem = ({ name, number, email, onDelete }:AdminItemProps) => {
    return (
        <>
            <div className={style["adminItem"]}>
                <div className={style["adminItem__info"]}>
                    <p className={style["adminItem__info-name"]}>{name}</p>
                    <p className={style["adminItem__info-number"]}>{number}</p>
                    <p className={style["adminItem__info-email"]}>{email}</p>
                </div>

                <Button title="Удалить" background="secondary" onClick={onDelete} />
            </div>
        </>
    )
}

export default AdminItem;
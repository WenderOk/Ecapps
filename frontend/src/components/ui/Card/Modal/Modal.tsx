import style from "./Modal.module.scss";
import Button from "../../Button/Button.tsx";
import {Link} from "react-router-dom";
import ActionButton from "../../ActionButton/ActionButton.tsx";
import {faQrcode} from "@fortawesome/free-solid-svg-icons";


type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    address?: string;
};

const Modal = ({ isOpen, onClose, title, address }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={style.modalOverlay} onClick={onClose}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>

                <h2 className={style["modal__title"]}>{title}</h2>
                {address && <p className={style["modal__address"]}>{address}</p>}

                <div className={style["modal__actions"]}>
                    <Button title="Закрыть" onClick={onClose} background="primary" className={style["modal__close"]}/>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <ActionButton title="QR" icon={faQrcode} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Modal;

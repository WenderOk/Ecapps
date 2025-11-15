import "./Card.module.scss";
import style from "./Card.module.scss";
import Modal from "./Modal/Modal"
import { useState } from "react";

type CardProps = {
    image: string;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    address?: string;
};

const Card = ({ image, title, subtitle, address }: CardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={style.card} onClick={handleOpenModal}>
                <img className={style.card__image} src={image} alt={title} />

                <div className={style.card__content}>
                    <h3 className={style.card__title}>{title}</h3>
                    {subtitle && <p className={style.card__subtitle}>{subtitle}</p>}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={title}
                image={image}
                address={address}
            />
        </>
    );
};

export default Card;

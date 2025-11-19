import { clsx } from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
    title: string;
    background: "primary" | "secondary";
    onClick?: () => void;
    className?: string;
}

const Button = ({ title, background, onClick, className }:ButtonProps) => {
    return (
        <>
            <button onClick={onClick} className={clsx(styles["Button"], styles[`Button__${background}`], className)}>{title}</button>
        </>
    )
}

export default Button;
import { clsx } from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
    title: string;
    background: "primary" | "secondary";
}

const Button = ({ title, background }:ButtonProps) => {
    return (
        <>
            <button className={clsx(styles["Button"], styles[`Button__${background}`])}>{title}</button>
        </>
    )
}

export default Button;
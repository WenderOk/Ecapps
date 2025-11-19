import styles from "./Input.module.scss";

type InputProps = {
    type: "number" | "text" | "password" | "email";
    title: string;
    placeholder: string;
    value: number | string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ type, title, placeholder, onChange, value }:InputProps) => {
    return (
        <>
            <div className={styles["Input"]}>
                <input
                    type={type}
                    placeholder={placeholder}
                    className={styles["Input__textarea"]}
                    onChange={onChange}
                    value={value}
                />
                <label className={styles["Input__title"]}>{title}</label>
            </div>
        </>
    )
}

export default Input;
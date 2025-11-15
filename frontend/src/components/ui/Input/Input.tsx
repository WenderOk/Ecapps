import styles from "./Input.module.scss";

type InputProps = {
    type: "email" | "password";
    title: string;
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ type, title, placeholder, onChange }:InputProps) => {
    return (
        <>
            <div className={styles["Input"]}>
                <input
                    type={type}
                    placeholder={placeholder}
                    className={styles["Input__textarea"]}
                    onChange={onChange}
                />
                <label className={styles["Input__title"]}>{title}</label>
            </div>
        </>
    )
}

export default Input;
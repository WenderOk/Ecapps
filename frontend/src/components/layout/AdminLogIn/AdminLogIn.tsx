import style from "./AdminLogIn.module.scss";
import Button from "../../ui/Button/Button.tsx";
import Input from "../../ui/Input/Input.tsx";
import {Link} from "react-router-dom";
import ActionButton from "../../ui/ActionButton/ActionButton.tsx";
import {faHome} from "@fortawesome/free-solid-svg-icons";

const AdminLogIn = () => {
    return (
        <div className={style["admin"]}>
            <div className={style["admin__card"]}>
                <h2 className={style["admin__title"]}>Admin Log In</h2>

                <div className={style["admin__input"]}>
                    <Input type="email" title="Email" placeholder="Enter your email" />
                    <Input type="password" title="Password" placeholder="Enter your password" />

                    <div className={style["admin__input--actions"]}>
                        <Button title="Log In" background="secondary" />
                        <Link to={`/`} style={{ textDecoration: "none" }}>
                            <ActionButton title="Домой" icon={faHome} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminLogIn;

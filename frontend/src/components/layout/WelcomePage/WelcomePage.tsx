import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import "./WelcomePage.scss";
import Button from "../../ui/Button/Button.tsx";

const WelcomePage = () => {
    return (
        <div className="WelcomePage">
            <h1 className="WelcomePage__title">YCard</h1>
            <div className="WelcomePage__logo">
                <FontAwesomeIcon icon={faUsers} />
            </div>
            <p className="WelcomePage__subtitle">
                Добро пожаловать! Выберите, куда вы хотите зайти:
            </p>
            <div className="WelcomePage__buttons">
                <Link to="/profile" style={{ textDecoration: "none" }}>
                    <Button title="Профиль" background="primary"/>
                </Link>
                <Button title="Администратор" background="secondary"/>
            </div>
        </div>
    );
};

export default WelcomePage;

import "./WelcomePage.scss";
import Button from "../../ui/Button/Button.tsx";

const WelcomePage = () => {
    return (
        <div className="WelcomePage">
            <h1 className="WelcomePage__title">YCard</h1>
            <div className="WelcomePage__logo">😐</div>
            <p className="WelcomePage__subtitle">
                Добро пожаловать! Выберите, куда вы хотите зайти:
            </p>
            <div className="WelcomePage__buttons">
                <Button title="Профиль" background="primary"/>
                <Button title="Администратор" background="secondary"/>
            </div>
        </div>
    );
};

export default WelcomePage;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faQrcode, faTags, faHome} from "@fortawesome/free-solid-svg-icons";
import "./ActionButton.scss";

type ButtonProps = {
    title: string;
    icon: typeof faQrcode | typeof faTags | typeof faHome;
};

const ActionButton = ({ title, icon }: ButtonProps) => {
    return (
        <button className="actionButton">
            <FontAwesomeIcon icon={icon} size="2x" />
            <span className="actionButton__title">{title}</span>
        </button>
    );
};


export default ActionButton;

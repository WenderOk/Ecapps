import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faQrcode, faTags} from "@fortawesome/free-solid-svg-icons";
import "./ActionButton.scss";

type ButtonProps = {
    title: string;
    icon: typeof faQrcode | typeof faTags;
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

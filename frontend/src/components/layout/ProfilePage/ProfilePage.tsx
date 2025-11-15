import QRCodeGenerator from "../../QRCode/QRCodeGenerator.tsx";
import "./ProfilePage.scss";
import ActionButton from "../../ui/ActionButton/ActionButton.tsx";
import {faHome, faQrcode, faTags} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

const ProfilePage = () => {
    const profileUrl = `${window.location.origin}/profile/12345`;

    return (
        <>
            <div className="ProfilePage">
                <h1 className="ProfilePage__username">username</h1>
                <div className="ProfilePage__QRCode">
                    <QRCodeGenerator value={profileUrl} />
                </div>

                <div className="ProfilePage__actions">
                    <Link to={`/`} style={{ textDecoration: "none" }}>
                        <ActionButton title="Домой" icon={faHome} />
                    </Link>

                    <Link to={`/profile/offers`} style={{ textDecoration: "none" }}>
                        <ActionButton title="Скидки" icon={faTags} />
                    </Link>

                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <ActionButton title="QR" icon={faQrcode} />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
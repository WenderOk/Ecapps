import "./styles/_base.scss";
import WelcomePage from "./components/layout/WelcomePage/WelcomePage.tsx";
import {Route, Routes} from "react-router-dom";
import ProfilePage from "./components/layout/ProfilePage/ProfilePage.tsx";
import OffersPage from "./components/layout/OffersPage/OffersPage.tsx";
import AdminLogIn from "./components/layout/AdminLogIn/AdminLogIn.tsx";

export default function App () {
    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage />}/>
                <Route path="/adminLogIn" element={<AdminLogIn/>}/>
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="/profile/offers" element={<OffersPage />} />
            </Routes>
        </>
    )
}
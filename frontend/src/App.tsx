import "./styles/_base.scss";
import WelcomePage from "./components/layout/WelcomePage/WelcomePage.tsx";
import {Route, Routes} from "react-router-dom";

// TODO: написать компонент бизнес
export default function App () {
    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage />}/>
            </Routes>
        </>
    )
}
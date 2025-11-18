import { Navigate } from "react-router-dom";
import type {ReactElement} from "react";

interface ProtectedRouteProps {
    children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
        return <Navigate to="/adminLogIn" replace />;
    }

    return children;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(){
    const token = localStorage.getItem('accessToken')

    if (!token){
        alert("You are not logged in!")
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;
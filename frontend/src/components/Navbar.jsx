import { Link, useNavigate } from "react-router-dom"
import '../css/navbar.css'

function Navbar(){

    const navigate = useNavigate();

    const handleLogout = () =>{
        // fetch('http://127.0.0.1:8000/api/logout/', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        //     }
        // });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login')
    };
 
    return(
        <div className="navbar">
            <div className="navbar-home">
                <Link to="/">Home</Link>
            </div>
            <div className="navbar-app-name">
                <span>Project Manager</span>
            </div>
            <div className="navbar-logout">
                <button onClick={handleLogout} >Logout</button>
            </div>
        </div>
    )
}

export default Navbar;
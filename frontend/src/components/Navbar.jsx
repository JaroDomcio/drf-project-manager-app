import { Link, useNavigate } from "react-router-dom"
import '../css/navbar.css'

function Navbar(){

    const navigate = useNavigate();

    const handleLogout = () =>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login')
    };
 
    return(
        <div className="navbar">
            <div className="navbar-home">
                <Link to="/">Home</Link>
            </div>
            <div>
                <span>Project Manager</span>
            </div>
            <div>
                <button onClick={handleLogout} >Logout</button>
            </div>
        </div>
    )
}

export default Navbar;
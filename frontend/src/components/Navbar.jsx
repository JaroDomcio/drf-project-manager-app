import { Link } from "react-router-dom"
import '../css/navbar.css'

function Navbar(){
    return(
        <div className="navbar">
            <div className="navbar-logo">
                <Link to="/">Home</Link>
            </div>
            <div className="navbar-app-name">
                <span>Project Manager</span>
            </div>
            <div className="navbar-logout">
                <span>Logout</span>
            </div>
        </div>
    )
}

export default Navbar;
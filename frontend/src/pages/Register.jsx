import RegisterForm from "../components/RegisterForm";
import '../css/loginRegisterForm.css'

function Register(){
    return(
        <div className="form-container">
            <h1>Register page</h1>
            <RegisterForm />
        </div>
    )
}

export default Register;
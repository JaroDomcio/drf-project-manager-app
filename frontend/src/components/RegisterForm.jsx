import {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterForm(){
    const [form,setForm] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
    });


    const navigate = useNavigate();

    const handleChange = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [field]: value,
        })
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password != form.password2){
            alert("Passwords are not the same!")
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({
                    username: form.username, 
                    email: form.email, 
                    first_name: form.first_name, 
                    last_name: form.last_name, 
                    password: form.password}), 
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/login');
            } else {
                alert('Registration failed. Try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again later.');
        }

    };

    return (
        <div className="form-box">
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input
                        name ="username"
                        type = "text"
                        value = {form.username}
                        onChange = {handleChange}
                        required
                    />
                </div>
                <div>
                    <label>First name: </label>
                    <input
                        name="first_name"
                        type="text"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last name: </label>
                    <input
                        name="last_name"
                        type="text"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>email: </label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm your password: </label>
                    <input
                        name="password2"
                        type="password"
                        value={form.password2}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account ? <Link to="/login">Sign in here</Link>
            </p>
        </div>
        );
    };

export default RegisterForm;
import { useState } from 'react';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, // informacja, że wysyłamy JSON
                body: JSON.stringify({ username, password }), // konwertujemy dane do formatu JSON i wysyłamy
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                alert('Login successful!');
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text">
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                </input>
            </div>
                <div>
                <label>Password:</label>
                <input
                    type="password">
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                </input>
            </div>
        </form>
    );

}

export default LoginForm;
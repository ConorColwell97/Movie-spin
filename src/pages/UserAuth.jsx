import './styles.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserAuth = () => {
    const [home, setHome] = useState(true);
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const VITE_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const createUser = async () => {
        let response;
        try {
            response = await axios.post(`${VITE_URL}/register`, {
                username: username,
                password: password
            }, { withCredentials: true });

            console.log(response.data || "No data");
            localStorage.setItem('user', username);
            navigate("/home");

        } catch (err) {
            setError(err.response);
            console.log(err.message);
        }
    }

    const userLogin = async () => {
        let response;
        try {
            response = await axios.post(`${VITE_URL}/userLogin`, {
                username: username,
                password: password
            }, { withCredentials: true });

            console.log(response.data || "No data");
            localStorage.setItem('user', username);
            navigate("/home");

        } catch (err) {
            console.log(err);
        }
    }

    const setToHome = () => {
        setHome(true);
        setLogin(false);
        setRegister(false);
    }

    const setToLogin = () => {
        setLogin(true);
        setHome(false);
    }

    const setToRegister = () => {
        setRegister(true);
        setHome(false);
    }

    return (
        <div className='login'>
            {home && (
                <>
                    <button onClick={setToLogin}>Log in</button>
                    <p style={{ color: "white" }}>or</p>
                    <button onClick={setToRegister}>Register</button>
                </>
            )}

            {login && (
                <>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    <button onClick={userLogin}>Log in</button>
                    <button onClick={setToHome}>Cancel</button>
                </>
            )}

            {error && (
                <p style={{ color: "red" }}>An error occurred</p>
            )}

            {register && (
                <>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    <button onClick={createUser}>Register</button>
                    <button onClick={setToHome}>Cancel</button>
                </>
            )}
        </div>
    );
}

export default UserAuth;
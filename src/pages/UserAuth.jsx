import './styles.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserAuth = () => {
    const [login, setLogin] = useState(true);
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
            if(err.status === 409) {
                setError("An account with this username already exists");
            }
            
            console.log(err.status);
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
            if (err.status === 404) {
                setError("User not found");
            } else if (err.status === 401) {
                setError("Incorrect password");
            }
            console.log(err);
        }
    }

    const setToLogin = () => {
        setError(null);
        setUsername("");
        setPassword("");
        setLogin(true);
        setRegister(false);
    }

    const setToRegister = () => {
        setError(null);
        setUsername("");
        setPassword("");
        setRegister(true);
        setLogin(false);
    }

    return (
        <div style={{ display: "flex", flex: 1 }}>

            <div className='login'>

                <h1 style={{ color: "#470000" }}>Movie spin</h1>
                <p style={{ color: "#470000" }}>Log in or create an account</p>

                {login && (
                    <>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />

                        {error && (
                            <p style={{ color: "red" }}>{error}</p>
                        )}

                        <button onClick={userLogin} disabled={username.length === 0 || password.length === 0}>Log in</button>
                        <p style={{ color: "#470000" }}>or</p>
                        <button onClick={setToRegister}>Register</button>
                    </>
                )}

                {register && (
                    <>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                        <label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                            {password.length < 8 && (
                                <p style={{ fontSize: "small", color: "#470000"}}>Password must contain at least 8 characters</p>
                            )}
                        </label>
                        
                        
                        {error && (
                            <p style={{ color: "red" }}>{error}</p>
                        )}

                        <button onClick={createUser} disabled={username.length === 0 || password.length < 8}>Register</button>
                        <button onClick={setToLogin}>Cancel</button>
                    </>
                )}
            </div>

            <div className='about'>
                <h1 style={{ color: "white" }}>Movie Spin</h1>
                <p style={{ fontSize: "xx-large" }}>Welcome to movie spin! Apply filters such as genre or release date and then
                    spin the wheel to get a bunch of random movies that match your filters!
                    To get started, either create an account or log in if you are already
                    a user
                </p>
            </div>

        </div>

    );
}

export default UserAuth;
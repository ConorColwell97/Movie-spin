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

    const setToLogin = () => {
        setLogin(true);
        setRegister(false);
    }

    const setToRegister = () => {
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
                        <button onClick={userLogin}>Log in</button>
                        <p style={{ color: "#470000" }}>or</p>
                        <button onClick={setToRegister}>Register</button>
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
                        <button onClick={setToLogin}>Cancel</button>
                    </>
                )}
            </div>

            <div className='about'>
                <h1 style={{ color: "white" }}>Movie Spin</h1>
                <p style={{ fontSize: "xx-large"}}>Welcome to movie spin! Apply filters such as genre or release date and then
                    spin the wheel to get a bunch of random movies that match your filters!
                    To get started, either create an account or log in if you are already
                    a user 
                </p>
            </div>

        </div>

    );
}

export default UserAuth;
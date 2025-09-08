import './styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [home, setHome] = useState(true);
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [user, setUser] = useState(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const disabled = true;

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

    const createUser = async () => {
        let response;
        try {
            response = await axios.post(`http://localhost:8080/register`, {
                username: username,
                password: password
            }, { withCredentials: true });

            disabled = false;

            console.log(response.data || "No data");
            localStorage.setItem('user', username);
            setUser(username);

            if (login) {
                setLogin(false);
            }
            if (register) {
                setRegister(false);
            }

            setUsername("");
            setPassword("");

        } catch (err) {
            setError(err.response);
            console.log(err.message);
        }
    }

    const userLogin = async () => {
        let response;
        try {
            response = await axios.post(`http://localhost:8080/userLogin`, {
                username: username,
                password: password
            }, { withCredentials: true });

            console.log(response.data || "No data");

            localStorage.setItem('user', username);
            setUser(username);

            if (login) {
                setLogin(false);
            }
            if (register) {
                setRegister(false);
            }

            setUsername("");
            setPassword("");
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(localStorage.getItem('user') !== null) {
            setUser(localStorage.getItem('user'));
        }
    },[]);

    return (
        <>
            {user !== null ? (
                <>
                    <button onClick={() => navigate("/find")} disabled={disabled}>Find movies</button>
                    <button onClick={() => navigate("/movies")} disabled={disabled}>Your movies</button>
                    <button onClick={() => navigate("/profile")} disabled={disabled}>Profile</button>
                    <button onClick={() => {
                        alert(`Log out of account ${user}?`);
                        if(user !== null) {
                            localStorage.clear();
                            setUser(null);
                            setHome(true);
                        }
                    }}>Log out</button>
                </>
            ) : (
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
                        <p style={{color: "red"}}>An error occurred</p>
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
            )}
        </>
    );
}

export default Home;
import './styles.css';
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [home, setHome] = useState(true);
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [user, setUser] = useState(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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
        try {
            const response = await axios.post(`http://localhost:8080/register`,{
                username: username,
                password: password
            });

            localStorage.setItem('jwt', response.data);
            const decoded = jwtDecode(localStorage.getItem('jwt'));
            setUser(decoded.sub);

        } catch (error) {
            console.log(error);
        }

        setUsername("");
        setPassword("");
    }

    const userLogin = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/userLogin`,{
                username: username,
                password: password
            });

            localStorage.setItem('jwt', response.data);

            const decoded = jwtDecode(localStorage.getItem('jwt'));
            setUser(decoded.sub);
        } catch (error) {
            console.log(error);
        }

        setUsername("");
        setPassword("");
    }

    return (
        <div className='login'>
            {home && (
                <>
                    <button onClick={setToLogin}>Log in</button>
                    <p>or</p>
                    <button onClick={setToRegister}>Register</button>
                </>
            )}

            {login && (
                <>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                    <button onClick={userLogin}>Log in</button>
                    <button onClick={setToHome}>Cancel</button>
                </>
            )}

            {register && (
                <>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                    <button onClick={createUser}>Register</button>
                    <button onClick={setToHome}>Cancel</button>
                </>
            )}

            {user && (
                <button onClick={() => navigate("/find")}>Find movies</button>
            )}

        </div>
    );
}

export default Home;
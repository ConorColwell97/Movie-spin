import './styles.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const VITE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const logOut = async () => {
        let response;
        try {
            response = await axios.delete(`${VITE_URL}/userLogout`
                , { withCredentials: true }
            );
        } catch (error) {
            console.log(error);
        }

        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        if (localStorage.getItem('user') !== null) {
            setUser(localStorage.getItem('user'));
        }
    }, []);

    return (
        <div>
            <button onClick={() => navigate("/find")}>Find movies</button>
            <button onClick={() => navigate("/movies")}>Your movies</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => {
                const confirmed = window.confirm(`Log out of account ${localStorage.getItem('user')}?`);
                if (confirmed) {
                    logOut();
                }
            }}>Log out</button>
        </div>
    );
}

export default Home;
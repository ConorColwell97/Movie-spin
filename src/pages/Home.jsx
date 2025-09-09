import './styles.css';
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

    return (
        <div>
            <h1>Welcome {localStorage.getItem('user')}!</h1>
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
        </div>
    );
}

export default Home;
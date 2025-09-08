import axios from "axios";
import { useEffect, useState } from "react";
import './styles.css';

const Movies = () => {
    const [data, setData] = useState(null);
    const VITE_URL = import.meta.env.VITE_API_URL;

    const getMovies = async () => {
        let response;

        try {
            response = await axios.get(`${VITE_URL}/getmovies/${encodeURIComponent(localStorage.getItem('user'))
            }`,{ withCredentials: true });

            console.log(response.data);
            setData(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getMovies();
    }, []);

    return (
        <div className='main'>
            {data && (
                data.movies.map((movie, index) => (
                    <div className='container' key={index}>
                        <p>{movie.title}</p>
                        <p>{movie.genres}</p>
                        <p>{movie.releaseDate}</p>
                        <p>{movie.overview}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Movies;
import axios from "axios";
import { useEffect, useState } from "react";
import Checkbox from '../components/Checkbox';
import './styles.css';

const Movies = () => {
    const [data, setData] = useState(null);
    const [moviesToRemove, setMoviesToRemove] = useState([]);
    const disabled = (moviesToRemove.length === 0);
    const VITE_URL = import.meta.env.VITE_API_URL;

    const getMovies = async () => {
        let response;

        try {
            response = await axios.get(`${VITE_URL}/getmovies/${encodeURIComponent(localStorage.getItem('user'))
                }`, { withCredentials: true });

            setData(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteMovies = async () => {
        let response;

        try {
            response = await axios.patch(`${VITE_URL}/deletemovies/${encodeURIComponent(localStorage.getItem('user'))}`,
            moviesToRemove, { withCredentials: true });

            setMoviesToRemove([]);
            getMovies();
        } catch (error) {
            console.log(error);
        }
    }

    const addItem = (setArr, item, checked) => {
        if (checked) {
            setArr(prev => {
                return [...prev, item];
            });
        } else {
            setArr(prev => {
                return prev.filter(element => element != item);
            });
        }
    }

    useEffect(() => {
        getMovies();
    }, []);

    return (
        <div className='main'>
            {data !== null ? (
                <>
                    {data.movies.map((movie, index) => (
                        <div className='container' key={index}>
                            <p>{movie.title}</p>
                            <p>{movie.genres}</p>
                            <p>{movie.releaseDate}</p>
                            <p>{movie.overview}</p>
                            <label>
                                Mark as watched:
                                <Checkbox visible={true} action={addItem} item={movie.title} setArr={setMoviesToRemove} />
                            </label>

                        </div>
                    ))}
                    <button disabled={disabled} onClick={deleteMovies}>Delete all marked as watched?</button>
                </>

            ) : (
                <p>You do not have any movies in your collection</p>
            )}
        </div>
    );
}

export default Movies;
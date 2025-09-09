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
            
            if(response.data.movies.length === 0) {
                setData(null);
            } else {
                setData(response.data);
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    const deleteMovies = () => {
        
        axios.patch(`${VITE_URL}/deletemovies/${encodeURIComponent(localStorage.getItem('user'))}`, moviesToRemove, { withCredentials: true })
            .then(response => {
                console.log(response.data)
            })
            .then(() => {
                setMoviesToRemove([]);
            })
            .then(() => {
                setData(null);
            })
            .then(() => {
                getMovies();
            })
            .catch(error => {
                console.log(error);
            });
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
        <div style={{ display: "flex", flexDirection: "column" }}>
            {data !== null ? (
                <>
                    <div className="main">
                        {data.movies.map((movie, index) => (
                            <div className='container' key={index}>
                                <p>{movie.title}</p>
                                <p>{movie.genres}</p>
                                <p>{movie.releaseDate}</p>
                                <p>{movie.overview}</p>
                                <label>
                                    Mark as watched/No longer interested:
                                    <Checkbox visible={true} action={addItem} item={movie.title} setArr={setMoviesToRemove} />
                                </label>

                            </div>
                        ))}
                    </div>
                    <button disabled={disabled} onClick={() => {
                        const confirmed =  window.confirm(`Delete marked movies? This action cannot be undone`);
                        if(confirmed) {
                            deleteMovies();
                        }
                    }}>Delete all marked movies</button>
                </>
            ) : (
                <p>You do not have any movies in your collection</p>
            )}
        </div>
    );
}

export default Movies;
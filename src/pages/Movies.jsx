import axios from "axios";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import './styles.css';

const Movies = () => {
    const [data, setData] = useState(null);
    const [moviesToRemove, setMoviesToRemove] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const disabled = (moviesToRemove.length === 0);
    const VITE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const getMovies = async () => {
        setError(null);

        try {
            const response = await axios.get(`${VITE_URL}/getmovies/${encodeURIComponent(localStorage.getItem('user'))
                }`, { withCredentials: true });

            if (response.data.movies.length === 0) {
                setData(null);
            } else {
                setData(response.data);
            }

        } catch (err) {

            if (err.status === 401) {
                alert("You are not authorized to make this request");
                localStorage.clear();
                navigate("/");
            } else {
                setError("An error occurred");
            }
        }

        setIsLoading(false);
    }

    const deleteMovies = () => {
        setError(null);
        setIsLoading(true);

        axios.patch(`${VITE_URL}/deletemovies/${encodeURIComponent(localStorage.getItem('user'))}`, moviesToRemove, { withCredentials: true })
            .then(() => {
                setMoviesToRemove([]);
            })
            .then(() => {
                setData(null);
            })
            .then(() => {
                getMovies();
            })
            .catch(err => {

                if (err.status === 401) {
                    setError("You are not authorized to make this request");
                } else {
                    setError("An error occurred");
                }
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

    if (isLoading) {
        return (
            <label style={{ margin: "0 auto", width: "10em", alignSelf: "center" }}>
                Loading...
                <BarLoader
                    color={"#470000"}
                    loading={true}
                    size={150}
                    cssOverride={{ width: "10em" }}
                />
            </label>
        );

    } else {
        return (
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "2em", padding: "2em" }}>
                {data !== null ? (
                    <>
                        <div className="main">
                            {data.movies.map((movie, index) => (
                                <Card
                                    key={index}
                                    visible={true}
                                    action={addItem}
                                    item={movie}
                                    setArr={setMoviesToRemove}
                                    text={"Mark as watched/No longer interested"}
                                    context={"remove"}
                                />
                            ))}
                        </div>
                        <button disabled={disabled} onClick={() => {
                            const confirmed = window.confirm(`Delete marked movies? This action cannot be undone`);
                            if (confirmed) {
                                deleteMovies();
                            }
                        }}>Delete all marked movies</button>
                    </>
                ) : (
                    <h1 style={{ color: "#470000", textAlign: "center" }}>You do not have any movies in your collection</h1>
                )}

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}
            </div>
        );
    }


}

export default Movies;
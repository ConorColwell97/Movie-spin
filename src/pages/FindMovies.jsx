import './styles.css';
import Checkbox from '../components/Checkbox';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindMovies = () => {

    // const [genres, setGenres] = useState([]);
    const [genreFilters, setGenreFilters] = useState([]);
    const [dateAfterFilter, setDateAfterFilter] = useState("");
    const [dateBeforeFilter, setDateBeforeFilter] = useState("");
    const [visible, setVisible] = useState(false);

    const [data, setData] = useState([]);
    const [movies, setMovies] = useState([]);
    const [success, setSuccess] = useState(false);
    const disabled = (movies.length === 0);

    const navigate = useNavigate();
    const VITE_URL = import.meta.env.VITE_API_URL;

    const genres =[
        { "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" },
        { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" },
        { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" },
        { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" },
        { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" },
        { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western"}
    ];

    // const getGenres = async () => {
    //     if (localStorage.getItem('genres') === null) {
    //         try {
    //             const response = await axios.get(`${VITE_URL}/genres/${localStorage.getItem('user')}`,
    //                 { withCredentials: true }
    //             );
    //             setGenres(response.data);
    //             const data = JSON.stringify(response.data);
    //             localStorage.setItem('genres', data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     } else {
    //         const data = JSON.parse(localStorage.getItem('genres'));
    //         setGenres(data);
    //     }
    // }

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

    const search = async () => {
        let filters = "";

        if (genreFilters.length > 0) {
            filters = "with_genres=" + genreFilters[0];
            for (let i = 1; i < genreFilters.length; i++) {
                filters += ("," + genreFilters[i]);
            }
        }

        if (dateAfterFilter.length > 0) {
            if (filters.length > 0) {
                filters += '&';
            }
            filters += (`primary_release_date.gte=${dateAfterFilter}`);
        }

        if (dateBeforeFilter.length > 0) {
            if (filters.length > 0) {
                filters += '&';
            }
            filters += (`primary_release_date.lte=${dateBeforeFilter}`);
        }

        if (filters.length === 0) {
            setData("No filters applied");
        } else {
            try {
                const response = await axios.get(`${VITE_URL}/mymovies/${localStorage.getItem('user')}/${encodeURIComponent(filters)}`,
                    { withCredentials: true });
                setData(response.data);
            } catch (error) {
                console.log(`error: ${error}`);
            }
        }
    }

    const addMovies = async () => {
        let response;

        try {
            response = await axios.put(`${VITE_URL}/addmovies/${localStorage.getItem('user')}`, movies,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }, withCredentials: true
                });

            setSuccess(true);
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     getGenres();
    // }, []);

    return (
        <div className='filters'>
            {data.length === 0 ? (
                <>
                    <div className='dropdown'>
                        <button onClick={() => setVisible(!visible)} style={{ marginTop: "1.5em" }}>View Genres</button>
                        <ul className={visible ? 'list-visible' : 'not-visible'}>
                            {genres.map((genre, index) => (
                                <li key={index}>
                                    {genre.name}
                                    <Checkbox visible={visible} action={addItem} item={genre.id} setArr={setGenreFilters} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <label style={{ display: "flex", flexDirection: "column" }}>
                        Filter after a date
                        <input type="date" value={dateAfterFilter} onChange={(e) => setDateAfterFilter(e.target.value)} />
                    </label>


                    <label style={{ display: "flex", flexDirection: "column" }}>
                        Filter before a date
                        <input type="date" value={dateBeforeFilter} onChange={(e) => setDateBeforeFilter(e.target.value)} />
                    </label>

                    <button style={{ marginTop: "1.5em" }} onClick={search}>Apply filters & search</button>
                </>

            ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {success ? (
                        <>
                            <p style={{ color: "#470000" }}>Movies successfully added!</p>
                            <button onClick={() => navigate("/home")}>Finish</button>
                        </>
                    ) : (
                        <>
                            <div className='main'>
                                {data.map((item, index) => (
                                    <div className='container' key={index}>
                                        <p style={{ color: "#470000" }}>{item.title}</p>
                                        <p style={{ color: "#470000" }}>{item.genres}</p>
                                        <p style={{ color: "#470000" }}>{item.overview}</p>
                                        <p style={{ color: "#470000" }}>{item.releaseDate}</p>
                                        <Checkbox visible={true} action={addItem} item={item} setArr={setMovies} />
                                    </div>
                                ))}
                            </div>

                            {movies.length === 0 && (
                                <p style={{ color: "#470000" }}>No movies selected</p>
                            )}
                            <button onClick={addMovies} disabled={disabled}>Add selected movies?</button>
                        </>
                    )}
                </div>
            )}

        </div>
    );
}

export default FindMovies;
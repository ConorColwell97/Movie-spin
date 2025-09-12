import './styles.css';
import Card from '../components/Card';
import Checkbox from '../components/Checkbox';
import { useState } from 'react';
import { BarLoader } from "react-spinners";
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';

const FindMovies = () => {

    // const [genres, setGenres] = useState([]);
    const [genreFilters, setGenreFilters] = useState([]);
    const [dateAfterFilter, setDateAfterFilter] = useState("");
    const [dateBeforeFilter, setDateBeforeFilter] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [movies, setMovies] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const disabled = (movies.length === 0);
    const navigate = useNavigate();
    const VITE_URL = import.meta.env.VITE_API_URL;

    const genres = [
        { value: 28, label: "Action" }, { value: 12, label: "Adventure" }, { value: 16, label: "Animation" },
        { value: 35, label: "Comedy" }, { value: 80, label: "Crime" }, { value: 99, label: "Documentary" },
        { value: 18, label: "Drama" }, { value: 10751, label: "Family" }, { value: 14, label: "Fantasy" },
        { value: 36, label: "History" }, { value: 27, label: "Horror" }, { value: 10402, label: "Music" },
        { value: 9648, label: "Mystery" }, { value: 10749, label: "Romance" }, { value: 878, label: "Science Fiction" },
        { value: 10770, label: "TV Movie" }, { value: 53, label: "Thriller" }, { value: 10752, label: "War" }, { value: 37, label: "Western" }
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

    const addItem = (items) => {
        const values = items.map(item => {
            return item.value;
        })

        setGenreFilters(values);
    }

    const addToList = (setArr, item, checked) => {
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
        setError(null);
        setIsLoading(true);

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


        try {
            const response = await axios.get(`${VITE_URL}/mymovies/${localStorage.getItem('user')}/${encodeURIComponent(filters)}`,
                { withCredentials: true });
            setData(response.data);
        } catch (err) {

            if (err.status === 401) {
                setError("You are not authorized to make this request");
            } else {
                setError("An error occurred");
            }
        }

        setIsLoading(false);

    }

    const addMovies = async () => {
        setError(null);

        try {
            await axios.put(`${VITE_URL}/addmovies/${localStorage.getItem('user')}`, movies,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }, withCredentials: true
                });

            setSuccess(true);
            setMovies([]);
        } catch (err) {

            if (err.status === 401) {
                setError("You are not authorized to make this request");
            } else {
                setError("An error occurred");
            }
        }
    }

    // useEffect(() => {
    //     getGenres();
    // }, []);


    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <div className='filters'>
                <label>
                    Pick genre(s)
                    <Select
                        isMulti={true}
                        options={genres}
                        onChange={addItem}
                    />
                </label>


                <label style={{ display: "flex", flexDirection: "column" }}>
                    Filter after a date
                    <input type="date" value={dateAfterFilter} onChange={(e) => setDateAfterFilter(e.target.value)} />
                </label>


                <label style={{ display: "flex", flexDirection: "column" }}>
                    Filter before a date
                    <input type="date" value={dateBeforeFilter} onChange={(e) => setDateBeforeFilter(e.target.value)} />
                </label>

                <button style={{ marginTop: "1.5em" }} onClick={search}>Apply filters & search</button>

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}
            </div>

            <div>

                {data.length > 0 && (
                    <>
                        {isLoading ? (
                            <label style={{ margin: "0 auto", width: "10em", alignSelf: "center" }}>
                                Loading...
                                <BarLoader
                                    color={"#470000"}
                                    loading={true}
                                    size={150}
                                    cssOverride={{ width: "10em" }}
                                />
                            </label>
                        ) : (
                            <>
                                <div className='main'>
                                    {data.map((item, index) => (
                                        <Card
                                            key={index}
                                            visible={true}
                                            action={addToList}
                                            item={item}
                                            setArr={setMovies}
                                            text={"Save movie: "}
                                            context={"store"}
                                        />
                                    ))}
                                </div>

                                {success ? (
                                    <p style={{ color: "#470000" }}>Movies successfully added</p>
                                ) : (
                                    <p style={{ color: "#470000" }}>Add movies</p>
                                )}

                                <button style={{ marginBottom: "5em" }} onClick={addMovies} disabled={disabled}>Add selected movies?</button>
                            </>
                        )}
                    </>
                )}

            </div>

        </div>
    );
}

export default FindMovies;
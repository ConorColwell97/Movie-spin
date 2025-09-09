import './styles.css';
import Checkbox from '../components/Checkbox';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FindMovies = () => {

    const [genres, setGenres] = useState([]);
    const [genreFilters, setGenreFilters] = useState([]);
    const [dateAfterFilter, setDateAfterFilter] = useState("");
    const [dateBeforeFilter, setDateBeforeFilter] = useState("");
    const [visible, setVisible] = useState(false);

    const [data, setData] = useState([]);
    const [movies, setMovies] = useState([]);
    const disabled = (movies.length === 0);


    const VITE_URL = import.meta.env.VITE_API_URL;

    const getGenres = async () => {
        if (localStorage.getItem('genres') === null) {
            try {
                const response = await axios.get(`${VITE_URL}/genres/${localStorage.getItem('user')}`,
                    { withCredentials: true }
                );
                setGenres(response.data);
                const data = JSON.stringify(response.data);
                localStorage.setItem('genres', data);
            } catch (error) {
                console.log(error);
            }
        } else {
            const data = JSON.parse(localStorage.getItem('genres'));
            setGenres(data);
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
            { headers: {
                "Content-Type": "application/json"
            }, withCredentials: true });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGenres();
    }, []);

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
                                    <Checkbox visible={visible} action={addItem} item={genre.id} setArr={setGenreFilters}/>
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
                <>
                    <div className='main'>
                        {data.map((item, index) => (
                            <div className='container' key={index}>
                                <p>{item.title}</p>
                                <p>{item.genres}</p>
                                <p>{item.overview}</p>
                                <p>{item.releaseDate}</p>
                                <Checkbox visible={true} action={addItem} item={item} setArr={setMovies}/>
                            </div>
                        ))}
                    </div>

                    {movies.length === 0 && (
                        <p>No movies selected</p>
                    )}
                    <button onClick={addMovies} disabled={disabled}>Add selected movies?</button>
                </>
            )}

        </div>
    );
}

export default FindMovies;
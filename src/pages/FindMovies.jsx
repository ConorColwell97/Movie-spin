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
    const VITE_URL = import.meta.env.VITE_API_URL;

    const getGenres = async () => {
        if (localStorage.getItem('genres') === null) {
            try {
                const response = await axios.get(`${VITE_URL}/genres`);
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

    const addGenreFilter = (id, checked) => {
        if (checked) {
            setGenreFilters(prev => {
                return [...prev, id];
            });
        } else {
            setGenreFilters(prev => {
                return prev.filter(item => item != id);
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
                const response = await axios.get(`${VITE_URL}/mymovies/${encodeURIComponent(filters)}`);
                setData(response.data);
            } catch (error) {
                console.log(`error: ${error}`);
            }
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
                                    <Checkbox visible={visible} addGenreFilter={addGenreFilter} genre={genre.id} />
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
                <div className='main'>
                    {data.map((item, index) => (
                        <div className='container' key={index}>
                            <p>{item.title}</p>
                            <p>{item.genres}</p>
                            <p>{item.overview}</p>
                            <p>{item.releaseDate}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default FindMovies;
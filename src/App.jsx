import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FindMovies from './pages/FindMovies';
import Movies from './pages/Movies';
import './App.css'

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/find' element={<FindMovies/>}/>
        <Route path='/movies' element={<Movies/>}/>
      </Routes>
    </Router>
  )
}

export default App;

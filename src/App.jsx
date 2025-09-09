import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserAuth from './pages/UserAuth';
import Home from './pages/Home';
import FindMovies from './pages/FindMovies';
import Movies from './pages/Movies';
import Profile from './pages/Profile';
import './App.css'

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserAuth/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path='/find' element={<FindMovies/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </Router>
  )
}

export default App;

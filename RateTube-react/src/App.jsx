import React, {use, useState} from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import ResultList from './components/ResultList';
import VideoDetail from './components/VideoDetail';
import ChannelDetail from './components/ChannelDetail'
import Login from './components/Login';
import Register from './components/Register';

function App() {
    const [videos, setVideos] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const searchVideos = async (query, max = 10, pageToken = '') => {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/youtube?q=${query}&max=${max}&pageToken=${pageToken}`);
        const data = await res.json();

        if (pageToken) {
            setVideos(prev => [...prev, ...data.items]);
        } else {
            setVideos(data.items || []);
        }

        setNextPageToken(data.nextPageToken || null);
        setLoading(false);
    };

    const handleHomeClick = () => {
        setVideos([]);
        setNextPageToken(null);
        setLoading(false);
        navigate('/');
    };

    return (
        <div className='App'>
            <h1 onClick={handleHomeClick} style={{ cursor: 'pointer' }}>RateTube</h1>
            <nav>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
            </nav>
            
            <Routes>
                <Route
                    path='/'
                    element={
                        <>
                            <SearchBar onSearch={searchVideos} />
                            {loading && <p>Loading...</p>}
                            <ResultList results={videos} />
                        </>
                    }
                />
                <Route path='/video/:id' element={<VideoDetail />} />
                <Route path='/channel/:id' element={<ChannelDetail />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
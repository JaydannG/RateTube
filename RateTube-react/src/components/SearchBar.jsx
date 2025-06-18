import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = query.trim();

        const videoMatch = trimmed.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
        const channelMatch = trimmed.match(/(?:channel\/|\/@)([a-zA-Z0-9_-]+)/);

        if (videoMatch) {
            const videoId = videoMatch[1];
            navigate(`/video/${videoId}`);
        } else if (channelMatch) {
            const channelId = channelMatch[1];
            navigate(`/channel/${channelId}`);
        } else {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                placeholder="Search YouTube..."
                onChange={(e) => setQuery(e.target.value)}
            />

            <button type="submit">Search</button>
        </form>
    );
}
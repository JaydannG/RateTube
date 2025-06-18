import React from 'react';
import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
    const { title, thumbnails } = video.snippet;
    const videoId = video.id?.videoId || video.id;

    return (
        <div className='video-card'>
            <Link to={`/video/${videoId}`}>
                <img src={thumbnails.medium.url} alt={title} />
                <h4>{title}</h4>
            </Link>
        </div>
    );
}
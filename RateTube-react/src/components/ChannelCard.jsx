import React from 'react';
import { Link } from 'react-router-dom';

export default function ChannelCard({ channel }) {
    const { title, thumbnails } = channel.snippet;
    const channelId = channel.id.channelId;

    return (
        <div className='channel-card'>
            <Link to={`/channel/${channelId}`}>
                <img src={thumbnails?.medium.url} alt={title} />
                <h4>{title}</h4>
            </Link>
        </div>
    );
}
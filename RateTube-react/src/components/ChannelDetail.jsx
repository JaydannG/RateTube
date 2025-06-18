import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from './VideoCard';

export default function ChannelDetail() {
    const { id } = useParams();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/channel?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setChannel(data);
            });

        fetch(`http://localhost:3000/api/channel/videos?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setVideos(data.items);
            })
    }, [id]);

    if (!channel) return <p>Loading...</p>;

    const { snippet = {}, statistics = {} } = channel;
    const { title, thumbnails } = snippet;

    return (
        <div className='channel-detail'>
            <img src={thumbnails?.default?.url} alt={title} />
            <h2>{title}</h2>
            <p><strong>Subscribers: </strong> {Number(statistics.subscriberCount).toLocaleString()}</p>
            <p><strong>Total Views: </strong> {Number(statistics.viewCount).toLocaleString()}</p>
            <p><strong>Total Videos: </strong> {Number(statistics.videoCount).toLocaleString()}</p>

            <h3>Videos</h3>
            <div className='video-section'>
                {Array.isArray(videos) && videos.map((video) => (
                    <VideoCard key={video.id.videoId || video.id} video={video} />
                ))}
            </div>
        </div>
    )
}
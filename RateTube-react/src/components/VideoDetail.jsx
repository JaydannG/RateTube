import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/api/youtube?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVideo(data.items?.[0]);
      })
      .catch((err) => console.error('Error fetching video details:', err));
  }, [id]);

  if (!video) {
    return <p>Loading...</p>;
  }

  const { title, publishedAt, channelTitle, thumbnails } = video.snippet;
  const { viewCount, likeCount } = video.statistics;
  const { duration } = video.contentDetails;

  return (
    <div className='video-detail'>
      <h2>{title}</h2>
      <img src={thumbnails.medium.url} alt={title} />

      <p><strong>Channel: </strong> {channelTitle}</p>
      <p><strong>Published: </strong> {new Date(publishedAt).toLocaleDateString()}</p>
      <p><strong>Views: </strong> {Number(viewCount).toLocaleString()}</p>
      <p><strong>Likes: </strong> {Number(likeCount).toLocaleString()}</p>
      <p><strong>Duration: </strong> {parseDuration(duration)}</p>
    </div>
  );
}

function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = match[1] || 0;
  const minutes = match[2] || 0;
  const seconds = match[3] || 0;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || 'N/A';
}
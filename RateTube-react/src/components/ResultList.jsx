import React from 'react';
import VideoCard from './VideoCard';
import ChannelCard from './ChannelCard';

export default function ResultList({ results = [] }) {
    const videoResults = results.filter(r => r.id.kind === 'youtube#video');
    const channelResults = results.filter(r => r.id.kind === 'youtube#channel');

    return (
        <div className='results-list'>
            {channelResults.length > 0 && (
                <>
                    <h3>Channels</h3>
                    <div className='channel-results'>
                        {channelResults.map((channel) => (
                            <ChannelCard key={channel.id.channelId} channel={channel} />
                        ))}
                    </div>
                </>
            )}

            {videoResults.length > 0 && (
                <>
                    <h3>Videos</h3>
                    <div className='video-results'>
                        {videoResults.map((video) => (
                            <VideoCard key={video.id.videoId} video={video} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

let fullChannelResults = []; 
let fullVideoResults = []; 
let displayedChannelCount = 0;
let displayedVideoCount = 0;
const resultsPerPage = 10;

/**
 * Searches for videos and channels based on user input and filter selection.
 */
async function searchYouTube() {
    const query = document.getElementById('searchInput').value.trim();
    const filter = document.getElementById('filter').value;

    if (query === '') {
        alert('Please enter a search term');
        return;
    }

    const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=15&type=video,channel&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        fullChannelResults = [];
        fullVideoResults = [];
        displayedChannelCount = 0;
        displayedVideoCount = 0;
        document.getElementById('channelResults').innerHTML = '';
        document.getElementById('videoResults').innerHTML = '';
        document.getElementById('channelSection').classList.add('hidden');
        document.getElementById('videoSection').classList.add('hidden');
        document.getElementById('showMoreChannels').classList.add('hidden');
        document.getElementById('showMoreVideos').classList.add('hidden');

        if (!data.items || data.items.length === 0) {
            alert('No results found.');
            return;
        }

        data.items.forEach(item => {
            const result = {
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url
            };

            if (item.id.kind === "youtube#channel" && (filter === 'channel' || filter === 'both')) {
                result.channelId = item.id.channelId;
                fullChannelResults.push(result);
            } else if (item.id.kind === "youtube#video" && (filter === 'video' || filter === 'both')) {
                result.videoId = item.id.videoId;
                fullVideoResults.push(result);
            }
        });

        displayResults('channel');
        displayResults('video');

    } catch (error) {
        console.error("Error fetching YouTube search results:", error);
    }
}

/**
 * Displays a batch of results for channels or videos.
 */
function displayResults(type) {
    const container = document.getElementById(type === 'channel' ? 'channelResults' : 'videoResults');
    const section = document.getElementById(type === 'channel' ? 'channelSection' : 'videoSection');
    const showMoreBtn = document.getElementById(type === 'channel' ? 'showMoreChannels' : 'showMoreVideos');
    
    let resultsArray = type === 'channel' ? fullChannelResults : fullVideoResults;
    let displayedCount = type === 'channel' ? displayedChannelCount : displayedVideoCount;

    const batch = resultsArray.slice(displayedCount, displayedCount + resultsPerPage);

    batch.forEach(item => {
        const element = document.createElement('div');
        if (type === 'channel') {
            element.innerHTML = `
                <h3>${item.title}</h3>
                <img src="${item.thumbnail}" alt="${item.title}">
                <button onclick="selectChannel('${item.channelId}', '${item.title}')">View Videos</button>
                <hr>
            `;
        } else {
            const videoUrl = `https://www.youtube.com/watch?v=${item.videoId}`;
            element.innerHTML = `
                <h3>${item.title}</h3>
                <a href="${videoUrl}" target="_blank">
                    <img src="${item.thumbnail}" alt="${item.title}">
                </a>
                <hr>
            `;
        }
        container.appendChild(element);
    });

    if (type === 'channel') {
        displayedChannelCount += batch.length;
    } else {
        displayedVideoCount += batch.length;
    }

    if (resultsArray.length > 0) {
        section.classList.remove('hidden');
    }

    if (displayedCount + batch.length < resultsArray.length) {
        showMoreBtn.classList.remove('hidden');
    } else {
        showMoreBtn.classList.add('hidden');
    }
}

/**
 * Loads more results when "Show More Results" is clicked.
 */
function showMore(type) {
    displayResults(type);
}

/**
 * Redirects to videos.html and stores selected channel data.
 */
function selectChannel(channelId, channelTitle) {
    localStorage.setItem('selectedChannelId', channelId);
    localStorage.setItem('selectedChannelTitle', channelTitle);
    window.location.href = 'videos.html';
}

/**
 * Fetches and displays videos from the selected channel.
 */
async function getChannelVideos() {
    const channelId = localStorage.getItem('selectedChannelId');
    const channelTitle = localStorage.getItem('selectedChannelTitle');

    if (!channelId) {
        alert('No channel selected.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('channelTitle').textContent = `Videos from ${channelTitle}`;

    const url = `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            alert('No videos found for this channel.');
            return;
        }

        const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;

        const playlistUrl = `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`;
        const playlistResponse = await fetch(playlistUrl);
        const playlistData = await playlistResponse.json();

        const videoResults = document.getElementById('videoResults');
        videoResults.innerHTML = '';

        playlistData.items.forEach(item => {
            const videoId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            const thumbnail = item.snippet.thumbnails.medium.url;
            videoResults.innerHTML += `
                <h3>${title}</h3>
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                    <img src="${thumbnail}" alt="${title}">
                </a>
                <hr>
            `;
        });

    } catch (error) {
        console.error("Error fetching channel videos:", error);
    }
}

/**
 * Returns to search page.
 */
function goBack() {
    window.location.href = 'index.html';
}
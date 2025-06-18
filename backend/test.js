// fetch('http://localhost:3000/api/youtube?q=Clint+Stevens')
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//         data.items.forEach(video => {
//             console.log(video.snippet.title)
//         });
//     })
//     .catch(err => console.error(err));

let resultsPerPage = 10

async function search() {
    // get the query and filter from the user
    const query = document.getElementById('searchInput').value.trim();
    const filter = document.getElementById('filter').value.trim();

    // if the user enters an empty query, alert them and return
    if (query === '') {
        alert('Please enter a search term');
        return;
    }

    // make the api call to get the results from the search
    const response = await fetch(`http://localhost:3000/api/youtube?q=${encodeURIComponent(query)}&maxResults=${resultsPerPage}`);
    const data = await response.json();

    channelResults = [];
    videoResults = [];

    // if the query results in no results, alert the user and return
    if (!data.items || data.items.length === 0) {
        alert('No results found');
        return;
    }

    // loop through each result from the query and determine whether it is a video or channel
    // then add it to the proper array
    data.items.forEach(item => {
        const result = {
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url
        };

        if (item.id.kind === 'youtube#channel' && (filter === 'channel' || filter === 'both')) {
            result.channelId = item.id.channelId;
            channelResults.push(result);
        } else if (item.id.kind === 'youtube#video' && (filter === 'video' || filter === 'both')) {
            result.videoId = item.id.videoId;
            videoResults.push(result);
        }
    });
}

function showResults(type) {

}
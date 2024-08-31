document.addEventListener('DOMContentLoaded', () => {
    const savedQuery = sessionStorage.getItem('searchQuery');
    const savedResults = sessionStorage.getItem('searchResults');

    if (savedQuery && savedResults) {
        document.getElementById('searchQuery').value = savedQuery;
        displayResults(JSON.parse(savedResults));
    }
});

function performSearch() {
    const query = document.getElementById('searchQuery').value.trim();
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (query === '') {
        alert('Please enter a search query.');
        return;
    }

    // Show loading indicator
    loadingIndicator.style.display = 'block';

    // Clear previous results while loading
    resultsContainer.innerHTML = '';

    fetch(`/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const searchResults = data.webPages ? data.webPages.value : [];
            sessionStorage.setItem('searchQuery', query);
            sessionStorage.setItem('searchResults', JSON.stringify(searchResults));
            displayResults(searchResults);
        })
        .catch(error => {
            console.error('Error:', error);
            resultsContainer.innerHTML = '<p>Error occurred while fetching results.</p>';
        })
        .finally(() => {
            // Hide loading indicator after search completes
            loadingIndicator.style.display = 'none';
        });
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
        results.forEach((result) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            // Title
            const resultTitle = document.createElement('a');
            resultTitle.href = result.url;
            resultTitle.textContent = result.name;
            resultTitle.target = '_blank'; // Open links in a new tab
            resultItem.appendChild(resultTitle);

            // Add a line break to separate title from URL
            resultItem.appendChild(document.createElement('br'));

            // URL
            const resultUrl = document.createElement('a');
            resultUrl.href = result.url;
            resultUrl.textContent = result.url;
            resultUrl.className = 'url-link';
            resultUrl.target = '_blank'; // Open links in a new tab
            resultItem.appendChild(resultUrl);

            // Description/Snippet
            const resultDetails = document.createElement('p');
            resultDetails.textContent = result.snippet;
            resultItem.appendChild(resultDetails);

            resultsContainer.appendChild(resultItem);
        });
    }
}

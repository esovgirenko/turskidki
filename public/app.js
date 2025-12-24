/**
 * Frontend JavaScript for tour package search
 */

// Initialize form with today's date as minimum
document.addEventListener('DOMContentLoaded', () => {
    const departureDateInput = document.getElementById('departureDate');
    const today = new Date().toISOString().split('T')[0];
    departureDateInput.setAttribute('min', today);
    departureDateInput.value = today;

    // Handle hotel filter type change
    const hotelFilterType = document.getElementById('hotelFilterType');
    const hotelNameGroup = document.getElementById('hotelNameGroup');
    
    hotelFilterType.addEventListener('change', (e) => {
        if (e.target.value === 'single') {
            hotelNameGroup.style.display = 'block';
            document.getElementById('hotelName').required = true;
        } else {
            hotelNameGroup.style.display = 'none';
            document.getElementById('hotelName').required = false;
        }
    });

    // Handle form submission
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', handleSearch);
});

let childCount = 0;

function addChild() {
    childCount++;
    const container = document.getElementById('childrenContainer');
    const childDiv = document.createElement('div');
    childDiv.className = 'child-item';
    childDiv.id = `child-${childCount}`;
    childDiv.innerHTML = `
        <input type="number" placeholder="Age (0-17)" min="0" max="17" required 
               id="childAge-${childCount}" name="childAge-${childCount}">
        <button type="button" class="btn btn-secondary" onclick="removeChild(${childCount})">Remove</button>
    `;
    container.appendChild(childDiv);
}

function removeChild(id) {
    const childDiv = document.getElementById(`child-${id}`);
    if (childDiv) {
        childDiv.remove();
    }
}

async function handleSearch(e) {
    e.preventDefault();
    
    const errorContainer = document.getElementById('errorContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const searchBtn = document.getElementById('searchBtn');
    
    // Clear previous results
    errorContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    
    // Disable button and show loading
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    
    try {
        // Collect form data
        const formData = {
            departureCity: document.getElementById('departureCity').value.trim(),
            destinationCountry: document.getElementById('destinationCountry').value.trim(),
            destinationRegion: document.getElementById('destinationRegion').value.trim(),
            hotelFilter: {
                type: document.getElementById('hotelFilterType').value,
                hotelName: document.getElementById('hotelFilterType').value === 'single' 
                    ? document.getElementById('hotelName').value.trim() 
                    : undefined
            },
            departureDate: document.getElementById('departureDate').value,
            nights: parseInt(document.getElementById('nights').value, 10),
            guests: {
                adults: parseInt(document.getElementById('adults').value, 10),
                children: []
            },
            limit: parseInt(document.getElementById('limit').value, 10) || 20
        };

        // Collect children ages
        const childrenInputs = document.querySelectorAll('[id^="childAge-"]');
        childrenInputs.forEach(input => {
            const age = parseInt(input.value, 10);
            if (!isNaN(age)) {
                formData.guests.children.push({ age });
            }
        });

        // Make API request
        const response = await fetch('/api/tours/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        // Display results
        displayResults(data);
    } catch (error) {
        displayError(error.message || 'Failed to search tours. Please try again.');
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search Tours';
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `
        <div class="error">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <p>No tours found matching your criteria.</p>
                    <p>Try adjusting your search parameters.</p>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="card results">
            <div class="results-header">
                <h2>Search Results</h2>
                <div class="results-count">
                    Showing ${data.results.length} of ${data.total} tours
                </div>
            </div>
    `;

    data.results.forEach(tour => {
        const childrenAges = tour.guests.children.map(c => c.age).join(', ');
        const childrenInfo = tour.guests.children.length > 0 
            ? `${tour.guests.children.length} child${tour.guests.children.length > 1 ? 'ren' : ''} (ages: ${childrenAges})`
            : 'No children';

        html += `
            <div class="tour-card">
                <div class="tour-header">
                    <div class="tour-title">${tour.hotel}</div>
                    <div class="tour-price">${formatPrice(tour.totalPrice)} ${tour.currency}</div>
                </div>
                <div class="tour-details">
                    <div class="tour-detail">
                        <span class="tour-detail-label">Tour Operator</span>
                        <span class="tour-detail-value">${tour.tourOperator}</span>
                    </div>
                    <div class="tour-detail">
                        <span class="tour-detail-label">Room Type</span>
                        <span class="tour-detail-value">${tour.roomType}</span>
                    </div>
                    <div class="tour-detail">
                        <span class="tour-detail-label">Departure Date</span>
                        <span class="tour-detail-value">${formatDate(tour.departureDate)}</span>
                    </div>
                    <div class="tour-detail">
                        <span class="tour-detail-label">Return Date</span>
                        <span class="tour-detail-value">${formatDate(tour.returnDate)}</span>
                    </div>
                    <div class="tour-detail">
                        <span class="tour-detail-label">Nights</span>
                        <span class="tour-detail-value">${tour.nights}</span>
                    </div>
                    <div class="tour-detail">
                        <span class="tour-detail-label">Guests</span>
                        <span class="tour-detail-value">${tour.guests.adults} adult${tour.guests.adults > 1 ? 's' : ''}, ${childrenInfo}</span>
                    </div>
                    <div class="tour-detail">
                        <span class="tour-detail-label">Tour ID</span>
                        <span class="tour-detail-value">${tour.tourId}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    resultsContainer.innerHTML = html;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}


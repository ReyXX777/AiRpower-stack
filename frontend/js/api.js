// Base URL for the API endpoint
const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with actual API URL

// Helper function to handle API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    // Include body data for POST, PUT, etc.
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and return JSON response
        return await response.json();
    } catch (error) {
        console.error(`Error in API request to ${url}:`, error);
        throw error;  // Rethrow for handling in the calling function
    }
}

// Function to GET data from the API
async function getData(endpoint) {
    return await apiRequest(endpoint, 'GET');
}

// Function to POST data to the API
async function postData(endpoint, data) {
    return await apiRequest(endpoint, 'POST', data);
}

// Function to PUT data to the API (update existing resource)
async function putData(endpoint, data) {
    return await apiRequest(endpoint, 'PUT', data);
}

// Function to DELETE data from the API
async function deleteData(endpoint) {
    return await apiRequest(endpoint, 'DELETE');
}

// Example Usage
// Fetch data
getData('example-endpoint')
    .then(data => console.log('GET Response:', data))
    .catch(error => console.error('Error fetching data:', error));

// Send new data
postData('example-endpoint', { name: 'New Item', description: 'Item description' })
    .then(data => console.log('POST Response:', data))
    .catch(error => console.error('Error posting data:', error));

export { getData, postData, putData, deleteData };

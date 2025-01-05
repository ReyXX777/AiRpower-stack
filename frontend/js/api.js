// Base URL for the API endpoint
const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

// Helper function to validate the base URL
function validateBaseUrl() {
    if (!API_BASE_URL || !API_BASE_URL.startsWith('http')) {
        throw new Error('Invalid API Base URL. Please ensure it starts with "http" or "https".');
    }
}

// Helper function to handle API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
    validateBaseUrl(); // Validate the base URL

    const url = `${API_BASE_URL}/${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    // Include body data for POST, PUT, etc.
    if (data && (method === 'POST' || method === 'PUT')) {
        if (typeof data !== 'object') {
            throw new Error('Invalid data format. Expected an object.');
        }
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorMessage = `HTTP Error! Status: ${response.status}`;

            // Handle common HTTP status codes
            switch (response.status) {
                case 400:
                    errorMessage += ' - Bad Request';
                    break;
                case 401:
                    errorMessage += ' - Unauthorized';
                    break;
                case 403:
                    errorMessage += ' - Forbidden';
                    break;
                case 404:
                    errorMessage += ' - Not Found';
                    break;
                case 500:
                    errorMessage += ' - Internal Server Error';
                    break;
                default:
                    errorMessage += ` - ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        // Parse and return JSON response
        return await response.json();
    } catch (error) {
        console.error(`Error in API request to ${url}:`, error);
        throw error; // Rethrow for handling in the calling function
    }
}

// Function to GET data from the API
async function getData(endpoint) {
    if (typeof endpoint !== 'string') {
        throw new Error('Invalid endpoint format. Expected a string.');
    }
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
(async () => {
    try {
        // Fetch data example
        const fetchedData = await getData('example-endpoint');
        console.log('GET Response:', fetchedData);

        // Send new data example
        const postedData = await postData('example-endpoint', { name: 'New Item', description: 'Item description' });
        console.log('POST Response:', postedData);
    } catch (error) {
        console.error('Error during API operations:', error);
    }
})();

// Export functions for use in other modules
export { getData, postData, putData, deleteData };

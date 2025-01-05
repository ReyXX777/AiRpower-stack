// Import the API functions from api.js
import { getData, postData, putData, deleteData } from './api.js';

// Select UI elements
const itemsContainer = document.getElementById('items-container');
const addItemForm = document.getElementById('add-item-form');
const itemNameInput = document.getElementById('item-name');
const itemDescriptionInput = document.getElementById('item-description');
const feedbackMessage = document.getElementById('feedback-message');
const loadingIndicator = document.getElementById('loading-indicator'); // Assume you have an element for the loading state

// Display feedback messages
function displayFeedback(message, isError = false) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.color = isError ? 'red' : 'green';
    setTimeout(() => feedbackMessage.textContent = '', 3000);
}

// Function to render items in the UI
function renderItems(items) {
    itemsContainer.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button class="edit-button" data-id="${item.id}">Edit</button>
            <button class="delete-button" data-id="${item.id}">Delete</button>
        `;
        itemsContainer.appendChild(itemElement);
    });

    // Attach event listeners after items are rendered
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => editItem(e.target.dataset.id));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => deleteItem(e.target.dataset.id));
    });
}

// Function to fetch and display items from the API
async function loadItems() {
    try {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const items = await getData('items'); // Fetch items from 'items' endpoint
        renderItems(items);
        displayFeedback('Items loaded successfully.');
    } catch (error) {
        console.error('Error loading items:', error);
        displayFeedback('Failed to load items.', true);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}

// Function to add a new item
async function addItem(event) {
    event.preventDefault(); // Prevent form submission

    const newItem = {
        name: itemNameInput.value,
        description: itemDescriptionInput.value
    };

    try {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const addedItem = await postData('items', newItem);
        await loadItems(); // Reload items after adding
        displayFeedback('Item added successfully!');
        addItemForm.reset(); // Clear the form
    } catch (error) {
        console.error('Error adding item:', error);
        displayFeedback('Failed to add item.', true);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}

// Function to edit an existing item
async function editItem(itemId) {
    const newName = prompt("Enter new name:");
    const newDescription = prompt("Enter new description:");

    if (newName && newDescription) {
        const updatedItem = { name: newName, description: newDescription };

        try {
            loadingIndicator.style.display = 'block'; // Show loading indicator
            await putData(`items/${itemId}`, updatedItem);
            await loadItems(); // Reload items after updating
            displayFeedback('Item updated successfully!');
        } catch (error) {
            console.error('Error updating item:', error);
            displayFeedback('Failed to update item.', true);
        } finally {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
        }
    }
}

// Function to delete an item
async function deleteItem(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            loadingIndicator.style.display = 'block'; // Show loading indicator
            await deleteData(`items/${itemId}`);
            await loadItems(); // Reload items after deletion
            displayFeedback('Item deleted successfully.');
        } catch (error) {
            console.error('Error deleting item:', error);
            displayFeedback('Failed to delete item.', true);
        } finally {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
        }
    }
}

// Add event listener to handle form submission for adding items
addItemForm.addEventListener('submit', addItem);

// Load items when the page loads
document.addEventListener('DOMContentLoaded', loadItems);

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define MongoDB URI and connect to the database
const mongoURI = 'mongodb://localhost:27017/yourDatabaseName'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model for items
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);

// Route to get all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// Route to create a new item
router.post('/items', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const newItem = new Item({ name, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Error creating item' });
    }
});

// Route to update an existing item
router.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Error updating item' });
    }
});

// Route to delete an item
router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});

module.exports = router;

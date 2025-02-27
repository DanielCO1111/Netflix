const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for a category
const Category = new Schema({
    name: { type: String, required: true },
    promoted: { type: Boolean, required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] // List of movies
});

// Customize the JSON output
Category.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString(); // Rename _id to id and convert to string
        delete ret._id;             // Remove _id
        delete ret.__v;             // Remove __v
        return ret;                 // Include all remaining fields (name, promoted, movies)
    },
});

module.exports = mongoose.model('Category', Category);
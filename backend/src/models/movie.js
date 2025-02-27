const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String },
    streamingUrl: { type: String },
    thumbnail: { type: String },
    promoted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // Reference to Category
});

module.exports = mongoose.model('Movie', movieSchema);
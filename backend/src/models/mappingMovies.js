const mongoose = require('mongoose');

const movieMappingSchema = new mongoose.Schema({
    _id: String, // MongoDB ObjectId as a string
    intId: Number, // Corresponding integer ID
});

module.exports = mongoose.model('MovieMapping', movieMappingSchema);
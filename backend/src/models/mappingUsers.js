const mongoose = require('mongoose');

const userMappingSchema = new mongoose.Schema({
    _id: String, // MongoDB ObjectId as a string
    intId: Number, // Corresponding integer ID
});

module.exports = mongoose.model('UserMapping', userMappingSchema);
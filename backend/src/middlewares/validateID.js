const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    const { id, userId } = req.params; // Extract `id` and `userId` from params

    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid MongoDB ObjectId received for 'id': ${id}`);
        return res.status(400).json({ error: "Invalid ID parameter" });
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        console.error(`Invalid MongoDB ObjectId received for 'userId': ${userId}`);
        return res.status(400).json({ error: "Invalid userId parameter" });
    }

    next();
};
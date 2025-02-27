exports.successResponse = (res, data) => res.status(200).json(data);
exports.errorResponse = (res, error, status = 500) => res.status(status).json({ error });
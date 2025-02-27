// Import the Category model to interact with the database
const Category = require('../models/category');

// Create a new category in the database
const createCategory = async (name, promoted) => {
    // Create a new Category instance with the provided name and promoted fields
    const category = new Category({ name, promoted });
    // Save the new category to the database and return the result
    return await category.save();
};

// Retrieve all categories from the database
const getCategories = async () => {
// Use Mongoose's `find` method to fetch all documents in the `Category` collection
    return await Category.find({});
};

// Retrieve a category by its ID
const getCategoryById = async (id) => {
// Use Mongoose's `findById` method to find a category with the specified ID
    return await Category.findById(id);
};

// Update an existing category by its ID
const updateCategory = async (id, name, promoted) => {
    // Fetch the category by its ID
    const category = await getCategoryById(id);
    // If no category is found, return null
    if (!category) return null;
    // Update the `name` field if a new value is provided, otherwise retain the existing value
    category.name = name || category.name;
    // Update the `promoted` field if a new value is provided, otherwise retain the existing value
    category.promoted = promoted !== undefined ? promoted : category.promoted;
    // Save the updated category back to the database
    await category.save();
    // Return the updated category
    return category;
};

// Delete a category by its ID (optimized version)
const deleteCategory = async (id) => {
    // Fetch the category by its ID
    const category = await getCategoryById(id);
    // If no category is found, return null
    if (!category) return null;
    // Use Mongoose's `deleteOne` method to remove the category from the database
    return await Category.deleteOne({ _id: id });
};

// Export the service functions to make them available for use in other files
module.exports = {
    createCategory, // Function to create a new category
    getCategories,  // Function to retrieve all categories
    getCategoryById, // Function to retrieve a category by its ID
    updateCategory, // Function to update an existing category
    deleteCategory, // Function to delete a category by its ID
};
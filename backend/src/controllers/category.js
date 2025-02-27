const categoryService = require('../services/category'); // Import the category service

const createCategory = async (req, res) => {
    try {
        const { name, promoted } = req.body; // Extract fields from the request body

        if (!name) return res.status(400).json({ error: 'Name is required' });
        if (promoted === undefined) return res.status(400).json({ error: 'Promoted is required' });

        const category = await categoryService.createCategory(name, promoted);

        res.status(201).json({
            id: category.id,
            name: category.name,
            promoted: category.promoted
        });
    } catch (error) {
        console.error("Error in createCategory:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        if (!categories || categories.length === 0) {
            return res.status(200).json([]); // Return empty array instead of nothing
        }

        res.status(200).json(categories.map(category => ({
            id: category.id,
            name: category.name,
            promoted: category.promoted
        })));
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid category ID format" });
        }

        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            id: category.id,
            name: category.name,
            promoted: category.promoted
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, promoted } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid category ID format" });
        }

        const category = await categoryService.updateCategory(id, name, promoted);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            id: category.id,
            name: category.name,
            promoted: category.promoted
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid category ID format" });
        }

        const category = await categoryService.deleteCategory(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Export all controller functions
module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};
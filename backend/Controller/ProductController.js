import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const addRating = async (req, res) => {
  const { productId, rating } = req.body;

  console.log('Received productId:', productId);
  console.log('Received rating:', rating);
  console.log('User in request:', req.user); // Add this to see what's in req.user

  // Check if productId and rating are provided
  if (!productId || !rating) {
    return res.status(400).json({ success: false, message: "Product ID and rating are required." });
  }

  // Check if user exists in request
  if (!req.user) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  // Check if user ID exists in the decoded token
  const userId = req.user.id || req.user._id || req.user.userId;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  try {
    // Attempt to find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Add the rating to the product's ratings array using the extracted userId
    product.ratings.push({ user: userId, rating });

    // Recalculate the average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / totalRatings;

    console.log('Average Rating:', averageRating);

    // Update the product's rating and reviews count
    product.rating = averageRating;
    product.reviews = totalRatings;

    await product.save();

    res.status(200).json({ success: true, message: "Rating added successfully", data: product });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a product by ID
// Controller for fetching a product by its ID
// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Generate full URL for the product image
    const fullImageUrl = product.image
    ? `${req.protocol}://${req.get("host")}${product.image}`
    : "";  // If no image, return empty or default image URL
    res.status(200).json({
      ...product._doc,  // Spread the product data to return all fields
      image: fullImageUrl,  // Include full image URL in response
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Error fetching product", error });
  }
};



// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validation for required fields
    if (!name || !price || !image) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create the new product with the image path
    const newProduct = new Product({
      name,
      price,
      stock,
      category,
      description,
      image,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with success
    res.status(201).json({ success: true, message: "Product created", data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  try {
    const productUpdated = await Product.findByIdAndUpdate(id, productData, {
      new: true, // Return the updated document
    });

    if (!productUpdated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: productUpdated });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({}); // This deletes all products
    res.status(200).json({ success: true, message: "All products deleted successfully" });
  } catch (error) {
    console.error("Error deleting all products:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete products" });
  }
};

// Search products by name
export const searchProducts = async (req, res) => {
  const { search } = req.query; // Retrieve the search term from the query

  if (!search) {
    return res.status(400).json({ success: false, message: "Search term is required" });
  }

  try {
    // Search for products where name contains the search term (case-insensitive)
    const products = await Product.find({
      name: { $regex: search, $options: "i" }, // i for case-insensitive search
    });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error searching products:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

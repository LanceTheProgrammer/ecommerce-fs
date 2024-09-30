import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for adding a product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Extract uploaded images from the request
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    // Filter out undefined images
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    // Upload each image to Cloudinary and store the URLs
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        } catch (error) {
          console.log("Cloudinary upload error:", error);
          throw new Error("Image upload failed");
        }
      })
    );

    // Prepare the product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),  // Assuming `sizes` is passed as a JSON string
      images: imagesUrl,         // Save uploaded image URLs in the `images` field
      date: Date.now(),
    };

    console.log(productData);

    // Save the product to the database
    const product = new productModel(productData);
    await product.save();

    // Respond with success
    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function for listing all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function for removing a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function for fetching a single product's info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };

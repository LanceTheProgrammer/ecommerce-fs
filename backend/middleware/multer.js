import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use __dirname to resolve the absolute path to the 'uploads' folder
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, callback) {
    // Generate a unique filename using a timestamp and the original file name
    callback(null, Date.now() + '-' + file.originalname);
  },
});

// Create the upload instance
const upload = multer({
  storage: storage,
});

export default upload;

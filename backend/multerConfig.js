// backend/multerConfig.js
const multer = require('multer');

// Define the storage strategy to store files in memory
const storage = multer.memoryStorage();

// Create the upload middleware instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Accept common image and PDF files
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed!'), false);
        }
    },
});

module.exports = upload;
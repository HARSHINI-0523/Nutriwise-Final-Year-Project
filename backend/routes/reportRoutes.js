// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinaryConfig'); // Cloudinary configuration
const {protect} = require('../middleware/authMiddleware'); // Authentication middleware
const upload = require('../multerConfig'); // Multer middleware
const Report = require('../models/Report'); // Mongoose Report Model

/**
 * @route POST /api/reports/upload
 * @desc Upload a new nutrition report
 * @access Private
 */

router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
       
        const { reportType } = req.body; 
        const userId = req.user.id;

       
        const title = req.file.originalname;

        if (!reportType) {
            return res.status(400).json({ msg: 'Please provide a report type.' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded.' });
        }

        // Convert the file buffer to a Base64 string for Cloudinary upload
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'nutriwise_reports',
            resource_type: 'auto'
        });

        const newReport = new Report({
            title,
            reportType,
            fileURL: result.secure_url,
            uploadedBy: userId,
            cloudinaryPublicId: result.public_id,
        });

        await newReport.save();

        res.status(201).json({ msg: 'Report uploaded successfully', report: newReport });

    } catch (err) {
        console.error('Error uploading report:', err.message);
        // The error might also be a Mongoose validation error.
        res.status(500).json({ msg: 'Server error' });
    }
});
/**
 * @route GET /api/reports/me
 * @desc Get all reports uploaded by the current user
 * @access Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const reports = await Report.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error('Error fetching user reports:', err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route GET /api/reports/:id
 * @desc Get a single report by ID
 * @access Private
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ msg: 'Report not found.' });
        }

        // Ensure only the owner can access the report
        if (report.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied.' });
        }

        res.json(report);
    } catch (err) {
        console.error('Error fetching report:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
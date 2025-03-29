const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// Get all inquiries
router.get('/', inquiryController.getAllInquiries);

// Get single inquiry
router.get('/:id', inquiryController.getInquiry);

// Create new inquiry
router.post('/', inquiryController.createInquiry);

// Update inquiry
router.put('/:id', inquiryController.updateInquiry);

// Update inquiry status
router.patch('/:id/status', inquiryController.updateInquiryStatus);

// Forward inquiry
router.post('/:id/forward', inquiryController.forwardInquiry);

// Delete inquiry
router.delete('/:id', inquiryController.deleteInquiry);

// Role request routes
router.get('/role-requests', inquiryController.getRoleRequests);
router.put('/role-requests/:id/status', inquiryController.updateRoleRequestStatus);

// Reply to inquiry
router.post('/:id/reply', inquiryController.replyToInquiry);

module.exports = router;
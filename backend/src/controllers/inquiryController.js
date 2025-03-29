const Inquiry = require('../models/Inquiry');
const RoleRequest = require('../models/roleRequest');

// Validate phone number
const validatePhoneNumber = (number) => {
  // Remove any non-digit characters
  const digits = number.replace(/\D/g, '');
  
  // Check if it starts with 0
  if (!digits.startsWith('0')) {
    throw new Error('Phone number must start with 0');
  }
  
  // Check if it has exactly 10 digits
  if (digits.length !== 10) {
    throw new Error('Phone number must be exactly 10 digits');
  }
  
  // Check if it contains only integers
  if (!/^\d+$/.test(digits)) {
    throw new Error('Phone number must contain only numbers');
  }
  
  return digits;
};

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single inquiry
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new inquiry
exports.createInquiry = async (req, res) => {
  try {
    // Validate phone number
    const validatedPhone = validatePhoneNumber(req.body.contactNumber);
    req.body.contactNumber = validatedPhone;

    const inquiry = new Inquiry(req.body);
    const newInquiry = await inquiry.save();
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      field: error.message.toLowerCase().includes('phone') ? 'contactNumber' : null
    });
  }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    inquiry.status = req.body.status;
    const updatedInquiry = await inquiry.save();
    res.json(updatedInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update inquiry
exports.updateInquiry = async (req, res) => {
    try {
        const { name, email, contactNumber, subject, message } = req.body;

        // Validate phone number if it's being updated
        if (contactNumber) {
            try {
                validatePhoneNumber(contactNumber);
            } catch (error) {
                return res.status(400).json({ 
                    message: error.message,
                    field: 'contactNumber'
                });
            }
        }

        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                contactNumber,
                subject,
                message,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedInquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(updatedInquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    await inquiry.deleteOne();
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forward inquiry
exports.forwardInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const { forwardTo, role } = req.body;

    // If forwarding to Admin, just save a copy to roleRequest
    if (role === 'Admin') {
      const roleRequest = new RoleRequest({
        inquiryId: inquiry._id,
        originalInquiry: inquiry.toObject()
      });
      await roleRequest.save();
    }

    res.json({ message: 'Inquiry forwarded successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add new controller for handling role requests
exports.getRoleRequests = async (req, res) => {
  try {
    const roleRequests = await RoleRequest.find()
      .populate('inquiryId')
      .sort({ forwardedAt: -1 });
    res.json(roleRequests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateRoleRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const roleRequest = await RoleRequest.findById(id);
    if (!roleRequest) {
      return res.status(404).json({ message: 'Role request not found' });
    }

    roleRequest.status = status;
    roleRequest.adminResponse = adminResponse;
    roleRequest.responseDate = new Date();
    await roleRequest.save();

    // Update the original inquiry status if needed
    const inquiry = await Inquiry.findById(roleRequest.inquiryId);
    if (inquiry) {
      if (status === 'approved') {
        inquiry.status = 'In Progress';
      } else if (status === 'rejected') {
        inquiry.status = 'Rejected';
      }
      await inquiry.save();
    }

    res.json(roleRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.replyToInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        const { message, respondedBy } = req.body;

        // Add reply to the inquiry
        inquiry.replies.push({
            message,
            respondedBy,
            timestamp: new Date()
        });

        // Update status to In Progress if it was Pending
        if (inquiry.status === 'Pending') {
            inquiry.status = 'In Progress';
        }

        await inquiry.save();
        res.json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 
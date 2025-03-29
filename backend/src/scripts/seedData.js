const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');

const dummyInquiries = [
    {
        name: "John Smith",
        subject: "Product Pricing Inquiry",
        email: "john.smith@email.com",
        contactNumber: "0412345678",
        message: "I would like to know more about your product pricing packages.",
        status: "Pending",
        createdAt: new Date('2024-03-20T10:30:00')
    },
    {
        name: "Sarah Johnson",
        subject: "Technical Support",
        email: "sarah.j@email.com",
        contactNumber: "0423456789",
        message: "Having issues with the checkout process.",
        status: "In Progress",
        createdAt: new Date('2024-03-19T15:45:00')
    },
    {
        name: "Michael Brown",
        subject: "Partnership Proposal",
        email: "m.brown@email.com",
        contactNumber: "0434567890",
        message: "Interested in discussing potential business partnership.",
        status: "Resolved",
        createdAt: new Date('2024-03-18T09:15:00')
    },
    {
        name: "Emma Wilson",
        subject: "Refund Request",
        email: "emma.w@email.com",
        contactNumber: "0445678901",
        message: "Would like to request a refund for order #12345.",
        status: "Rejected",
        createdAt: new Date('2024-03-17T14:20:00')
    },
    {
        name: "David Lee",
        subject: "Bulk Order Inquiry",
        email: "david.lee@email.com",
        contactNumber: "0456789012",
        message: "Interested in placing a bulk order for corporate gifts.",
        status: "Pending",
        createdAt: new Date('2024-03-16T11:00:00')
    },
    {
        name: "Lisa Chen",
        subject: "Website Feedback",
        email: "lisa.chen@email.com",
        contactNumber: "0467890123",
        message: "Providing feedback about the new website design.",
        status: "In Progress",
        createdAt: new Date('2024-03-15T16:30:00')
    },
    {
        name: "James Wilson",
        subject: "Delivery Status",
        email: "j.wilson@email.com",
        contactNumber: "0478901234",
        message: "Checking status of order #67890.",
        status: "Resolved",
        createdAt: new Date('2024-03-14T13:45:00')
    },
    {
        name: "Anna Martinez",
        subject: "Product Availability",
        email: "anna.m@email.com",
        contactNumber: "0489012345",
        message: "Inquiring about product stock availability.",
        status: "Pending",
        createdAt: new Date('2024-03-13T10:15:00')
    },
    {
        name: "Robert Taylor",
        subject: "Account Issues",
        email: "r.taylor@email.com",
        contactNumber: "0490123456",
        message: "Unable to access my account.",
        status: "In Progress",
        createdAt: new Date('2024-03-12T09:30:00')
    },
    {
        name: "Sophie Anderson",
        subject: "Custom Order Request",
        email: "sophie.a@email.com",
        contactNumber: "0401234567",
        message: "Interested in customized product options.",
        status: "Pending",
        createdAt: new Date('2024-03-11T14:00:00')
    },
    {
        name: "Daniel Kim",
        subject: "Shipping Query",
        email: "d.kim@email.com",
        contactNumber: "0412345678",
        message: "Need information about international shipping.",
        status: "Resolved",
        createdAt: new Date('2024-03-10T11:20:00')
    },
    {
        name: "Rachel Green",
        subject: "Product Return",
        email: "rachel.g@email.com",
        contactNumber: "0423456789",
        message: "Need to return a damaged product.",
        status: "In Progress",
        createdAt: new Date('2024-03-09T15:30:00')
    },
    {
        name: "Thomas Wright",
        subject: "Payment Issue",
        email: "t.wright@email.com",
        contactNumber: "0434567890",
        message: "Payment transaction failed multiple times.",
        status: "Pending",
        createdAt: new Date('2024-03-08T10:45:00')
    },
    {
        name: "Maria Garcia",
        subject: "Warranty Claim",
        email: "m.garcia@email.com",
        contactNumber: "0445678901",
        message: "Filing a warranty claim for product malfunction.",
        status: "Rejected",
        createdAt: new Date('2024-03-07T13:15:00')
    },
    {
        name: "Kevin Park",
        subject: "Product Specifications",
        email: "k.park@email.com",
        contactNumber: "0456789012",
        message: "Requesting detailed product specifications.",
        status: "Resolved",
        createdAt: new Date('2024-03-06T16:00:00')
    },
    {
        name: "Emily White",
        subject: "Discount Inquiry",
        email: "e.white@email.com",
        contactNumber: "0467890123",
        message: "Asking about available discounts for bulk purchase.",
        status: "Pending",
        createdAt: new Date('2024-03-05T09:45:00')
    },
    {
        name: "Alex Thompson",
        subject: "Technical Issue",
        email: "a.thompson@email.com",
        contactNumber: "0478901234",
        message: "Website is not loading properly on mobile.",
        status: "In Progress",
        createdAt: new Date('2024-03-04T14:30:00')
    },
    {
        name: "Jessica Lee",
        subject: "Order Modification",
        email: "j.lee@email.com",
        contactNumber: "0489012345",
        message: "Need to modify existing order details.",
        status: "Pending",
        createdAt: new Date('2024-03-03T11:00:00')
    },
    {
        name: "William Brown",
        subject: "Feedback Submission",
        email: "w.brown@email.com",
        contactNumber: "0490123456",
        message: "Submitting feedback about customer service.",
        status: "Resolved",
        createdAt: new Date('2024-03-02T15:20:00')
    },
    {
        name: "Olivia Davis",
        subject: "Partnership Query",
        email: "o.davis@email.com",
        contactNumber: "0401234567",
        message: "Interested in retail partnership opportunities.",
        status: "In Progress",
        createdAt: new Date('2024-03-01T10:30:00')
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB Atlas
        const uri = "mongodb+srv://Din3th:kvsokofaWDbCeesv@db01.zxlz5.mongodb.net/DB01";
        await mongoose.connect(uri);

        // Clear existing inquiries
        await Inquiry.deleteMany({});

        // Insert dummy data
        await Inquiry.insertMany(dummyInquiries);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 
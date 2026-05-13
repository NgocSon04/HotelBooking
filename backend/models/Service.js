const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true }, // VD: "1.200.000 VNĐ / Khách"
    operatingHours: { type: String },       // VD: "06:00 - 22:30"
    image: { type: String },
    type: { type: String, enum: ['Ẩm thực', 'Spa', 'Tiện ích', 'Khác'], default: 'Tiện ích' },
    tag: { type: String } // VD: "Michelin Starred"
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
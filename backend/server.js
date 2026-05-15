const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

// Khởi tạo app
const app = express();

// Kết nối Database
connectDB().then(() => {
    // Khởi tạo admin mặc định sau khi đã kết nối DB thành công
    seedAdmin();
});

// Middleware xử lý JSON và CORS
app.use(cors());
app.use(express.json());

// Phục vụ các file tĩnh (ảnh đã upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- KHAI BÁO CÁC ROUTES ---

// 1. Route cho Phòng
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

// 2. Route cho Dịch vụ
const serviceRoutes = require('./routes/serviceRoutes'); 
app.use('/api/services', serviceRoutes);
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/revenue', require('./routes/revenueRoutes'));


// Route cơ bản kiểm tra server
app.get('/', (req, res) => {
    res.send('API Đặt phòng Khách sạn đang hoạt động!');
});




// --- CHẠY SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
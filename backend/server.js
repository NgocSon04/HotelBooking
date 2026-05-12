const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


// Khởi tạo app
const app = express();

// Kết nối Database
connectDB();

// Middleware xử lý JSON và CORS
app.use(cors());
app.use(express.json());

// Định nghĩa Routes cơ bản (sẽ bổ sung thêm file routes sau)
app.get('/', (req, res) => {
    res.send('API Đặt phòng Khách sạn đang hoạt động!');
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});

const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
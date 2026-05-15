const mongoose = require('mongoose');
require('dotenv').config();

const Room = require('./models/Room');
const Service = require('./models/Service');
const Offer = require('./models/Offer');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();
        
        console.log('🔄 Đang xóa dữ liệu cũ...');
        await Room.deleteMany();
        await Service.deleteMany();
        await Offer.deleteMany();
        console.log('✅ Đã xóa dữ liệu cũ');

        // 1. Seed Rooms
        const sampleRooms = [
            {
                roomName: 'Phòng Standard (Tiêu chuẩn)',
                roomType: 'Standard',
                price: 800000,
                images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000'],
                quantity: 10,
                size: 25,
                capacity: 2,
                bedType: '1 giường đôi hoặc 2 giường đơn',
                description: 'Phòng Standard được thiết kế đơn giản, tinh tế nhưng đầy đủ tiện nghi, mang lại không gian ấm cúng và thoải mái cho chuyến đi của bạn.',
                amenities: ['Wifi miễn phí', 'Điều hòa', 'TV truyền hình cáp', 'Phòng tắm riêng', 'Đồ vệ sinh cá nhân'],
                rating: 4.5,
                reviewsCount: 120
            },
            {
                roomName: 'Phòng Deluxe Hướng Biển',
                roomType: 'Deluxe',
                price: 1500000,
                images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000'],
                quantity: 5,
                size: 35,
                capacity: 2,
                bedType: '1 giường King size',
                description: 'Trải nghiệm không gian sang trọng với ban công riêng nhìn thẳng ra biển. Phòng Deluxe là lựa chọn hoàn hảo cho các cặp đôi.',
                amenities: ['Wifi miễn phí', 'Smart TV', 'Ban công view biển', 'Bồn tắm', 'Minibar', 'Máy pha cà phê'],
                rating: 4.8,
                reviewsCount: 350
            },
            {
                roomName: 'Phòng Family Suite',
                roomType: 'Suite',
                price: 3500000,
                images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1000'],
                quantity: 2,
                size: 60,
                capacity: 4,
                bedType: '2 giường King size',
                description: 'Phòng Suite cực rộng rãi với khu vực phòng khách riêng biệt. Thích hợp cho gia đình hoặc nhóm bạn tận hưởng kỳ nghỉ trọn vẹn.',
                amenities: ['Wifi miễn phí', '2 Smart TV', 'Ban công panorama', 'Bồn tắm sục Jacuzzi', 'Bếp nhỏ', 'Sofa phòng khách'],
                rating: 5.0,
                reviewsCount: 85
            }
        ];

        console.log('🔄 Đang thêm dữ liệu Phòng...');
        await Room.insertMany(sampleRooms);
        console.log('✅ Đã thêm dữ liệu Phòng');

        // 2. Seed Services
        const sampleServices = [
            {
                serviceName: 'Buffet Hải Sản Cao Cấp',
                description: 'Thưởng thức buffet hải sản tươi sống đánh bắt trong ngày cùng thực đơn hơn 100 món Á-Âu tại nhà hàng Ocean View.',
                price: '1.200.000 VNĐ / Khách',
                operatingHours: '18:00 - 22:00',
                image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000',
                type: 'Ẩm thực',
                tag: 'Đặc sắc'
            },
            {
                serviceName: 'Zen Spa & Massage',
                description: 'Thư giãn hoàn toàn với liệu pháp massage đá nóng và tinh dầu tự nhiên, đánh thức mọi giác quan sau một ngày dài.',
                price: '850.000 VNĐ / Liệu trình 90p',
                operatingHours: '09:00 - 23:00',
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
                type: 'Spa',
                tag: 'Thư giãn'
            },
            {
                serviceName: 'Dịch vụ Đưa đón Sân Bay',
                description: 'Xe 4-7 chỗ sang trọng đưa đón tận nơi, đảm bảo chuyến đi của bạn luôn đúng giờ và thoải mái nhất.',
                price: '300.000 VNĐ / Lượt',
                operatingHours: '24/7',
                image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000',
                type: 'Tiện ích'
            }
        ];

        console.log('🔄 Đang thêm dữ liệu Dịch vụ...');
        await Service.insertMany(sampleServices);
        console.log('✅ Đã thêm dữ liệu Dịch vụ');

        // 3. Seed Offers
        const sampleOffers = [
            {
                title: 'Combo Kỳ Nghỉ Gia Đình',
                description: 'Nghỉ dưỡng 3 ngày 2 đêm tại Family Suite, tặng kèm vé vào cổng khu vui chơi và miễn phí ăn sáng cho 2 trẻ em.',
                category: 'Gói Combo',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
                priceText: 'Chỉ từ 6.500.000đ',
                tag: 'HOT',
                isActive: true
            },
            {
                title: 'Giảm 20% Cho Khách Hàng Thân Thiết',
                description: 'Nhập mã giảm giá khi thanh toán để được giảm ngay 20% cho tất cả các loại phòng, áp dụng cả lễ tết.',
                category: 'Mã giảm giá',
                promoCode: 'VIP20',
                isActive: true
            },
            {
                title: 'Trăng Mật Lãng Mạn',
                description: 'Set up phòng trăng mật lãng mạn miễn phí, tặng 1 chai rượu vang và bữa tối riêng tư dưới nến dành cho 2 người.',
                category: 'Ưu đãi VIP',
                image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1000',
                tag: 'Lãng mạn',
                isActive: true
            }
        ];

        console.log('🔄 Đang thêm dữ liệu Ưu đãi...');
        await Offer.insertMany(sampleOffers);
        console.log('✅ Đã thêm dữ liệu Ưu đãi');

        console.log('🎉 Seed dữ liệu mẫu thành công!');
        process.exit();

    } catch (error) {
        console.error('❌ Lỗi seed dữ liệu:', error);
        process.exit(1);
    }
};

seedData();

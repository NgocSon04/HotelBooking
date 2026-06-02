const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Room = require('./models/Room');
const Service = require('./models/Service');
const Offer = require('./models/Offer');
const User = require('./models/User');
const Booking = require('./models/Booking');
const ServiceBooking = require('./models/ServiceBooking');
const Setting = require('./models/Setting');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();
        
        console.log('🔄 Đang xóa tất cả dữ liệu cũ...');
        await Room.deleteMany();
        await Service.deleteMany();
        await Offer.deleteMany();
        await User.deleteMany();
        await Booking.deleteMany();
        await ServiceBooking.deleteMany();
        await Setting.deleteMany();
        console.log('✅ Đã dọn sạch cơ sở dữ liệu');

        // --- 1. SEED USERS ---
        console.log('🔄 Đang tạo tài khoản người dùng...');
        const salt = await bcrypt.genSalt(10);
        const hashedPasswordAdmin = await bcrypt.hash('admin123', salt);
        const hashedPasswordNormal = await bcrypt.hash('123456', salt);

        const users = [
            {
                fullName: 'Super Admin',
                email: 'admin123@gmail.com',
                password: hashedPasswordAdmin,
                phone: '0987654321',
                role: 'Admin',
                status: 'Hoạt động',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
            },
            {
                fullName: 'Nguyễn Văn Nhân Viên',
                email: 'staff@gmail.com',
                password: hashedPasswordNormal,
                phone: '0912345678',
                role: 'Staff',
                status: 'Hoạt động',
                avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
            },
            {
                fullName: 'Nguyễn Văn An',
                email: 'client@gmail.com',
                password: hashedPasswordNormal,
                phone: '0901234567',
                role: 'Client',
                status: 'Hoạt động',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
            },
            {
                fullName: 'Trần Thị Sáng',
                email: 'tranthisang@gmail.com',
                password: hashedPasswordNormal,
                phone: '0934567890',
                role: 'Client',
                status: 'Hoạt động',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
            },
            {
                fullName: 'Lê Hoàng Nam',
                email: 'lehoangnam@gmail.com',
                password: hashedPasswordNormal,
                phone: '0945678901',
                role: 'Client',
                status: 'Hoạt động',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
            },
            {
                fullName: 'Phạm Quỳnh Chi',
                email: 'phamquynhchi@gmail.com',
                password: hashedPasswordNormal,
                phone: '0967890123',
                role: 'Client',
                status: 'Hoạt động',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
            },
            {
                fullName: 'Hoàng Minh Đức',
                email: 'hoangminhduc@gmail.com',
                password: hashedPasswordNormal,
                phone: '0978901234',
                role: 'Client',
                status: 'Đã khóa', // Thêm tài khoản bị khóa để kiểm tra UI Admin
                avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200'
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`✅ Đã tạo ${createdUsers.length} tài khoản người dùng.`);

        const client1 = createdUsers.find(u => u.email === 'client@gmail.com');
        const client2 = createdUsers.find(u => u.email === 'tranthisang@gmail.com');
        const client3 = createdUsers.find(u => u.email === 'lehoangnam@gmail.com');
        const client4 = createdUsers.find(u => u.email === 'phamquynhchi@gmail.com');

        // --- 2. SEED ROOMS ---
        console.log('🔄 Đang tạo dữ liệu loại phòng...');
        const roomsData = [
            {
                roomName: 'Phòng Standard Hướng Phố (Standard City View)',
                roomType: 'Standard',
                price: 750000,
                images: [
                    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000',
                    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 15,
                size: 25,
                capacity: 2,
                bedType: '1 Giường Đôi cỡ lớn',
                description: 'Phòng Standard Hướng Phố mang lại trải nghiệm lưu trú tiết kiệm nhưng không kém phần thoải mái với tầm nhìn hướng phố nhộn nhịp, đầy đủ trang thiết bị hiện đại và không gian yên tĩnh.',
                amenities: ['Wifi miễn phí', 'Điều hòa', 'Smart TV', 'Máy sấy tóc', 'Nước uống miễn phí'],
                rating: 4.6,
                reviewsCount: 98
            },
            {
                roomName: 'Phòng Standard Hai Giường Đơn (Standard Twin)',
                roomType: 'Standard',
                price: 850000,
                images: [
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 12,
                size: 28,
                capacity: 2,
                bedType: '2 Giường Đơn',
                description: 'Phòng Standard Twin được bố trí 2 giường đơn êm ái, rất phù hợp cho đồng nghiệp hoặc bạn bè đi du lịch cùng nhau. Phòng trang bị đầy đủ tủ lạnh mini, điều hòa nhiệt độ và bàn làm việc tiện lợi.',
                amenities: ['Wifi miễn phí', 'Điều hòa', 'Smart TV', 'Tủ lạnh mini', 'Két an toàn', 'Bàn làm việc'],
                rating: 4.5,
                reviewsCount: 75
            },
            {
                roomName: 'Phòng Superior Hướng Thành Phố (Superior City)',
                roomType: 'Superior',
                price: 1100000,
                images: [
                    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 10,
                size: 30,
                capacity: 2,
                bedType: '1 Giường Queen',
                description: 'Nằm ở các tầng cao, Superior City Room mang lại không gian tĩnh lặng, nội thất gỗ sang trọng ấm cúng và cửa sổ rộng lớn ngập tràn ánh sáng tự nhiên với view toàn cảnh thành phố.',
                amenities: ['Wifi miễn phí', 'Điều hòa', 'Smart TV', 'Bàn trà nhỏ', 'Áo choàng tắm', 'Minibar', 'Ấm đun nước'],
                rating: 4.7,
                reviewsCount: 142
            },
            {
                roomName: 'Phòng Deluxe Hướng Biển (Deluxe Ocean View)',
                roomType: 'Deluxe',
                price: 1600000,
                images: [
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000',
                    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 8,
                size: 35,
                capacity: 2,
                bedType: '1 Giường King',
                description: 'Thức giấc với tiếng sóng biển rì rào và đón ánh bình minh ngay trên ban công riêng. Deluxe Ocean View sở hữu thiết kế mở hiện đại, bồn tắm nằm cao cấp và minibar đầy ắp tiện ích.',
                amenities: ['Wifi miễn phí', 'Ban công view biển', 'Bồn tắm nằm', 'Smart TV 55 inch', 'Loa Bluetooth', 'Minibar miễn phí ngày đầu'],
                rating: 4.8,
                reviewsCount: 312
            },
            {
                roomName: 'Phòng Deluxe Gia Đình (Deluxe Family Room)',
                roomType: 'Deluxe',
                price: 2200000,
                images: [
                    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 6,
                size: 45,
                capacity: 4,
                bedType: '1 Giường King & 1 Giường Đơn',
                description: 'Được thiết kế đặc biệt cho các gia đình nhỏ có trẻ em. Deluxe Family Room có không gian rộng rãi, góc vui chơi mini cho bé và các tiện nghi thân thiện cho cả gia đình.',
                amenities: ['Wifi miễn phí', 'Điều hòa trung tâm', 'Smart TV lớn', 'Bồn tắm đứng & nằm', 'Đồ chơi trẻ em', 'Sofa Bed'],
                rating: 4.9,
                reviewsCount: 165
            },
            {
                roomName: 'Phòng Executive Suite Sang Trọng',
                roomType: 'Suite',
                price: 3200000,
                images: [
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 4,
                size: 55,
                capacity: 3,
                bedType: '1 Giường Super King',
                description: 'Tận hưởng kỳ nghỉ đẳng cấp hoàng gia với Executive Suite. Căn phòng sở hữu phòng khách độc lập, phòng ngủ sang trọng cùng bồn sục Jacuzzi mang lại sự thư giãn tuyệt đối.',
                amenities: ['Wifi tốc độ cao', 'Phòng khách riêng', 'Bồn sục Jacuzzi', 'Máy pha cà phê Nespresso', 'Đặc quyền Executive Lounge', 'Giặt ủi miễn phí'],
                rating: 4.9,
                reviewsCount: 88
            },
            {
                roomName: 'Phòng Family Suite Hướng Biển',
                roomType: 'Suite',
                price: 4500000,
                images: [
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 3,
                size: 75,
                capacity: 6,
                bedType: '2 Giường King lớn',
                description: 'Căn hộ Suite nghỉ dưỡng lý tưởng cho đại gia đình. Gồm 2 phòng ngủ riêng biệt, phòng khách sinh hoạt chung rộng rãi và ban công panorama nhìn toàn cảnh vịnh biển thơ mộng.',
                amenities: ['Wifi tốc độ cao', '2 phòng ngủ & 2 phòng tắm', 'Bếp ăn hiện đại', 'Ban công lớn view panorama', 'Tủ lạnh side-by-side', 'Loa hát karaoke gia đình'],
                rating: 5.0,
                reviewsCount: 64
            },
            {
                roomName: 'Phòng Tổng Thống (Presidential Suite)',
                roomType: 'Suite',
                price: 12000000,
                images: [
                    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1000',
                    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000'
                ],
                quantity: 1,
                size: 150,
                capacity: 4,
                bedType: '2 Giường King Hoàng Gia',
                description: 'Tuyệt tác của sự sang trọng và đẳng cấp. Presidential Suite nằm ở tầng cao nhất của khách sạn với tầm nhìn 360 độ, nội thất dát vàng, quầy bar cá nhân và dịch vụ quản gia riêng phục vụ 24/7.',
                amenities: ['Quản gia riêng 24/7', 'Thang máy chuyên dụng', 'Quầy bar cá nhân', 'Phòng họp mini', 'Hệ thống âm thanh hi-end', 'Bể bơi mini nước ấm riêng'],
                rating: 5.0,
                reviewsCount: 25
            }
        ];

        const createdRooms = await Room.insertMany(roomsData);
        console.log(`✅ Đã tạo ${createdRooms.length} loại phòng.`);

        // --- 3. SEED SERVICES ---
        console.log('🔄 Đang tạo dữ liệu dịch vụ...');
        const servicesData = [
            {
                serviceName: 'Buffet Hải Sản Ocean View',
                description: 'Thưởng thức hơn 120 món ăn hải sản thượng hạng từ tôm hùm, cua hoàng đế đến các món sashimi tươi ngon trong không gian sang trọng hướng biển.',
                price: '950.000 VNĐ / Khách',
                operatingHours: '18:00 - 22:00',
                image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000',
                type: 'Ẩm thực',
                tag: 'Đặc sắc'
            },
            {
                serviceName: 'Zen Spa & Massage Trị Liệu',
                description: 'Liệu trình massage kết hợp đá nóng núi lửa, tinh dầu thảo dược và bấm huyệt cổ truyền giúp bạn xua tan căng thẳng mệt mỏi.',
                price: '600.000 VNĐ / Liệu trình 60 phút',
                operatingHours: '09:00 - 22:00',
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
                type: 'Spa',
                tag: 'Thư giãn'
            },
            {
                serviceName: 'Sky Bar & Lounge Tầng 25',
                description: 'Nơi lý tưởng để thưởng thức những ly cocktail đặc sắc, lắng nghe nhạc acoustic lãng mạn và ngắm nhìn toàn cảnh thành phố lung linh về đêm.',
                price: '150.000 VNĐ / Đồ uống',
                operatingHours: '17:00 - 01:00',
                image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000',
                type: 'Ẩm thực',
                tag: 'View Đẹp'
            },
            {
                serviceName: 'Dịch Vụ Đưa Đón Sân Bay Cao Cấp',
                description: 'Xe đưa đón chuyên nghiệp đời mới (Sedan/SUV hạng sang) đón tiễn từ sân bay về thẳng khách sạn một cách nhanh chóng và an toàn.',
                price: '350.000 VNĐ / Chiều',
                operatingHours: '24/7',
                image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000',
                type: 'Tiện ích',
                tag: 'Tiện lợi'
            },
            {
                serviceName: 'Bể Bơi Vô Cực Trên Tầng Thượng',
                description: 'Hồ bơi vô cực rộng lớn với làn nước mát lạnh, phục vụ khăn tắm, ghế phơi nắng và quầy bar ngay cạnh hồ bơi.',
                price: 'Miễn phí cho khách lưu trú',
                operatingHours: '06:00 - 21:00',
                image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1000',
                type: 'Tiện ích',
                tag: 'Đặc quyền'
            },
            {
                serviceName: 'Tour Du Thuyền Sông Hàn Về Đêm',
                description: 'Trải nghiệm du thuyền sang trọng chạy trên sông Hàn ngắm nhìn Cầu Rồng phun lửa, cầu quay và thưởng thức bữa tối lãng mạn.',
                price: '500.000 VNĐ / Vé',
                operatingHours: '19:00 - 21:30',
                image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000',
                type: 'Khác',
                tag: 'Khuyên Dùng'
            }
        ];

        const createdServices = await Service.insertMany(servicesData);
        console.log(`✅ Đã tạo ${createdServices.length} dịch vụ.`);

        // --- 4. SEED OFFERS ---
        console.log('🔄 Đang tạo dữ liệu chương trình ưu đãi...');
        const offersData = [
            {
                title: 'Combo Kỳ Nghỉ Hè Rực Rỡ',
                description: 'Nghỉ dưỡng 3 ngày 2 đêm tại Family Suite, tặng kèm vé vào cổng khu vui chơi và miễn phí ăn sáng cho 2 trẻ em.',
                category: 'Gói Combo',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
                priceText: 'Chỉ từ 6.500.000đ',
                tag: 'BÁN CHẠY',
                isActive: true
            },
            {
                title: 'Trăng Mật Lãng Mạn Sweet Love',
                description: 'Set up phòng tân hôn với nến, hoa hồng, tặng 1 chai rượu vang đỏ cao cấp và bữa tối lãng mạn dành cho 2 người bên bể bơi.',
                category: 'Gói Combo',
                image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1000',
                priceText: 'Chỉ từ 4.200.000đ',
                tag: 'LÃNG MẠN',
                isActive: true
            },
            {
                title: 'Giảm 20% Cho Khách Hàng Thân Thiết',
                description: 'Nhập mã giảm giá khi thanh toán để được giảm ngay 20% tiền phòng, áp dụng cho khách hàng đã có tài khoản thành viên.',
                category: 'Mã giảm giá',
                promoCode: 'VIP20',
                discountValue: 20,
                discountType: 'percentage',
                tag: 'ƯU ĐÃI VIP',
                isActive: true
            },
            {
                title: 'Ưu Đãi Chào Mừng Thành Viên Mới',
                description: 'Nhập mã WELCOME100 để được giảm ngay 100.000đ khi đặt phòng lần đầu tại Sơn Quân Hotel.',
                category: 'Mã giảm giá',
                promoCode: 'WELCOME100',
                discountValue: 100000,
                discountType: 'fixed',
                tag: 'QUÀ THÀNH VIÊN',
                isActive: true
            },
            {
                title: 'Deal Cuối Tuần Vui Vẻ',
                description: 'Giảm 10% cho các Booking đặt lưu trú rơi vào Thứ Sáu, Thứ Bảy hoặc Chủ Nhật hàng tuần.',
                category: 'Mã giảm giá',
                promoCode: 'WEEKEND10',
                discountValue: 10,
                discountType: 'percentage',
                tag: 'CUỐI TUẦN',
                isActive: true
            },
            {
                title: 'Flash Sale Giờ Vàng Mùa Hè',
                description: 'Cơ hội đặt phòng Suite với giá giảm cực sốc lên tới 30% khi áp dụng mã giảm giá giới hạn này.',
                category: 'Mã giảm giá',
                promoCode: 'FLASH30',
                discountValue: 30,
                discountType: 'percentage',
                tag: 'SỐ LƯỢNG CÓ HẠN',
                isActive: true
            }
        ];

        const createdOffers = await Offer.insertMany(offersData);
        console.log(`✅ Đã tạo ${createdOffers.length} chương trình ưu đãi.`);

        // --- 5. SEED SETTING ---
        console.log('🔄 Đang tạo thông tin cài đặt hệ thống...');
        const settingData = {
            hotelName: 'Sơn Quân Luxury Hotel',
            slogan: 'Nâng tầm kỳ nghỉ của bạn thành trải nghiệm thượng lưu',
            shortDescription: 'Tọa lạc dọc bờ biển xinh đẹp của Đà Nẵng, Sơn Quân Luxury Hotel mang lại không gian nghỉ dưỡng đỉnh cao kết hợp tinh tế giữa thiết kế tân cổ điển châu Âu và tinh thần hiếu khách Á Đông.',
            email: 'info@sonquanluxuryhotel.com',
            phone: '0386422292',
            address: 'Đại Kim, Hoàng Mai, Hà Nội',
            paymentCash: true,
            paymentBankTransfer: true,
            theme: 'light'
        };

        const createdSetting = await Setting.create(settingData);
        console.log('✅ Đã tạo cài đặt hệ thống mặc định.');

        // --- 6. SEED BOOKINGS (Lịch sử đặt phòng cho biểu đồ doanh thu 7 ngày qua) ---
        console.log('🔄 Đang tạo dữ liệu lịch sử đặt phòng (Bookings)...');
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Hàm tiện ích tạo ngày tương đối so với hôm nay
        const getRelativeDate = (daysAgo, hour = 12) => {
            const d = new Date(startOfToday);
            d.setDate(d.getDate() - daysAgo);
            d.setHours(hour, 0, 0, 0);
            return d;
        };

        // Lấy danh sách phòng để làm mẫu
        const rStd = createdRooms.find(r => r.roomType === 'Standard');
        const rDel = createdRooms.find(r => r.roomType === 'Deluxe');
        const rSui = createdRooms.find(r => r.roomType === 'Suite');

        const rawBookings = [
            // Ngày thứ -6
            {
                bookingCode: '#SQ-2001',
                user: client1._id,
                room: rStd._id,
                checkIn: getRelativeDate(7, 14),
                checkOut: getRelativeDate(5, 12),
                guests: 2,
                totalPrice: rStd.price * 2, // 1.500.000
                status: 'Đã trả phòng',
                paymentMethod: 'Chuyển khoản',
                specialRequest: 'Phòng không hút thuốc',
                createdAt: getRelativeDate(6, 10),
                customerInfo: {
                    firstName: 'Văn An',
                    lastName: 'Nguyễn',
                    email: client1.email,
                    phone: client1.phone
                }
            },
            // Ngày thứ -5
            {
                bookingCode: '#SQ-2002',
                user: client2._id,
                room: rDel._id,
                checkIn: getRelativeDate(6, 14),
                checkOut: getRelativeDate(3, 12),
                guests: 2,
                totalPrice: rDel.price * 3, // 4.800.000
                status: 'Đã trả phòng',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(5, 11),
                customerInfo: {
                    firstName: 'Thị Sáng',
                    lastName: 'Trần',
                    email: client2.email,
                    phone: client2.phone
                }
            },
            // Ngày thứ -4
            {
                bookingCode: '#SQ-2003',
                user: client3._id,
                room: rStd._id,
                checkIn: getRelativeDate(5, 14),
                checkOut: getRelativeDate(3, 12),
                guests: 2,
                totalPrice: rStd.price * 2, // 1.500.000
                status: 'Đã trả phòng',
                paymentMethod: 'Tiền mặt',
                createdAt: getRelativeDate(4, 9),
                customerInfo: {
                    firstName: 'Hoàng Nam',
                    lastName: 'Lê',
                    email: client3.email,
                    phone: client3.phone
                }
            },
            {
                bookingCode: '#SQ-2004',
                user: client4._id,
                room: rSui._id,
                checkIn: getRelativeDate(4, 14),
                checkOut: getRelativeDate(2, 12),
                guests: 4,
                totalPrice: rSui.price * 2, // 6.400.000 hoặc 9.000.000 tùy phòng
                status: 'Đã trả phòng',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(4, 16),
                customerInfo: {
                    firstName: 'Quỳnh Chi',
                    lastName: 'Phạm',
                    email: client4.email,
                    phone: client4.phone
                }
            },
            // Ngày thứ -3
            {
                bookingCode: '#SQ-2005',
                user: client1._id,
                room: rDel._id,
                checkIn: getRelativeDate(3, 14),
                checkOut: getRelativeDate(1, 12),
                guests: 2,
                totalPrice: rDel.price * 2, // 3.200.000
                status: 'Đã trả phòng',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(3, 15),
                customerInfo: {
                    firstName: 'Văn An',
                    lastName: 'Nguyễn',
                    email: client1.email,
                    phone: client1.phone
                }
            },
            {
                bookingCode: '#SQ-2006',
                user: client2._id,
                room: rStd._id,
                checkIn: getRelativeDate(4, 14),
                checkOut: getRelativeDate(3, 12),
                guests: 1,
                totalPrice: rStd.price * 1, // 750.000
                status: 'Đã hủy', // Đơn bị hủy (không được cộng vào doanh thu)
                paymentMethod: 'Tiền mặt',
                createdAt: getRelativeDate(3, 18),
                customerInfo: {
                    firstName: 'Thị Sáng',
                    lastName: 'Trần',
                    email: client2.email,
                    phone: client2.phone
                }
            },
            // Ngày thứ -2
            {
                bookingCode: '#SQ-2007',
                user: client3._id,
                room: rSui._id,
                checkIn: getRelativeDate(2, 14),
                checkOut: getRelativeDate(0, 12), // Trả phòng hôm nay
                guests: 3,
                totalPrice: rSui.price * 2, // 6.400.000
                status: 'Đã trả phòng',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(2, 8),
                customerInfo: {
                    firstName: 'Hoàng Nam',
                    lastName: 'Lê',
                    email: client3.email,
                    phone: client3.phone
                }
            },
            {
                bookingCode: '#SQ-2008',
                user: client4._id,
                room: rStd._id,
                checkIn: getRelativeDate(3, 14),
                checkOut: getRelativeDate(1, 12),
                guests: 2,
                totalPrice: rStd.price * 2, // 1.500.000
                status: 'Đã trả phòng',
                paymentMethod: 'Tiền mặt',
                createdAt: getRelativeDate(2, 14),
                customerInfo: {
                    firstName: 'Quỳnh Chi',
                    lastName: 'Phạm',
                    email: client4.email,
                    phone: client4.phone
                }
            },
            // Ngày thứ -1 (Hôm qua)
            {
                bookingCode: '#SQ-2009',
                user: client1._id,
                room: rDel._id,
                checkIn: getRelativeDate(1, 14),
                checkOut: getRelativeDate(1, 12), // Trả phòng cùng ngày hoặc hôm sau
                guests: 2,
                totalPrice: rDel.price * 1, // 1.600.000
                status: 'Đã trả phòng',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(1, 10),
                customerInfo: {
                    firstName: 'Văn An',
                    lastName: 'Nguyễn',
                    email: client1.email,
                    phone: client1.phone
                }
            },
            {
                bookingCode: '#SQ-2010',
                user: client2._id,
                room: rStd._id,
                checkIn: getRelativeDate(1, 14),
                checkOut: getRelativeDate(-1, 12), // Đang ở, mai checkOut
                guests: 2,
                totalPrice: rStd.price * 2, // 1.500.000
                status: 'Đang lưu trú',
                paymentMethod: 'Tiền mặt',
                createdAt: getRelativeDate(1, 16),
                customerInfo: {
                    firstName: 'Thị Sáng',
                    lastName: 'Trần',
                    email: client2.email,
                    phone: client2.phone
                }
            },
            // Hôm nay (0)
            {
                bookingCode: '#SQ-2011',
                user: client3._id,
                room: rDel._id,
                checkIn: getRelativeDate(0, 14),
                checkOut: getRelativeDate(-2, 12), // Ở 2 ngày
                guests: 2,
                totalPrice: rDel.price * 2, // 3.200.000
                status: 'Đang lưu trú',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(0, 9),
                customerInfo: {
                    firstName: 'Hoàng Nam',
                    lastName: 'Lê',
                    email: client3.email,
                    phone: client3.phone
                }
            },
            {
                bookingCode: '#SQ-2012',
                user: client4._id,
                room: rSui._id,
                checkIn: getRelativeDate(0, 14),
                checkOut: getRelativeDate(-3, 12), // Ở 3 ngày
                guests: 4,
                totalPrice: rSui.price * 3, // 9.600.000
                status: 'Đã xác nhận',
                paymentMethod: 'Chuyển khoản',
                createdAt: getRelativeDate(0, 10),
                customerInfo: {
                    firstName: 'Quỳnh Chi',
                    lastName: 'Phạm',
                    email: client4.email,
                    phone: client4.phone
                }
            },
            {
                bookingCode: '#SQ-2013',
                user: client1._id,
                room: rStd._id,
                checkIn: getRelativeDate(-1, 14), // Ngày mai nhận phòng
                checkOut: getRelativeDate(-3, 12),
                guests: 2,
                totalPrice: rStd.price * 2, // 1.500.000
                status: 'Chờ xác nhận',
                paymentMethod: 'Tiền mặt',
                createdAt: getRelativeDate(0, 11),
                customerInfo: {
                    firstName: 'Văn An',
                    lastName: 'Nguyễn',
                    email: client1.email,
                    phone: client1.phone
                }
            }
        ];

        // Dùng raw collection để bỏ qua sự tự động chỉnh sửa trường createdAt của Mongoose
        await Booking.collection.insertMany(rawBookings);
        console.log(`✅ Đã tạo ${rawBookings.length} lịch sử đặt phòng (Bookings) thành công.`);

        // --- 7. SEED SERVICE BOOKINGS ---
        console.log('🔄 Đang tạo dữ liệu đặt dịch vụ (Service Bookings)...');
        const sSeafood = createdServices.find(s => s.serviceName.includes('Seafood') || s.serviceName.includes('Hải Sản'));
        const sSpa = createdServices.find(s => s.serviceName.includes('Spa'));
        const sCar = createdServices.find(s => s.serviceName.includes('Đưa Đón'));

        const serviceBookingsData = [
            {
                bookingCode: '#SB-2001',
                user: client1._id,
                service: sSeafood._id,
                bookingDate: getRelativeDate(2),
                bookingTime: '19:00',
                guests: 2,
                notes: 'Yêu cầu ngồi bàn gần cửa sổ view biển',
                status: 'Đã xác nhận'
            },
            {
                bookingCode: '#SB-2002',
                user: client2._id,
                service: sSpa._id,
                bookingDate: getRelativeDate(1),
                bookingTime: '10:00',
                guests: 1,
                notes: 'Liệu trình đá nóng trị liệu',
                status: 'Đã xác nhận'
            },
            {
                bookingCode: '#SB-2003',
                user: client3._id,
                service: sCar._id,
                bookingDate: getRelativeDate(0),
                bookingTime: '14:30',
                guests: 3,
                notes: 'Đón tại Ga Đà Nẵng, xe 7 chỗ',
                status: 'Đã xác nhận'
            },
            {
                bookingCode: '#SB-2004',
                user: client4._id,
                service: sSeafood._id,
                bookingDate: getRelativeDate(-1), // Ngày mai
                bookingTime: '18:30',
                guests: 4,
                notes: 'Tổ chức sinh nhật nhỏ cho khách',
                status: 'Chờ xác nhận'
            }
        ];

        await ServiceBooking.insertMany(serviceBookingsData);
        console.log(`✅ Đã tạo ${serviceBookingsData.length} đơn đặt dịch vụ (Service Bookings) thành công.`);

        console.log('🎉 Gieo (seed) dữ liệu mẫu phong phú & đa dạng thành công!');
        process.exit();

    } catch (error) {
        console.error('❌ Lỗi gieo dữ liệu:', error);
        process.exit(1);
    }
};

seedData();

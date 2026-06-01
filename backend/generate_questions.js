const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  UnderlineType, PageBreak
} = require('docx');
const fs = require('fs');

// =================== DỮ LIỆU CÂU HỎI ===================

const sections = [
  {
    title: 'PHẦN I: CÂU HỎI LÝ THUYẾT TỔNG QUAN DỰ ÁN',
    color: '1E3A5F',
    questions: [
      {
        q: '1. Dự án "Sơn Quân Hotel – Hệ thống đặt phòng khách sạn" được xây dựng bằng những công nghệ gì? Hãy mô tả kiến trúc tổng thể.',
        a: `Dự án sử dụng kiến trúc Client-Server tách biệt (Decoupled Architecture):
• Frontend: React.js (Create React App) + Tailwind CSS, chạy tại cổng 3000. Sử dụng React Router v6 để điều hướng trang, Axios để gọi API, React Icons cho biểu tượng, React Toastify để thông báo, Recharts để vẽ biểu đồ.
• Backend: Node.js + Express.js, chạy tại cổng 5000. Sử dụng mô hình MVC (Model-View-Controller).
• Cơ sở dữ liệu: MongoDB với Mongoose ODM.
• Xác thực: JWT (JSON Web Token) + bcryptjs để mã hóa mật khẩu.
• Giao tiếp: RESTful API (JSON).`
      },
      {
        q: '2. Tại sao dự án chọn MongoDB thay vì SQL (MySQL/PostgreSQL)? Ưu và nhược điểm của lựa chọn này?',
        a: `Lý do chọn MongoDB:
• Dữ liệu phòng và đặt phòng có cấu trúc linh hoạt (ảnh, tiện nghi dạng mảng), MongoDB lưu trữ tự nhiên hơn.
• Dễ tích hợp với Node.js thông qua Mongoose.
• Phát triển nhanh, schema linh hoạt (không cần migration).

Ưu điểm: Mảng (images[], amenities[], savedOffers[]) lưu trực tiếp trong document; Horizontal scaling dễ dàng; JSON-native.

Nhược điểm: Không hỗ trợ JOIN native (phải dùng populate); Tính toàn vẹn dữ liệu yếu hơn; Không phù hợp cho báo cáo tài chính phức tạp.`
      },
      {
        q: '3. Giải thích khái niệm RESTful API. Dự án sử dụng các phương thức HTTP nào và ở đâu?',
        a: `RESTful API là kiểu thiết kế API tuân theo nguyên tắc REST:
• GET: Lấy dữ liệu – GET /api/rooms, GET /api/bookings, GET /api/dashboard
• POST: Tạo mới – POST /api/auth/register, POST /api/bookings, POST /api/service-bookings
• PUT/PATCH: Cập nhật – PATCH /api/bookings/:id/status, PUT /api/rooms/:id
• DELETE: Xóa – DELETE /api/rooms/:id, DELETE /api/users/:id

Dự án có 10 nhóm route chính: rooms, services, offers, auth, users, bookings, service-bookings, dashboard, revenue, settings.`
      },
      {
        q: '4. JWT (JSON Web Token) hoạt động như thế nào trong dự án? Vòng đời của token ra sao?',
        a: `Vòng đời JWT trong dự án:
1. Client gửi POST /api/auth/login với email + password.
2. Backend xác thực, nếu đúng tạo token: jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' })
3. Token được trả về cho Frontend, lưu vào localStorage.
4. Mỗi request cần xác thực, Frontend gửi token trong header: Authorization: Bearer <token>
5. Token hết hạn sau 1 ngày, Client cần đăng nhập lại.

Payload token chứa: { id: user._id, role: user.role }. Role được dùng để phân quyền Admin/Staff/Client.`
      },
      {
        q: '5. Dự án phân quyền người dùng như thế nào? Có những vai trò gì?',
        a: `Có 3 vai trò (role) được định nghĩa trong User model:
• Admin: Toàn quyền – quản lý phòng, đặt phòng, người dùng, dịch vụ, ưu đãi, xem doanh thu, cấu hình hệ thống.
• Staff: Quyền quản lý tương tự Admin (tùy cấu hình).
• Client: Xem phòng, đặt phòng, xem lịch sử, lưu ưu đãi, đặt dịch vụ.

Frontend kiểm tra role: Nút "Vào trang Quản lý" chỉ hiển thị khi user.role === 'Admin' || 'Staff'. Route admin được bọc trong <AdminRoute> để bảo vệ. Tài khoản có status 'Đã khóa' bị từ chối đăng nhập.`
      },
      {
        q: '6. Giải thích mô hình MVC được áp dụng trong backend của dự án.',
        a: `Dự án áp dụng MVC trong backend (Node/Express):
• Model (models/): Định nghĩa cấu trúc dữ liệu với Mongoose Schema – User.js, Room.js, Booking.js, Service.js, Offer.js, ServiceBooking.js, Setting.js.
• View: Không có (API thuần JSON, View nằm ở Frontend React).
• Controller (controllers/): Xử lý logic nghiệp vụ – authController, bookingController, roomController, dashboardController, v.v.
• Router (routes/): Ánh xạ URL đến Controller tương ứng.

Luồng: Request → Express Router → Controller → Model → Database → Response (JSON).`
      },
      {
        q: '7. Middleware trong Express.js là gì? Dự án sử dụng những middleware nào?',
        a: `Middleware là các hàm xử lý request/response nằm giữa khi nhận request và trả response.

Dự án sử dụng:
• cors(): Cho phép Frontend (localhost:3000) gọi API Backend (localhost:5000) – Cross-Origin Resource Sharing.
• express.json(): Parse body của request sang JSON.
• express.static('/uploads'): Phục vụ file ảnh đã upload.
• dotenv: Load biến môi trường từ .env (PORT, MONGO_URI, JWT_SECRET).
• Có thể có custom auth middleware để xác thực JWT token trước khi truy cập route bảo vệ.`
      },
      {
        q: '8. React Router v6 hoạt động như thế nào trong dự án? Giải thích cơ chế Nested Routes.',
        a: `React Router v6 dùng component-based routing:
• <BrowserRouter> bọc toàn bộ app.
• <Routes> chứa tất cả các <Route>.
• Nested Routes: Route cha có element là Layout, Route con là các trang cụ thể.

Ví dụ trong dự án:
<Route element={<ClientLayout />}>  ← Layout chứa Header + Footer
  <Route path="/" element={<Home />} />
  <Route path="/rooms" element={<RoomList />} />
  <Route path="/contact" element={<Contact />} />
</Route>

<Route element={<AdminRoute />}>  ← Bảo vệ admin
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="rooms" element={<RoomManagement />} />
  </Route>
</Route>

ClientLayout dùng <Outlet /> để render trang con.`
      },
      {
        q: '9. Axios khác gì với fetch() của JavaScript thuần? Tại sao dự án chọn Axios?',
        a: `So sánh Axios vs fetch():
• Axios tự động parse JSON response; fetch() phải gọi .json() thủ công.
• Axios tự động throw error khi status >= 400; fetch() vẫn resolve dù lỗi HTTP.
• Axios hỗ trợ interceptors (thêm token vào mọi request); fetch() không có sẵn.
• Axios hỗ trợ timeout, cancel request dễ dàng hơn.
• Axios tương thích tốt hơn với các trình duyệt cũ.

Dự án dùng Axios để: Gọi API lấy danh sách phòng, đặt phòng, đăng nhập – đều cần xử lý lỗi nhất quán với toast thông báo.`
      },
      {
        q: '10. Bcrypt.js dùng để làm gì? Tại sao không lưu mật khẩu dạng plain text?',
        a: `bcryptjs dùng để mã hóa mật khẩu một chiều (hashing):
• Khi đăng ký: const salt = await bcrypt.genSalt(10); const hash = await bcrypt.hash(password, salt);
• Khi đăng nhập: const isMatch = await bcrypt.compare(password, user.password);

Tại sao không lưu plain text?
• Nếu database bị tấn công, hacker có ngay mật khẩu gốc của toàn bộ user.
• Người dùng thường dùng cùng 1 mật khẩu cho nhiều dịch vụ → rủi ro lan rộng.
• Bcrypt với salt factor 10 tạo hash độc đáo cho mỗi user dù cùng password, ngăn Rainbow Table attack.`
      }
    ]
  },
  {
    title: 'PHẦN II: CÂU HỎI VỀ CÁC MODULE CHỨC NĂNG',
    color: '1A5276',
    questions: [
      {
        q: '11. Mô tả logic kiểm tra phòng trống khi đặt phòng trong bookingController. Tại sao cần kiểm tra này?',
        a: `Logic kiểm tra phòng trống (Inventory Check):
1. Lấy tổng số phòng của loại đó: roomDoc.quantity (VD: 5 phòng).
2. Tìm các đơn đang hoạt động (không phải "Đã hủy" hay "Đã trả phòng") bị trùng ngày với request:
   checkIn của DB < checkOut mới  VÀ  checkOut của DB > checkIn mới
3. So sánh: if (overlappingBookings.length >= roomDoc.quantity) → Hết phòng!

Ví dụ: Phòng Deluxe có 3 phòng vật lý. Đã có 3 đơn đặt trùng ngày 10-12/07 → Khách thứ 4 đặt cùng khoảng này sẽ bị từ chối.

Điều này đảm bảo không oversell phòng – vấn đề nghiêm trọng trong ngành khách sạn.`
      },
      {
        q: '12. Hệ thống mã đặt phòng (#KH-0001) được tạo ra như thế nào? Có vấn đề gì với cách tiếp cận này không?',
        a: `Logic tạo mã đặt phòng:
1. Tìm booking mới nhất: Booking.findOne().sort({ createdAt: -1 })
2. Tách số từ bookingCode cũ: '#KH-0005' → 5
3. Cộng thêm 1: nextNumber = 5 + 1 = 6
4. Format 4 chữ số: '0006' → bookingCode = '#KH-0006'

Vấn đề tiềm ẩn (Race Condition):
Nếu 2 người đặt phòng cùng lúc, cả 2 query có thể lấy cùng booking cuối và tạo ra 2 mã trùng nhau. 

Giải pháp tốt hơn: Dùng MongoDB Auto-increment plugin hoặc UUID, hoặc dùng atomic operation với findOneAndUpdate().`
      },
      {
        q: '13. Validate dữ liệu được thực hiện ở tầng nào trong dự án? Liệt kê các validate có trong bookingController.',
        a: `Validate dữ liệu tầng Backend (bookingController.js):
• Kiểm tra trường bắt buộc: room, checkIn, checkOut, guests, totalPrice.
• Ngày trả phòng phải sau ngày nhận: checkIn >= checkOut → lỗi.
• Ngày nhận không ở quá khứ: checkIn < hôm nay → lỗi.
• Số khách phải > 0.
• customerInfo đầy đủ: firstName, lastName, email, phone.
• Validate email bằng Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
• Validate số điện thoại Việt Nam: /^(0|84)[3|5|7|8|9][0-9]{8}$/
• Kiểm tra phòng tồn tại và còn chỗ trống.

Tầng Frontend: React form validation cơ bản (required fields), thông báo bằng toast.`
      },
      {
        q: '14. Dashboard Admin lấy dữ liệu thống kê bằng cách nào? Giải thích Aggregation Pipeline trong MongoDB.',
        a: `Dashboard dùng MongoDB Aggregation Pipeline để tính toán:

Ví dụ tính tổng doanh thu:
Booking.aggregate([
  { $match: { status: { $ne: 'Đã hủy' } } },  // Bước 1: Lọc bỏ đơn hủy
  { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }  // Bước 2: Cộng tổng
])

Biểu đồ 7 ngày: Group theo ngày tạo, tính doanh thu từng ngày, sau đó dùng vòng lặp 7 ngày để fill ngày không có doanh thu = 0.

Số phòng trống: Tổng phòng vật lý - số booking đang hoạt động hôm nay.

Aggregation pipeline là chuỗi các stage ($match, $group, $sort, $project) xử lý tuần tự như pipeline trong Linux.`
      },
      {
        q: '15. Tính năng lưu/lấy ưu đãi (Offer) của khách hàng hoạt động như thế nào? Giải thích quan hệ dữ liệu.',
        a: `Quan hệ dữ liệu:
• User model có trường: savedOffers: [{ type: ObjectId, ref: 'Offer' }] – Mảng tham chiếu đến Offer.
• Đây là quan hệ Many-to-Many: Một User có nhiều Offer, một Offer được nhiều User lưu.

Luồng hoạt động:
1. Client bấm "Lưu ưu đãi" → Frontend gọi API PUT /api/users/:id/save-offer.
2. Backend dùng $addToSet để thêm offerId vào savedOffers (tránh duplicate).
3. Khi hiển thị "Ưu đãi của bạn" (/my-offers): GET /api/users/:id/saved-offers, Backend dùng .populate('savedOffers') để lấy thông tin đầy đủ của từng Offer.

Offer có 3 loại: 'Gói Combo', 'Mã giảm giá', 'Ưu đãi VIP'. Mã giảm giá có promoCode để áp dụng khi checkout.`
      },
      {
        q: '16. Tại sao trang Checkout không dùng ClientLayout (không có Header/Footer)? Ý nghĩa thiết kế là gì?',
        a: `Checkout được định nghĩa là route độc lập:
<Route path="/checkout" element={<Checkout />} />   ← Không bọc trong <ClientLayout>

Lý do thiết kế (UX Psychology):
• Giảm "Checkout Abandonment": Loại bỏ mọi yếu tố phân tán (nav, footer, các link) giúp user tập trung hoàn thành thanh toán.
• Tạo "Checkout Tunnel": User chỉ thấy thông tin đặt phòng và form nhập liệu.
• Đây là best practice phổ biến của Amazon, Booking.com, Agoda.

Tương tự, trang Login và Register cũng không dùng ClientLayout.`
      },
      {
        q: '17. Chức năng tìm kiếm và lọc phòng trong RoomList hoạt động thế nào? useMemo có vai trò gì?',
        a: `Tìm kiếm và lọc hoàn toàn phía Frontend (Client-side filtering):
1. Fetch tất cả phòng từ API một lần khi mount component.
2. useMemo() tính toán filteredRooms mỗi khi các dependency thay đổi:
   - Lọc theo từ khóa (tên phòng, mô tả)
   - Lọc theo khoảng giá (min, max)
   - Lọc theo loại phòng (checkbox multi-select)
   - Lọc theo tiện nghi (every() – phải có TẤT CẢ tiện nghi được chọn)
   - Lọc theo rating
   - Sắp xếp (giá thấp/cao/phổ biến nhất)

useMemo() tối ưu hiệu năng: Chỉ tính lại khi input thay đổi, không tính lại mỗi render không liên quan. Với danh sách lớn, điều này quan trọng để tránh lag.`
      },
      {
        q: '18. Giải thích populate() trong Mongoose. Nêu ví dụ cụ thể trong dự án.',
        a: `populate() trong Mongoose tương đương với JOIN trong SQL. Nó thay thế ObjectId reference bằng document thực tế từ collection khác.

Ví dụ trong bookingController:
const bookings = await Booking.find()
  .populate('user', 'fullName phone email')   // Thay user ID → object User
  .populate('room', 'roomName type price')    // Thay room ID → object Room

Kết quả: Thay vì booking.user = "64abc..." → booking.user = { fullName: "Nguyễn A", phone: "..." }

Trong dashboardController:
.populate('user', 'fullName email')  // Cho bảng đặt phòng gần đây

Lưu ý: populate() tốn thêm query đến DB, nên chỉ lấy những field cần thiết (projection).`
      },
      {
        q: '19. Settings (Cấu hình khách sạn) được lưu trữ và sử dụng như thế nào trong dự án?',
        a: `Setting model lưu thông tin cấu hình khách sạn: tên, mô tả, email, điện thoại, địa chỉ, v.v.

Luồng:
• Admin vào trang /admin/settings để cập nhật qua giao diện.
• Backend: GET /api/settings (lấy 1 document duy nhất), PUT /api/settings (cập nhật).
• Frontend (ClientFooter.jsx) gọi GET /api/settings khi mount để hiển thị thông tin động:
  - Tên khách sạn, địa chỉ, email, số điện thoại trong footer.

Tính nhất quán: Thay đổi ở Admin trang Settings sẽ phản ánh ngay trên trang client (Footer) sau khi refresh. Đây là mô hình Single Source of Truth.`
      },
      {
        q: '20. Hệ thống Upload ảnh phòng trong RoomManagement hoạt động như thế nào?',
        a: `Luồng upload ảnh:
1. Admin chọn file ảnh trên form thêm/sửa phòng (input type="file").
2. Frontend tạo FormData và gửi POST /api/rooms (multipart/form-data).
3. Backend dùng multer middleware để nhận và lưu file vào thư mục /backend/uploads/.
4. Đường dẫn file (VD: /uploads/abc123.jpg) được lưu vào trường images[] của Room document.
5. Backend cấu hình: app.use('/uploads', express.static(path.join(__dirname, 'uploads'))).
6. Frontend hiển thị: <img src="http://localhost:5000/uploads/abc123.jpg" />

Dữ liệu: Room.images là mảng string chứa URL/đường dẫn ảnh, hỗ trợ nhiều ảnh cho mỗi phòng.`
      }
    ]
  },
  {
    title: 'PHẦN III: CÂU HỎI MÔ PHỎNG & TÌNH HUỐNG THỰC TẾ',
    color: '145A32',
    questions: [
      {
        q: '21. [MÔ PHỎNG] Một khách hàng muốn đặt phòng Deluxe từ ngày 10/07 đến 12/07. Hãy mô tả toàn bộ luồng dữ liệu từ khi nhấn "Đặt ngay" đến khi hoàn thành.',
        a: `Luồng đặt phòng đầy đủ:
1. Khách hàng vào /rooms → Xem danh sách → Click "Đặt ngay" → Chuyển đến /rooms/details/:id.
2. Tại trang chi tiết: Chọn ngày 10/07 - 12/07, số khách. Click "Tiếp tục đặt phòng".
3. React Router chuyển đến /checkout với state chứa thông tin phòng, ngày, giá.
4. Checkout page: User điền firstName, lastName, email, phone. Chọn phương thức thanh toán. Nhập mã ưu đãi (nếu có).
5. Nhấn "Xác nhận đặt phòng" → Axios POST /api/bookings với payload đầy đủ.
6. Backend validate: Ngày hợp lệ? Phone hợp lệ? Email hợp lệ? Phòng còn chỗ?
7. Nếu pass: Tạo bookingCode '#KH-XXXX', lưu vào DB, trả về 201.
8. Frontend: Toast "Đặt phòng thành công!", chuyển đến trang lịch sử /history.
9. Admin nhận notification (khi vào Dashboard), thấy đơn mới trạng thái "Chờ xác nhận".`
      },
      {
        q: '22. [MÔ PHỎNG] Admin muốn xem doanh thu tháng 6/2025. Điều gì xảy ra phía Backend khi Admin mở trang Revenue?',
        a: `Trang Revenue.jsx gọi API để lấy dữ liệu báo cáo:

1. Frontend mount → Gọi GET /api/revenue với query params (month=6, year=2025).
2. Backend (revenueController.js) dùng MongoDB Aggregation:
   - $match: createdAt trong tháng 6/2025, status != 'Đã hủy'.
   - $group theo ngày hoặc tuần, tính $sum totalPrice.
   - $sort theo ngày tăng dần.
3. Trả về dữ liệu JSON cho Frontend.
4. Frontend dùng Recharts (BarChart/LineChart) để vẽ biểu đồ doanh thu.
5. Hiển thị bảng chi tiết: Tổng doanh thu, số đơn, doanh thu trung bình/ngày, đơn hủy.

Bộ lọc: Admin có thể lọc theo tháng, quý, năm, loại phòng để phân tích chi tiết hơn.`
      },
      {
        q: '23. [MÔ PHỎNG] Điều gì xảy ra nếu Backend đang tắt nhưng User cố truy cập trang Home?',
        a: `Luồng xử lý lỗi mạng:

1. Home.jsx mount → Gọi Axios GET http://localhost:5000/api/rooms.
2. Backend tắt → Network Error / ECONNREFUSED.
3. Axios throw error → catch(error) trong useEffect.
4. console.error("Lỗi tải phòng:", error) – Ghi log lỗi.
5. setLoadingRooms(false) được gọi trong finally block.
6. State featuredRooms = [] (rỗng).
7. UI hiển thị: "Chưa có phòng nào được cập nhật." thay vì loading spinner.

Tương tự cho services: Hiển thị "Chưa có dịch vụ nào."

Điểm cải thiện: Nên thêm error state riêng để hiển thị thông báo thân thiện hơn như "Không thể kết nối máy chủ. Vui lòng thử lại sau." cùng nút Retry.`
      },
      {
        q: '24. [MÔ PHỎNG] Giả sử cần thêm tính năng "Đánh giá phòng" (Review). Bạn sẽ thiết kế schema và API như thế nào?',
        a: `Thiết kế Review System:

Schema (models/Review.js):
const reviewSchema = new Schema({
  room: { type: ObjectId, ref: 'Room', required: true },
  user: { type: ObjectId, ref: 'User', required: true },
  booking: { type: ObjectId, ref: 'Booking', required: true },  // Chỉ đặt phòng xong mới review
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxLength: 500 },
  images: [String]
}, { timestamps: true });

API Routes:
• POST /api/reviews – Tạo review (xác thực: user đã đặt phòng này)
• GET /api/reviews/room/:roomId – Lấy reviews của phòng
• DELETE /api/reviews/:id – Admin xóa review vi phạm

Cập nhật Room model: Tự động cập nhật rating và reviewsCount sau mỗi review mới bằng Post middleware (Mongoose hook).`
      },
      {
        q: '25. [MÔ PHỎNG] Một Admin muốn khóa tài khoản của một khách hàng. Mô tả luồng xử lý.',
        a: `Luồng khóa tài khoản:

1. Admin vào /admin/accounts → Xem danh sách users.
2. Tìm user cần khóa, click nút "Khóa tài khoản".
3. Frontend gọi: PATCH /api/users/:id với body { status: 'Đã khóa' }.
4. Backend (userController): User.findByIdAndUpdate(id, { status }, { new: true }).
5. Trả về user đã update, Frontend cập nhật UI (badge đổi màu đỏ "Đã khóa").

Khi user đó cố đăng nhập:
6. POST /api/auth/login → Backend tìm user.
7. Kiểm tra: if (user.status === 'Đã khóa') → return 403 "Tài khoản của bạn đã bị khóa!"
8. Frontend nhận 403 → Hiển thị toast lỗi, user không thể đăng nhập.

User schema định nghĩa: status enum: ['Hoạt động', 'Đã khóa'], default: 'Hoạt động'.`
      },
      {
        q: '26. [MÔ PHỎNG] Khi Admin thêm một phòng mới, dữ liệu được lưu thế nào? Hãy mô tả document MongoDB sẽ trông như thế nào.',
        a: `Khi Admin thêm phòng Suite mới:

1. RoomManagement.jsx: Admin điền form → Submit → POST /api/rooms (FormData với ảnh).
2. Backend nhận, multer xử lý ảnh, lưu vào /uploads/.
3. roomController tạo document:

{
  "_id": "64abc123...",
  "roomName": "Suite Hướng Biển Tầng 15",
  "roomType": "Suite",
  "price": 5500000,
  "images": ["/uploads/suite-01.jpg", "/uploads/suite-02.jpg"],
  "quantity": 3,
  "size": 85,
  "capacity": 4,
  "bedType": "2 giường King",
  "description": "Phòng Suite sang trọng với tầm nhìn 180 độ ra biển...",
  "amenities": ["Wifi 5G", "Smart TV 65 inch", "Bồn tắm Jacuzzi", "Ban công riêng"],
  "rating": 5.0,
  "reviewsCount": 0,
  "createdAt": "2025-06-01T14:00:00Z",
  "updatedAt": "2025-06-01T14:00:00Z"
}`
      },
      {
        q: '27. [MÔ PHỎNG] Hệ thống ưu đãi và mã giảm giá hoạt động thế nào trong luồng đặt phòng?',
        a: `Luồng áp dụng mã giảm giá:

1. Trang Checkout có ô "Nhập mã ưu đãi".
2. User nhập mã VD: "SUMMER25" → Click "Áp dụng".
3. Frontend gọi GET /api/offers?promoCode=SUMMER25 để kiểm tra.
4. Backend trả về Offer: { discountValue: 25, discountType: 'percentage', isActive: true }
5. Frontend tính toán:
   - Giá gốc: 5.500.000 VNĐ
   - Giảm 25%: -1.375.000 VNĐ
   - Tổng: 4.125.000 VNĐ
6. Khi submit booking: Gửi kèm promoCode: "SUMMER25", discountAmount: 1375000.
7. Backend lưu vào Booking: promoCode, discountAmount để theo dõi.

Offer model: discountType = 'percentage' hoặc 'fixed' (giảm số tiền cố định).`
      },
      {
        q: '28. [MÔ PHỎNG] Nếu website có 10.000 người dùng đặt phòng cùng lúc, hệ thống hiện tại có vấn đề gì? Đề xuất cải thiện.',
        a: `Các vấn đề với tải lớn:

1. Race Condition trong tạo mã booking (#KH-XXXX): Nhiều request cùng đọc lastBooking → Tạo mã trùng.
   Fix: Dùng MongoDB atomic counter hoặc UUID.

2. Race Condition trong kiểm tra phòng trống: Nhiều user cùng đặt phòng cuối cùng → Cả 2 pass nhưng overbook.
   Fix: Dùng MongoDB transaction với session để lock document.

3. Server đơn (Single Point of Failure): Express chạy 1 process.
   Fix: Cluster mode (Node.js cluster), Load Balancer (Nginx), hoặc deploy lên nhiều container (Docker + Kubernetes).

4. N+1 Query Problem: Lấy danh sách booking → populate user và room riêng từng cái.
   Fix: Dùng index trên các trường query thường xuyên (room, status, checkIn).

5. Không có caching: Mỗi request đều query DB.
   Fix: Redis cache cho dữ liệu ít thay đổi (danh sách phòng, services).`
      },
      {
        q: '29. [MÔ PHỎNG] Component ClientHeader có logic gì để hiển thị đúng theo trạng thái đăng nhập?',
        a: `ClientHeader.jsx sử dụng các kỹ thuật React:

State Management:
• const [user, setUser] = useState(null) – Ban đầu không có user.
• useEffect: Khi mount, đọc localStorage.getItem('user') → parse JSON → setUser().

Conditional Rendering:
• Nếu user = null → Hiển thị nút "Đăng nhập" và "Đăng ký".
• Nếu user != null → Hiển thị Avatar + Tên + Dropdown menu (Lịch sử, Ưu đãi, Đăng xuất).

Phân quyền Admin/Staff:
• if (user && (user.role === 'Admin' || user.role === 'Staff')) → Hiển thị nút "Vào trang Quản lý".

Active Link:
• isActive(path): So sánh currentPath với path để thêm class border-b-2 active.

Logout:
• Xóa token và user khỏi localStorage → setUser(null) → navigate('/login').`
      },
      {
        q: '30. [MÔ PHỎNG] Giải thích CORS error và tại sao Backend cần cấu hình CORS cho dự án này.',
        a: `CORS (Cross-Origin Resource Sharing) Error:

Vấn đề: Trình duyệt chặn request từ http://localhost:3000 (React) đến http://localhost:5000 (Express) vì khác port = khác Origin. Đây là Same-Origin Policy của browser.

Lỗi điển hình: "Access to XMLHttpRequest at 'http://localhost:5000/api/rooms' from origin 'http://localhost:3000' has been blocked by CORS policy"

Cấu hình trong server.js:
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true   // Cho phép gửi cookie/auth header
}));

Khi deploy production:
origin phải thay bằng domain thực: ['https://sonquanhotel.vn']

CORS chỉ là cơ chế bảo vệ của browser, không phải bảo mật phía server. Postman/curl vẫn gọi được API dù không có CORS header.`
      }
    ]
  },
  {
    title: 'PHẦN IV: CÂU HỎI NÂNG CAO & BẢO MẬT',
    color: '4A235A',
    questions: [
      {
        q: '31. Các lỗ hổng bảo mật nào có thể tồn tại trong dự án hiện tại? Cách khắc phục?',
        a: `Các lỗ hổng tiềm ẩn:

1. NoSQL Injection: Input không được sanitize có thể inject MongoDB operators.
   Fix: Dùng mongoose-sanitize hoặc express-mongo-sanitize middleware.

2. JWT Secret yếu: Code có fallback 'secretkey' nếu .env thiếu JWT_SECRET.
   Fix: Luôn require JWT_SECRET trong .env, throw error nếu thiếu.

3. Không có Rate Limiting: Brute force mật khẩu không bị chặn.
   Fix: Dùng express-rate-limit cho route /api/auth/login.

4. Password không có độ dài tối thiểu: Có thể đặt password 1 ký tự.
   Fix: Validate password >= 8 ký tự, có chữ hoa và số.

5. File Upload không filter: Có thể upload file .exe, .php.
   Fix: Validate mimetype với multer fileFilter chỉ cho phép image/*.

6. Không có HTTPS: Dữ liệu truyền qua network ở dạng plain text.
   Fix: Cấu hình SSL/TLS khi deploy production.`
      },
      {
        q: '32. Giải thích useState, useEffect, useMemo trong React. Nêu ví dụ cụ thể từng hook trong dự án.',
        a: `Ba React Hooks quan trọng:

useState – Quản lý state nội bộ component:
• RoomList: const [rooms, setRooms] = useState([]); – Lưu danh sách phòng.
• ClientHeader: const [user, setUser] = useState(null); – Trạng thái đăng nhập.
• Home: const [currentBg, setCurrentBg] = useState(0); – Slide ảnh hero.

useEffect – Side effects sau khi render:
• Home: useEffect(() => { fetchRooms(); fetchServices(); }, []); – Fetch khi mount.
• Home: useEffect(() => { setInterval(...) }, []); – Auto-slide hero image.
• ClientHeader: useEffect(() => { localStorage.getItem('user')... }, []); – Đọc localStorage.

useMemo – Cache kết quả tính toán tốn kém:
• RoomList: const filteredRooms = useMemo(() => { ...logic lọc phức tạp... }, [rooms, searchQuery, ...]); – Chỉ tính lại khi dependency thay đổi.`
      },
      {
        q: '33. Tại sao dùng async/await thay vì .then().catch() trong dự án? Sự khác biệt?',
        a: `So sánh async/await vs Promise.then():

Promise.then() (cũ):
axios.get('/api/rooms')
  .then(res => setRooms(res.data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));

async/await (dùng trong dự án):
const fetchRooms = async () => {
  try {
    const response = await axios.get('/api/rooms');
    setRooms(response.data);
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    setLoading(false);
  }
};

Ưu điểm async/await:
• Code đọc như đồng bộ (synchronous), dễ hiểu hơn.
• Tránh "Callback Hell" khi có nhiều async operations liên tiếp.
• try/catch quen thuộc như xử lý lỗi thông thường.
• Dễ debug hơn (stack trace rõ ràng hơn).`
      },
      {
        q: '34. Trang liên hệ (Contact) được thiết kế như thế nào? Phân tích cấu trúc component.',
        a: `Contact.jsx gồm 5 section chính:

1. Hero Banner: Ảnh nền Unsplash, overlay tối, tiêu đề "Liên hệ với chúng tôi".

2. 3 Contact Cards (thiết kế giống ảnh mẫu):
   - Data-driven: Mảng contactCards[] chứa icon, màu, tiêu đề, link.
   - Hotline: FiPhone, màu đỏ, tel:0386422292.
   - Email: FiMail, màu cyan.
   - Trụ sở: FiMapPin, màu vàng – Kim Giang, Hoàng Mai, HN.
   - Hover: shadow-xl, -translate-y-1 transition.

3. Form liên hệ (LEFT):
   - 5 trường: Tên, Phone, Email, Tiêu đề, Nội dung.
   - Validation: name, email, message là bắt buộc.
   - Giả lập gửi 1.5 giây, Toast thành công.

4. Giờ hoạt động (RIGHT):
   - Bảng giờ T2-T7, Chủ nhật, Lễ tân 24/7.

5. Bottom Banner: Kêu gọi hành động, nút gọi điện trực tiếp.`
      },
      {
        q: '35. Làm thế nào để tối ưu hiệu năng trang chủ (Home) có nhiều ảnh từ Unsplash?',
        a: `Các kỹ thuật tối ưu hiện có và có thể thêm:

Đã có:
• Preload hero images: useEffect chạy lần đầu, tạo Image() object để browser cache sẵn.
• Lazy loading: Thẻ <img> mặc định trình duyệt sẽ lazy load ảnh dưới fold.
• URL optimization: Unsplash URL có ?q=70&w=1440&auto=format&fit=crop – Giảm chất lượng và resize.

Có thể cải thiện thêm:
• loading="lazy" attribute: Thêm vào thẻ img không ở viewport đầu tiên.
• WebP format: Thêm &fm=webp vào Unsplash URL để giảm 25-35% kích thước.
• Skeleton loading: Thay spinner bằng skeleton UI đẹp hơn.
• Pagination/Virtual Scroll: Không tải hết 100 phòng cùng lúc.
• Compression: Bật gzip trên Express với compression middleware.
• CDN: Dùng Cloudinary hoặc AWS S3 để lưu ảnh thay vì /uploads local.`
      }
    ]
  }
];

// =================== BUILD DOCUMENT ===================

function buildParagraph(text, options = {}) {
  const { bold = false, color = '000000', size = 24, spacing = 120 } = options;
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        color,
        size,
        font: 'Times New Roman'
      })
    ],
    spacing: { after: spacing }
  });
}

function buildQuestion(q) {
  return new Paragraph({
    children: [
      new TextRun({
        text: q,
        bold: true,
        color: '1A1A1A',
        size: 24,
        font: 'Times New Roman'
      })
    ],
    spacing: { before: 240, after: 120 }
  });
}

function buildAnswer(answer) {
  const lines = answer.split('\n');
  return lines.map(line => new Paragraph({
    children: [
      new TextRun({
        text: line.trim(),
        size: 22,
        color: '333333',
        font: 'Times New Roman'
      })
    ],
    spacing: { after: 80 }
  }));
}

const children = [];

// TIÊU ĐỀ CHÍNH
children.push(new Paragraph({
  children: [
    new TextRun({
      text: 'BỘ CÂU HỎI VẤN ĐÁP',
      bold: true,
      size: 36,
      color: '1E3A5F',
      font: 'Times New Roman'
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 160 }
}));

children.push(new Paragraph({
  children: [
    new TextRun({
      text: 'HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN – SƠN QUÂN HOTEL',
      bold: true,
      size: 30,
      color: '8c6b23',
      font: 'Times New Roman'
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 160 }
}));

children.push(new Paragraph({
  children: [
    new TextRun({
      text: '(Lý thuyết + Mô phỏng thực tế)',
      size: 24,
      italics: true,
      color: '555555',
      font: 'Times New Roman'
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 }
}));

children.push(new Paragraph({
  children: [
    new TextRun({
      text: `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}  |  Tổng số câu hỏi: 35 câu`,
      size: 20,
      color: '777777',
      font: 'Times New Roman'
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 }
}));

// THÔNG TIN DỰ ÁN
children.push(new Paragraph({
  children: [new TextRun({ text: 'THÔNG TIN DỰ ÁN', bold: true, size: 26, color: '1E3A5F', font: 'Times New Roman' })],
  spacing: { after: 160 }
}));

const projectInfo = [
  '• Tên dự án: Sơn Quân Hotel – Hệ thống đặt phòng khách sạn trực tuyến',
  '• Frontend: React.js + Tailwind CSS + React Router v6 + Axios + Recharts',
  '• Backend: Node.js + Express.js (Kiến trúc MVC)',
  '• Cơ sở dữ liệu: MongoDB + Mongoose ODM',
  '• Xác thực: JWT (JSON Web Token) + bcryptjs',
  '• Giao tiếp: RESTful API (10 nhóm endpoint)',
  '• Chức năng: Đặt phòng, Quản lý phòng/dịch vụ/ưu đãi, Dashboard Admin, Báo cáo doanh thu',
  '• Vai trò người dùng: Admin – Staff – Client'
];

projectInfo.forEach(info => {
  children.push(new Paragraph({
    children: [new TextRun({ text: info, size: 22, font: 'Times New Roman', color: '333333' })],
    spacing: { after: 80 }
  }));
});

children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 400 } }));

// CÁC PHẦN CÂU HỎI
sections.forEach((section, sIdx) => {
  // Tiêu đề phần
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: section.title,
        bold: true,
        size: 28,
        color: section.color,
        font: 'Times New Roman'
      })
    ],
    spacing: { before: 480, after: 240 }
  }));

  // Đường kẻ
  children.push(new Paragraph({
    children: [new TextRun({ text: '─'.repeat(80), size: 16, color: 'CCCCCC', font: 'Courier New' })],
    spacing: { after: 240 }
  }));

  section.questions.forEach((qa, qIdx) => {
    // Câu hỏi
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: '▶ ' + qa.q,
          bold: true,
          size: 24,
          color: '1A1A1A',
          font: 'Times New Roman'
        })
      ],
      spacing: { before: 320, after: 160 }
    }));

    // Nhãn Trả lời
    children.push(new Paragraph({
      children: [
        new TextRun({ text: '✔ Trả lời:', bold: true, size: 22, color: section.color, font: 'Times New Roman' })
      ],
      spacing: { after: 80 }
    }));

    // Nội dung trả lời
    const answerLines = qa.a.split('\n');
    answerLines.forEach(line => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: line.trim(), size: 22, color: '333333', font: 'Times New Roman' })
        ],
        spacing: { after: 60 },
        indent: { left: 360 }
      }));
    });

    // Khoảng cách giữa câu hỏi
    children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 200 } }));
  });
});

// GHI CHÚ CUỐI
children.push(new Paragraph({
  children: [new TextRun({ text: '' })],
  spacing: { after: 480 }
}));

children.push(new Paragraph({
  children: [
    new TextRun({ text: 'GHI CHÚ QUAN TRỌNG', bold: true, size: 26, color: 'C0392B', font: 'Times New Roman' })
  ],
  spacing: { after: 160 }
}));

const notes = [
  '1. Bộ câu hỏi này bao gồm 35 câu hỏi chia thành 4 phần: Lý thuyết tổng quan, Module chức năng, Mô phỏng thực tế và Nâng cao bảo mật.',
  '2. Phần III (Câu hỏi mô phỏng) yêu cầu người được hỏi phân tích tình huống cụ thể dựa trên source code thực tế của dự án.',
  '3. Người học nên đọc kỹ từng file source code tương ứng trước khi trả lời: authController.js, bookingController.js, dashboardController.js, Home.jsx, RoomList.jsx, Checkout.jsx, ClientHeader.jsx.',
  '4. Các câu hỏi nâng cao (Phần IV) phù hợp cho vấn đáp cấp độ Khá-Giỏi và thảo luận về cải tiến hệ thống.',
  '5. Thời gian tham khảo: 3-5 phút/câu hỏi lý thuyết, 5-10 phút/câu hỏi mô phỏng.'
];

notes.forEach(note => {
  children.push(new Paragraph({
    children: [new TextRun({ text: note, size: 22, font: 'Times New Roman', color: '555555' })],
    spacing: { after: 120 }
  }));
});

// =================== TẠO VÀ LƯU FILE ===================

const doc = new Document({
  sections: [{ properties: {}, children }]
});

Packer.toBuffer(doc).then(buffer => {
  const outputPath = 'D:/DATASON/data son/VS Code/WEB/BookingHotel/BoCauHoi_SonQuanHotel.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ File DOCX đã được tạo thành công!');
  console.log('📄 Đường dẫn:', outputPath);
  console.log('📊 Tổng số câu hỏi: 35 câu (4 phần)');
}).catch(err => {
  console.error('❌ Lỗi tạo file:', err);
});

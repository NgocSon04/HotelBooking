# 🏨 Sơn Quân Hotel - MERN Stack Booking Platform

Sơn Quân Hotel là một hệ thống đặt phòng khách sạn toàn diện được xây dựng trên nền tảng **MERN Stack** (MongoDB, Express, React, Node.js) kết hợp với giao diện hiện đại từ **Tailwind CSS**. 

Dự án này được thiết kế theo cấu trúc chuẩn của một ứng dụng thực tế, cho phép người dùng (khách hàng) dễ dàng tìm kiếm, lọc và đặt phòng; đồng thời cung cấp cho Quản trị viên (Admin) một hệ thống Dashboard mạnh mẽ để quản lý doanh thu, phòng ốc và cài đặt hệ thống.

---

## 🚀 Tính năng nổi bật

### Dành cho Khách hàng (Client)
- **Giao diện hiện đại & Cao cấp:** Thiết kế sang trọng, tối ưu trải nghiệm UI/UX (Hero slider, hiệu ứng mượt mà).
- **Tìm kiếm & Lọc phòng thông minh:** Lọc phòng theo giá tiền, loại phòng, số sao đánh giá và tiện nghi (Ban công, Bồn tắm...).
- **Quản lý Số lượng (Inventory):** Hệ thống thông minh kiểm tra tình trạng trống của từng loại phòng. Đảm bảo không bao giờ bị "Overbooking" (đặt lố số lượng phòng khách sạn đang có).
- **Trang Thanh toán (Checkout) chuyên nghiệp:** Giao diện đặt phòng độc lập, chia cột rõ ràng, tích hợp Form thông tin và Tóm tắt chi phí (VAT, Phí dịch vụ).

### Dành cho Quản trị viên (Admin Dashboard)
- **Quản lý Phòng:** Thêm, sửa, xoá, cập nhật số lượng phòng và các tiện nghi.
- **Biểu đồ Doanh thu (Recharts):** Trực quan hoá dữ liệu doanh thu, số lượng đơn đặt phòng.
- **Cài đặt Hệ thống (Settings):** Admin có thể thay đổi thông tin liên hệ, logo, tên khách sạn hiển thị dưới Footer mà không cần can thiệp vào Source Code.

---

## 📁 Cấu trúc thư mục (Folder Structure)

Dự án được chia làm 2 phần độc lập: `backend` và `frontend`.

```text
📦 BookingHotel
 ┣ 📂 backend                 # Mã nguồn Server (Node.js & Express)
 ┃ ┣ 📂 config                # Cấu hình kết nối MongoDB
 ┃ ┣ 📂 controllers           # Xử lý logic API (Room, Booking, Setting...)
 ┃ ┣ 📂 models                # Định nghĩa Schema Database (Mongoose)
 ┃ ┣ 📂 routes                # Định nghĩa các Endpoints API
 ┃ ┣ 📜 seedSampleData.js     # Script tạo dữ liệu mẫu (Khách sạn, Phòng, Dịch vụ)
 ┃ ┗ 📜 server.js             # File khởi chạy Server Backend
 ┃
 ┣ 📂 frontend                # Mã nguồn Giao diện (React.js)
 ┃ ┣ 📂 public                # Chứa file index.html và assets tĩnh
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components          # Các Component dùng chung (Header, Footer, Chart...)
 ┃ ┃ ┣ 📂 pages               # Các trang giao diện (Home, RoomList, Checkout...)
 ┃ ┃ ┃ ┣ 📂 admin             # Các trang dành riêng cho Admin (Dashboard, Settings...)
 ┃ ┃ ┣ 📜 App.js              # Định tuyến (Router) chính của ứng dụng
 ┃ ┃ ┗ 📜 index.css           # File cấu hình Tailwind CSS global
 ┃ ┗ 📜 package.json          # Danh sách thư viện Frontend
 ┃
 ┗ 📜 README.md               # Tài liệu hướng dẫn (File bạn đang đọc)
```

---

## 🛠 Hướng dẫn Cài đặt & Khởi chạy (Getting Started)

### Yêu cầu hệ thống
- **Node.js** (Phiên bản 16.x trở lên)
- **MongoDB** (Local hoặc Atlas)

### Bước 1: Khởi chạy Backend
1. Mở Terminal và di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Khởi tạo dữ liệu mẫu (Chỉ chạy 1 lần đầu tiên để có dữ liệu phòng, dịch vụ):
   ```bash
   node seedSampleData.js
   ```
4. Khởi chạy Server (Mặc định chạy ở cổng 5000):
   ```bash
   npm run dev
   ```

### Bước 2: Khởi chạy Frontend
1. Mở một Terminal mới và di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng React (Mặc định chạy ở cổng 3000):
   ```bash
   npm start
   ```

---

## 🌐 Các Đường dẫn quan trọng (Routes)
- **Trang chủ Khách hàng:** `http://localhost:3000/`
- **Trang Danh sách phòng:** `http://localhost:3000/rooms`
- **Đăng nhập:** `http://localhost:3000/login`
- **Trang Quản trị (Admin):** `http://localhost:3000/admin` *(Cần đăng nhập tài khoản có quyền Admin)*

---

## 💡 Mục tiêu của một số file cốt lõi
- `backend/models/Room.js`: Quản lý thông tin Loại phòng. Đặc biệt có trường `quantity` để hệ thống biết loại phòng này có tổng cộng bao nhiêu phòng thực tế.
- `backend/controllers/bookingController.js`: Xử lý thuật toán Đặt phòng. Kiểm tra ngày giờ `checkIn` và `checkOut` xem có bị trùng lịch hay không để tránh tình trạng cháy phòng.
- `frontend/src/pages/Checkout.jsx`: Màn hình thanh toán độc lập được thiết kế chuẩn UI/UX E-Commerce.
- `frontend/src/pages/RoomList.jsx`: Nơi thực hiện các thao tác Lọc và Sắp xếp danh sách phòng trực tiếp (Real-time).

---
*Dự án được xây dựng và tối ưu hoá để mang lại trải nghiệm tốt nhất! Chúc bạn code vui vẻ.*

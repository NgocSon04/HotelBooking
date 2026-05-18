import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import ClientLayout from './components/layouts/ClientLayout';

// Pages
import Login from './pages/Login';
import AdminRoute from './routes/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import Revenue from './pages/admin/Revenue';
import RoomManagement from './pages/admin/RoomManagement';
import Home from './pages/Home';
import RoomList from './pages/RoomList'; 
import RoomDetails from './pages/RoomDetails';
import ServiceManagement from './pages/admin/ServiceManagement';
import Services from './pages/Services';
import Offers from './pages/Offers';
import OfferManagement from './pages/admin/OfferManagement';
import Register from './pages/Register';
import AccountManagement from './pages/admin/AccountManagement';
import BookingManagement from './pages/admin/BookingManagement';
import BookingHistory from './pages/BookingHistory';
import Settings from './pages/admin/Settings';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* ================= ROUTES CHO CLIENT (Khách hàng) ================= */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* Trang danh sách tất cả loại phòng */}
          <Route path="/rooms" element={<RoomList />} />
          
          {/* Trang chi tiết phòng cụ thể */}
          <Route path="/rooms/details/:id" element={<RoomDetails />} />
          
          {/* Bạn có thể thêm các trang Dịch vụ, Liên hệ tại đây */}
          <Route path="/services" element={<Services />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/history" element={<BookingHistory />} />
        </Route>

        {/* Trang Checkout (độc lập, không dùng ClientLayout) */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Trang Đăng nhập/Đăng ký*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ================= ROUTES CHO ADMIN (Quản trị viên) ================= */}
        <Route element={<AdminRoute />}>
          {/* Lưu ý: Đường dẫn admin bắt đầu bằng /admin để tránh trùng với Client */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<RoomManagement />} />
            {/* Thêm các trang Quản lý đặt phòng, Quản lý user tại đây */}
              <Route path="rooms" element={<RoomManagement />} />
              <Route path="services" element={<ServiceManagement />} />
              <Route path="offers" element={<OfferManagement />} /> 
              <Route path="accounts" element={<AccountManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="settings" element={<Settings />} />


          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
const fs = require('fs');

const generateMermaidERD = () => {
    const erdText = `
%% Sơ đồ quan hệ thực thể (ERD) cho CSDL Sơn Quân Hotel %%
erDiagram
    USER ||--o{ BOOKING : "đặt phòng (places)"
    USER ||--o{ SERVICE_BOOKING : "đặt lịch hẹn (reserves)"
    USER }o--o{ OFFER : "lưu mã giảm giá (saves)"
    ROOM ||--o{ BOOKING : "được đặt (contains)"
    SERVICE ||--o{ SERVICE_BOOKING : "được chọn (details)"

    USER {
        ObjectId _id PK
        String fullName "Họ tên"
        String email "Email đăng nhập"
        String password "Mật khẩu (Bcrypt)"
        String phone "Số điện thoại"
        String role "Vai trò (Client / Admin)"
        Array_ObjectId savedOffers FK "Mã giảm giá đã lưu"
    }

    ROOM {
        ObjectId _id PK
        String roomName "Tên phòng"
        String roomType "Loại phòng (Standard/Deluxe/Suite)"
        Number price "Giá phòng / đêm"
        Array_String images "Bộ sưu tập ảnh"
        Number quantity "Tổng số lượng phòng vật lý"
        Number size "Diện tích m2"
        Number capacity "Sức chứa tối đa"
        String bedType "Loại giường"
        String description "Mô tả chi tiết"
        Array_String amenities "Tiện ích (Wifi, Tivi,...)"
        Number rating "Điểm đánh giá"
        Number reviewsCount "Số lượt review"
    }

    BOOKING {
        ObjectId _id PK
        String bookingCode UK "Mã đặt phòng dạng #KH-xxxx"
        ObjectId user FK "Khách hàng thực hiện đặt"
        ObjectId room FK "Loại phòng được đặt"
        Date checkIn "Ngày nhận phòng"
        Date checkOut "Ngày trả phòng"
        Number guests "Số lượng khách"
        Number totalPrice "Tổng tiền thanh toán sau giảm"
        String status "Trạng thái đơn (Chờ/Duyệt/Hủy...)"
        String paymentMethod "Phương thức thanh toán"
        String specialRequest "Yêu cầu đặc biệt"
        String promoCode "Mã giảm giá đã dùng (Snapshot)"
        Number discountAmount "Số tiền được giảm (Snapshot)"
        Object customerInfo "Họ tên, SĐT, Email liên hệ"
    }

    SERVICE {
        ObjectId _id PK
        String serviceName "Tên dịch vụ (Gym, Spa, Buffet)"
        String description "Mô tả dịch vụ"
        String price "Đơn giá"
        String operatingHours "Giờ hoạt động"
        String image "Ảnh minh họa"
        String type "Phân loại (Spa/Ẩm thực/Tiện ích)"
        String tag "Nhãn nổi bật"
    }

    SERVICE_BOOKING {
        ObjectId _id PK
        String bookingCode UK "Mã đơn dịch vụ dạng #SB-xxxx"
        ObjectId user FK "Khách hàng đặt lịch"
        ObjectId service FK "Dịch vụ được chọn"
        Date bookingDate "Ngày hẹn dịch vụ"
        String bookingTime "Giờ hẹn dịch vụ"
        Number guests "Số khách tham gia"
        String notes "Yêu cầu đặc biệt"
        String status "Trạng thái duyệt (Chờ/Duyệt/Hủy)"
    }

    OFFER {
        ObjectId _id PK
        String title "Tiêu đề ưu đãi"
        String description "Mô tả ưu đãi"
        String category "Phân loại (Gói/Mã giảm giá/Ưu đãi VIP)"
        String image "Ảnh combo"
        String promoCode "Mã code áp dụng"
        Number discountValue "Giá trị giảm"
        String discountType "Kiểu giảm (percentage / fixed)"
        String priceText "Giá bán gói combo"
        String tag "Nhãn nổi bật"
        Boolean isActive "Trạng thái hoạt động"
    }
`;

    console.log("=== SAO CHÉP MÃ MERMAID DƯỚI ĐÂY ĐỂ XUẤT SƠ ĐỒ ERD ===");
    console.log(erdText);
    console.log("======================================================");
    console.log("Mẹo: Dán mã này vào trang https://mermaid.live để xuất ảnh sơ đồ dạng PNG/SVG.");
};

generateMermaidERD();

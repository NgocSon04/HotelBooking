const Setting = require('../models/Setting');

// Lấy thông tin cài đặt (chỉ có 1 document duy nhất)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            // Nếu chưa có cài đặt nào, tạo mặc định
            settings = await Setting.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin cài đặt', error: error.message });
    }
};

// Cập nhật cài đặt
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        
        if (settings) {
            // Cập nhật nếu đã có
            settings = await Setting.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        } else {
            // Tạo mới nếu chưa có
            settings = await Setting.create(req.body);
        }
        
        res.status(200).json({ message: 'Cập nhật cài đặt thành công', settings });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật cài đặt', error: error.message });
    }
};

const Service = require('../models/Service');

// [GET] Lấy danh sách
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// [POST] Tạo mới
exports.createService = async (req, res) => {
    try {
        const { serviceName, description, price, operatingHours, type, tag } = req.body;
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
        const newService = new Service({ serviceName, description, price, operatingHours, type, tag, image });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi tạo" });
    }
};

// [PUT] Cập nhật (ĐÂY LÀ DÒNG GÂY LỖI NẾU THIẾU)
exports.updateService = async (req, res) => {
    try {
        const { serviceName, description, price, operatingHours, type, tag } = req.body;
        let updateData = { serviceName, description, price, operatingHours, type, tag };
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật" });
    }
};

// [DELETE] Xóa
exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa" });
    }
};
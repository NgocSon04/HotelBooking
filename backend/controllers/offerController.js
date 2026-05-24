const Offer = require('../models/Offer');

// [GET] Lấy tất cả ưu đãi cho Admin (Kể cả bị ẩn)
exports.getAllOffersAdmin = async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải danh sách ưu đãi" });
    }
};

// [GET] Lấy ưu đãi cho Client (Chỉ lấy cái đang Active)
exports.getAllOffersClient = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải danh sách ưu đãi" });
    }
};

// [POST] Thêm ưu đãi mới
exports.createOffer = async (req, res) => {
    try {
        const { title, description, category, promoCode, discountValue, discountType, priceText, tag, isActive } = req.body;
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
        
        const newOffer = new Offer({ 
            title, description, category, promoCode, discountValue, discountType, priceText, tag, isActive, image 
        });
        await newOffer.save();
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi tạo ưu đãi", error });
    }
};

// [PUT] Cập nhật ưu đãi
exports.updateOffer = async (req, res) => {
    try {
        const { title, description, category, promoCode, discountValue, discountType, priceText, tag, isActive } = req.body;
        let updateData = { title, description, category, promoCode, discountValue, discountType, priceText, tag, isActive };
        
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi cập nhật ưu đãi" });
    }
};

// [DELETE] Xóa ưu đãi
exports.deleteOffer = async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa ưu đãi thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa ưu đãi" });
    }
};

// [POST] Xác thực mã giảm giá
exports.verifyPromoCode = async (req, res) => {
    try {
        const { promoCode } = req.body;
        if (!promoCode) {
            return res.status(400).json({ message: "Vui lòng cung cấp mã giảm giá!" });
        }

        const offer = await Offer.findOne({
            category: 'Mã giảm giá',
            promoCode: promoCode.trim().toUpperCase(),
            isActive: true
        });

        if (!offer) {
            return res.status(404).json({ message: "Mã giảm giá không tồn tại hoặc đã hết hạn!" });
        }

        res.status(200).json({
            message: "Xác thực mã giảm giá thành công!",
            promoCode: offer.promoCode,
            discountValue: offer.discountValue,
            discountType: offer.discountType,
            title: offer.title
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xác thực mã giảm giá", error });
    }
};
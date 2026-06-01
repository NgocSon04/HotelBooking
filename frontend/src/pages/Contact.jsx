import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend, FiUser, FiMessageSquare, FiClock } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setSending(true);
    // Giả lập gửi form
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('🎉 Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất có thể.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  const contactCards = [
    {
      icon: <FiPhone size={24} className="text-[#e53935]" />,
      iconBg: 'bg-red-50',
      title: 'Hotline',
      subtitle: 'Hỗ trợ khách hàng 24/7',
      info: '0386422292',
      link: 'tel:0386422292',
      accentColor: 'text-[#e53935]'
    },
    {
      icon: <FiMail size={24} className="text-[#0097a7]" />,
      iconBg: 'bg-cyan-50',
      title: 'Email',
      subtitle: 'Gửi phản hồi cho chúng tôi',
      info: 'sonquanhotel@gmail.com',
      link: 'mailto:sonQquanhotel@gmail.com',
      accentColor: 'text-[#e53935]'
    },
    {
      icon: <FiMapPin size={24} className="text-[#f59e0b]" />,
      iconBg: 'bg-amber-50',
      title: 'Trụ sở chính',
      subtitle: 'Trung tâm điều hành',
      info: 'Kim Giang, Đại Kim, Hoàng Mai, Hà Nội',
      link: 'https://maps.google.com/?q=Kim+Giang,+Đại+Kim,+Hoàng+Mai,+Hà+Nội',
      accentColor: 'text-[#e53935]'
    }
  ];

  return (
    <div className="bg-white font-sans">
      {/* ================= HERO SECTION ================= */}
      <div
        className="relative h-[420px] bg-cover bg-center flex flex-col justify-center items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2000&auto=format&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-[#0b142f]/65" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <p className="text-sm font-semibold tracking-[4px] uppercase text-[#f0c060] mb-3">
            Liên hệ
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-base md:text-lg font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp và giải đáp mọi thắc mắc của bạn.
            Hãy để Sơn Quân Hotel phục vụ bạn tốt hơn mỗi ngày.
          </p>
        </div>
      </div>

      {/* ================= 3 CONTACT CARDS ================= */}
      <div className="max-w-6xl mx-auto px-4 -mt-14 relative z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, idx) => (
            <a
              key={idx}
              href={card.link}
              target={card.title === 'Trụ sở chính' ? '_blank' : '_self'}
              rel="noreferrer"
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>

              {/* Title + Subtitle */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>

              {/* Contact Info */}
              <p className={`text-sm font-bold ${card.accentColor} leading-relaxed`}>
                {card.info}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* ================= MAIN CONTENT: FORM + MAP ================= */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT: CONTACT FORM */}
          <div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-[#e53935] mb-2">
              Gửi tin nhắn
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Để lại lời nhắn cho chúng tôi
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Họ và tên *"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-[#8c6b23] focus:ring-2 focus:ring-[#8c6b23]/20 transition placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-[#8c6b23] focus:ring-2 focus:ring-[#8c6b23]/20 transition placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Địa chỉ email *"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-[#8c6b23] focus:ring-2 focus:ring-[#8c6b23]/20 transition placeholder-gray-400"
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <FiMessageSquare className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Tiêu đề"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-[#8c6b23] focus:ring-2 focus:ring-[#8c6b23]/20 transition placeholder-gray-400"
                />
              </div>

              {/* Message */}
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Nội dung tin nhắn của bạn (tin nhắn mẫu)*"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-[#8c6b23] focus:ring-2 focus:ring-[#8c6b23]/20 transition placeholder-gray-400 resize-none"
              />

              {/* Submit */}
              <button
                id="contact-submit"
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-[#8c6b23]/30"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Gửi tin nhắn
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: INFO + MAP */}
          <div className="flex flex-col gap-8">
            {/* Operating Hours */}
            <div className="bg-[#f9fafb] rounded-2xl p-7 border border-gray-100">
              <p className="text-xs font-bold tracking-[3px] uppercase text-[#e53935] mb-2">
                Giờ hoạt động
              </p>
              <h3 className="text-xl font-extrabold text-gray-900 mb-5">
                Chúng tôi làm việc khi nào?
              </h3>
              <div className="space-y-3">
                {[
                  { day: 'Thứ 2 - Thứ 6', hours: '07:00 - 22:00', active: true },
                  { day: 'Thứ 7', hours: '08:00 - 21:00', active: true },
                  { day: 'Chủ nhật', hours: '09:00 - 18:00', active: false },
                  { day: 'Bộ phận lễ tân', hours: '24/7 (Không nghỉ)', active: true }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <FiClock size={14} className={item.active ? 'text-[#8c6b23]' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${item.active ? 'text-gray-700' : 'text-gray-400'}`}>
                        {item.day}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${item.active ? 'text-[#8c6b23]' : 'text-gray-400'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Map Embed
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex-1 min-h-[250px]">
              <iframe
                title="Sơn Quân Hotel Location"
                className="w-full h-full min-h-[250px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.3186059956226!2d105.83073737484434!3d20.97427688065694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acf8bfec9fcf%3A0x2e57f75a32e80700!2sKim%20Giang%2C%20Ho%C3%A0ng%20Mai%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2s!4v1716000000000!5m2!1svi!2s"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BANNER ================= */}
      <div className="bg-[#0b142f] py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Bạn cần hỗ trợ khẩn cấp?
          </h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
            Đội ngũ lễ tân của chúng tôi luôn trực 24/7 để hỗ trợ bạn bất kỳ lúc nào.
          </p>
          <a
            href="tel:0386422292"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-[#8c6b23]/30"
          >
            <FiPhone size={18} />
            Gọi ngay: 038642292
          </a>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={4000} />
    </div>
  );
};

export default Contact;

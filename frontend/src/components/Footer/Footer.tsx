import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Send,
  ExternalLink,
  Music,
} from 'lucide-react';

const CONTACT = {
  company: 'Công ty Cổ phần ZestyDash Việt Nam',
  hotline: '1900 1234',
  hours: '07:00 – 23:00 hàng ngày',
  email: 'support@zestydash.vn',
  address: 'Tòa nhà Zesty, 122, Hoàng Quốc Việt, TP. Hà Nội',
};

const QUICK_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thực đơn món ngon', href: '/#' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
  { label: 'Hướng dẫn đặt hàng', href: '/guide' },
];

const POLICY_LINKS = [
  { label: 'Chính sách bảo mật', href: '/privacy' },
  { label: 'Điều khoản dịch vụ', href: '/terms' },
  { label: 'Chính sách hoàn tiền', href: '/refund' },
  { label: 'Chính sách giao hàng', href: '/shipping' },
];

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/zestydash',
    icon: <Facebook size={18} />,
    color: 'hover:text-blue-400',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/zestydash',
    icon: <Instagram size={18} />,
    color: 'hover:text-pink-400',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@zestydash',
    icon: <Music size={18} />,
    color: 'hover:text-white',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@zestydash',
    icon: <Youtube size={18} />,
    color: 'hover:text-red-400',
  },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
      <span
        className="inline-block w-5 h-0.5 bg-[#EB5E28] rounded-full"
        aria-hidden="true"
      />
      {children}
    </h4>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        className="group flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors duration-150"
      >
        <ExternalLink
          size={11}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          aria-hidden="true"
        />
        {children}
      </a>
    </li>
  );
}

function NewsletterRow() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ, vui lòng kiểm tra lại.');
      return;
    }
    setError('');
    setSubmitted(true);
    setEmail('');
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] px-8 py-8 my-10">
      <div
        className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#EB5E28]/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="shrink-0 max-w-sm">
          <p className="font-display font-bold text-white text-lg leading-snug mb-1">
            Đăng ký nhận tin khuyến mãi
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            Nhập email của bạn để không bỏ lỡ những ưu đãi hot nhất từ
            ZestyDash.
          </p>
        </div>

        <div className="w-full md:max-w-md">
          {submitted ? (
            <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/25 rounded-xl px-4 py-3">
              <span className="text-emerald-400 text-xl" aria-hidden="true">
                ✓
              </span>
              <p className="text-sm text-emerald-300 font-semibold">
                Đăng ký thành công! Cảm ơn bạn đã theo dõi ZestyDash.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Nhập email của bạn..."
                    aria-label="Email đăng ký nhận tin"
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.07] border text-sm text-white placeholder:text-white/35 outline-none focus:bg-white/[0.1] transition-all ${
                      error
                        ? 'border-red-500/60 focus:border-red-400'
                        : 'border-white/10 focus:border-[#EB5E28]'
                    }`}
                  />
                  {error && (
                    <p className="text-xs text-red-400 mt-1.5 pl-1">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EB5E28] text-white font-bold text-sm hover:bg-[#d44e1e] active:scale-95 transition-all whitespace-nowrap"
                >
                  <Send size={14} aria-hidden="true" />
                  Đăng ký
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      className="bg-[#252422] text-white/55 pt-14 pb-6 px-6"
      role="contentinfo"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Brand bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/[0.08] mb-10">
          <a
            href="/"
            className="flex items-center gap-1.5 font-display font-extrabold text-2xl tracking-tight text-white select-none"
            aria-label="ZestyDash – Trang chủ"
          >
            ZestyDash
            <span
              className="inline-block w-2.5 h-2.5 rounded-full bg-[#EB5E28] mb-0.5"
              aria-hidden="true"
            />
          </a>
          <p className="text-sm text-white/40 max-w-sm leading-relaxed">
            Nền tảng giao đồ ăn hàng đầu Việt Nam — kết nối bạn với hàng trăm
            nhà hàng chất lượng trong vài phút.
          </p>
        </div>

        {/* Newsletter */}
        <NewsletterRow />

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/[0.08]">
          {/* Column 1 — Contact */}
          <div>
            <ColumnHeading>Thông tin liên hệ</ColumnHeading>
            <ul className="space-y-4">
              <li className="text-sm text-white/70 font-semibold leading-snug">
                {CONTACT.company}
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  size={15}
                  className="text-[#EB5E28] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <a
                    href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}
                    className="text-sm text-white font-bold hover:text-[#EB5E28] transition-colors"
                  >
                    {CONTACT.hotline}
                  </a>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock
                      size={11}
                      className="text-white/35"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-white/40">
                      {CONTACT.hours}
                    </span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  size={15}
                  className="text-[#EB5E28] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-white/55 hover:text-white transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={15}
                  className="text-[#EB5E28] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-white/55 leading-relaxed">
                  {CONTACT.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <ColumnHeading>Liên kết nhanh</ColumnHeading>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 3 — Policies */}
          <div>
            <ColumnHeading>Chính sách</ColumnHeading>
            <ul className="space-y-3">
              {POLICY_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 4 — Social media */}
          <div>
            <ColumnHeading>Mạng xã hội</ColumnHeading>
            <div className="flex items-center gap-3 mb-6">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-xl border border-white/10 bg-white/[0.05] flex items-center justify-center text-white/55 transition-all duration-150 hover:border-white/20 hover:bg-white/[0.1] ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Download app */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4">
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">
                Tải ứng dụng
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: '🍎  App Store', href: '#' },
                  { label: '🤖  Google Play', href: '#' },
                ].map((app) => (
                  <a
                    key={app.label}
                    href={app.href}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.05] text-xs font-semibold text-white/60 hover:bg-white/[0.1] hover:text-white transition-all"
                  >
                    {app.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 text-xs text-white/35">
          <p>
            © 2026 ZestyDash Company. All rights reserved. Thiết kế bởi{' '}
            <a
              href="#"
              className="text-[#EB5E28] hover:underline transition-colors"
            >
              ZestyDash Team
            </a>
            .
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              Bảo mật
            </a>
            <span className="text-white/20" aria-hidden="true">
              |
            </span>
            <a href="/terms" className="hover:text-white/70 transition-colors">
              Điều khoản
            </a>
            <span className="text-white/20" aria-hidden="true">
              |
            </span>
            <a
              href="/sitemap"
              className="hover:text-white/70 transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

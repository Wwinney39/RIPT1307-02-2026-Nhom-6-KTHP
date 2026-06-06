import { useState } from 'react';
import {
  HERO_CHIP_TEXT,
  HERO_TITLE_LINE_1,
  HERO_TITLE_LINE_2,
  HERO_SUBTITLE,
  HERO_SEARCH_PLACEHOLDER,
  HERO_SEARCH_BTN,
} from '../../constants';
import { LocationIcon } from '../common/Icons';
import useToast from '../../hooks/useToast';

export function Hero() {
  const [address, setAddress] = useState('');
  const { showToast } = useToast();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (address.trim()) {
      showToast(`Đang tìm kiếm: <strong>${address}</strong>`);
    } else {
      showToast('Vui lòng nhập địa chỉ giao hàng.');
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-[#252422] px-6 py-24 text-center"
      aria-label="Banner chính"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#EB5E28] opacity-[0.07]" />
        <div className="absolute -bottom-32 -left-16 w-[340px] h-[340px] rounded-full bg-[#EB5E28] opacity-[0.06]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Status chip */}
        <div
          className="inline-flex items-center gap-2 rounded-full border border-orange-400/30
                     bg-orange-500/15 px-4 py-1.5 text-xs font-semibold tracking-wide
                     text-orange-300 mb-6 animate-fade-up"
          role="status"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#EB5E28] animate-pulse"
            aria-hidden="true"
          />
          {HERO_CHIP_TEXT}
        </div>

        <h1
          className="font-display font-extrabold text-white tracking-tight leading-[1.1]
                     mb-5 text-4xl sm:text-5xl lg:text-6xl animate-fade-up [animation-delay:100ms]"
        >
          {HERO_TITLE_LINE_1}
          <br />
          <span className="text-[#EB5E28]">{HERO_TITLE_LINE_2}</span>
        </h1>

        <p
          className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-10
                     animate-fade-up [animation-delay:200ms]"
        >
          {HERO_SUBTITLE}
        </p>

        <form
          onSubmit={handleSearch}
          className="flex max-w-xl mx-auto rounded-full overflow-hidden bg-white
                     shadow-[0_20px_60px_rgba(0,0,0,0.28)] border-2 border-white/10
                     animate-fade-up [animation-delay:300ms]"
          role="search"
          aria-label="Tìm kiếm địa chỉ giao hàng"
        >
          <LocationIcon
            size={18}
            className="shrink-0 self-center ml-5 text-[#7A7570]"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={HERO_SEARCH_PLACEHOLDER}
            className="flex-1 px-3 py-4 text-[#252422] text-sm sm:text-base
                       placeholder:text-[#7A7570] outline-none bg-transparent"
            aria-label="Địa chỉ giao hàng"
          />
          <button
            type="submit"
            className="m-1.5 px-6 rounded-full bg-[#EB5E28] text-white font-bold
                       text-sm sm:text-base hover:bg-[#d44e1e] active:scale-95
                       transition-all whitespace-nowrap"
          >
            {HERO_SEARCH_BTN}
          </button>
        </form>
      </div>
    </section>
  );
}

import { ArrowRightIcon } from './Icons';

interface SectionHeaderProps {
  title: string;
  viewAllLabel?: string;
  onViewAll?: () => void;
}

export function SectionHeader({
  title,
  viewAllLabel,
  onViewAll,
}: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-8">
      <h2 className="font-display font-bold text-2xl tracking-tight text-[#252422]">
        {title}
      </h2>
      {viewAllLabel && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-semibold text-[#EB5E28]
                     hover:underline whitespace-nowrap"
        >
          {viewAllLabel}
          <ArrowRightIcon size={13} />
        </button>
      )}
    </div>
  );
}

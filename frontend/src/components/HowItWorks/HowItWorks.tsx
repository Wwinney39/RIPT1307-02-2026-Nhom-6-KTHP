import { HOW_IT_WORKS_TITLE, HOW_IT_WORKS_STEPS } from '../../constants';
import { SectionHeader } from '../common/SectionHeader';

export function HowItWorks() {
  return (
    <section
      className="bg-[#FFFBF7] py-14 px-6"
      aria-label="Cách thức hoạt động"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader title={HOW_IT_WORKS_TITLE} />

        <div className="grid gap-5 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative bg-white border border-black/[0.07] rounded-2xl
                         p-7 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div
                className="font-display font-extrabold text-5xl text-[#EB5E28]/10
                           leading-none mb-2 select-none"
                aria-hidden="true"
              >
                0{step.step}
              </div>

              <div
                className="w-11 h-11 rounded-xl bg-orange-50 flex items-center
                           justify-content-center mb-4 text-xl"
                aria-hidden="true"
              >
                <span className="mx-auto">{step.emoji}</span>
              </div>

              <h3 className="font-display font-bold text-base text-[#252422] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#7A7570] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Landing() {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-ink text-ash-100">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-lg font-medium text-ash-100">HumanAI</span>
        <LanguageSwitcher />
      </header>

      {/* Hero — left-aligned, one entrance animation, no center blob. */}
      <section className="px-6 pb-16 pt-8 md:px-12 md:pb-24 md:pt-16">
        <div className="max-w-2xl animate-[fadeSlideIn_0.6s_ease_forwards] opacity-0">
          <h1 className="font-display text-[2.6rem] leading-[1.05] text-ash-100 md:text-[3.6rem]">
            HumanAI
          </h1>
          <p className="mt-4 max-w-md text-lg text-ash-300">{t('landing.tagline')}</p>
          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ash-300">
            {t('landing.lead')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-sm bg-signal-blue px-5 py-3 text-sm font-medium text-ink hover:bg-signal-blue/90"
            >
              {t('landing.cta_primary')}
            </Link>
            <Link
              to="/about"
              className="rounded-sm border border-ink-border px-5 py-3 text-sm font-medium text-ash-100 hover:border-ash-500"
            >
              {t('landing.cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Fact strip — a data row with dividers, not three identical cards. */}
      <section className="border-y border-ink-border px-6 py-6 md:px-12">
        <div className="flex max-w-2xl flex-col gap-4 sm:flex-row sm:gap-0 sm:divide-x sm:divide-ink-border">
          <Fact label={t('landing.fact_visual')} value={t('landing.fact_visual_value')} />
          <Fact label={t('landing.fact_engine')} value={t('landing.fact_engine_value')} accent />
          <Fact label={t('landing.fact_api')} value={t('landing.fact_api_value')} />
        </div>
      </section>

      {/* How it works — legitimately sequential, so numbering earns its place here. */}
      <section className="px-6 py-16 md:px-12">
        <div className="max-w-2xl space-y-6">
          <Step n={1} title={t('landing.step1_title')} desc={t('landing.step1_desc')} />
          <Step n={2} title={t('landing.step2_title')} desc={t('landing.step2_desc')} />
          <Step n={3} title={t('landing.step3_title')} desc={t('landing.step3_desc')} />
        </div>
      </section>

      <footer className="border-t border-ink-border px-6 py-8 text-xs text-ash-500 md:px-12">
        {t('landing.footer')}
      </footer>
    </main>
  );
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex-1 px-0 py-1 sm:px-6 sm:py-0 first:pl-0">
      <p className="text-xs text-ash-500">{label}</p>
      <p className={'mt-1 font-display text-base ' + (accent ? 'text-human' : 'text-ash-100')}>{value}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm border border-ink-border font-display text-sm text-human">
        {n}
      </span>
      <div>
        <p className="font-medium text-ash-100">{title}</p>
        <p className="mt-1 text-sm text-ash-300">{desc}</p>
      </div>
    </div>
  );
}

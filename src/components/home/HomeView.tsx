'use client'

import type { CreditItem, HomePageContent, Localized } from '@/utils/db/content'
import { PRINCIPLE_NUMERALS, type SiteLocale } from '@/utils/content/home-defaults'
import { AccentBlob } from './AccentBlob'
import { Reveal, staggerDelay } from './Reveal'

type HomeViewProps = {
  content: HomePageContent
  locale: SiteLocale
}

/** Shared panel chrome: the overlapping, rounded slabs the design is built from. */
const PANEL_SHADOW =
  'shadow-[0_-16px_40px_rgba(59,47,34,.08)] lg:shadow-[0_-24px_56px_rgba(59,47,34,.1)]'

function CreditImage({
  item,
  ratio,
  className,
}: {
  item: CreditItem
  ratio: 'square' | 'portrait'
  className: string
}) {
  const aspect = ratio === 'square' ? 'aspect-square' : 'aspect-3/4'

  return (
    <div className={`overflow-hidden bg-border ${aspect} ${className}`}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.artist}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-card">
          <span className="font-title text-3xl text-primary/70">
            {item.artist.trim().charAt(0) || '—'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function HomeView({ content, locale }: HomeViewProps) {
  const t = (value: Localized) => value[locale] || value.en

  const { hero, about, principles, studio, room, live, cta } = content

  return (
    <div className="relative isolate">
      <AccentBlob />

      {/* ── Hero ─────────────────────────────────────────────────────────────
          Sticky, so every panel below slides up over it as you scroll. */}
      <section className="sticky top-[52px] z-[2] px-6 pt-16 pb-30 lg:top-[76px] lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-15 lg:px-22 lg:pt-30 lg:pb-50">
        <div>
          <Reveal className="font-caption mb-6 text-[10px] uppercase tracking-[.28em] text-secondary lg:mb-10 lg:text-[11px] lg:tracking-[.3em]">
            {t(hero.kicker)}
          </Reveal>

          <Reveal
            as="h1"
            delay={0.07}
            className="font-title mb-5 text-[54px] font-normal leading-[.98] tracking-[-.03em] text-pretty lg:mb-7 lg:text-[112px] lg:leading-[.92] lg:tracking-[-.035em]"
          >
            {hero.nameLead}{' '}
            <em className="not-italic lg:text-primary">{hero.nameAccent}</em>
          </Reveal>

          <Reveal
            as="p"
            delay={0.14}
            className="font-caption max-w-xl text-[11px] uppercase leading-[2.1] tracking-[.2em] text-secondary lg:text-xs lg:leading-[2.2] lg:tracking-[.22em]"
          >
            {t(hero.role)}
          </Reveal>
        </div>

        {/* Desktop places the portrait beside the name; mobile carries it into the
            About panel below, where it overlaps the panel edge. */}
        <Reveal className="hidden overflow-hidden rounded-[40px] shadow-[0_30px_70px_rgba(59,47,34,.2)] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.image}
            alt={`${hero.nameLead} ${hero.nameAccent}`}
            className="block h-100 w-full object-cover object-[50%_28%]"
          />
        </Reveal>
      </section>

      {/* ── About + principles ───────────────────────────────────────────── */}
      <section
        id="about"
        className={`relative z-[3] -mt-16 mx-2.5 scroll-mt-24 rounded-[40px] bg-card px-6 pt-9 pb-12 lg:-mt-30 lg:mx-5 lg:rounded-[64px] lg:px-22 lg:pt-28 lg:pb-24 ${PANEL_SHADOW}`}
      >
        <Reveal className="-mt-23 mb-8 overflow-hidden rounded-[32px] shadow-[0_24px_50px_rgba(59,47,34,.22)] lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.image}
            alt={`${hero.nameLead} ${hero.nameAccent}`}
            className="block h-80 w-full object-cover object-[50%_30%]"
          />
        </Reveal>

        <div className="lg:grid lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start lg:gap-15">
          <div className="font-caption mb-4 text-[10px] uppercase tracking-[.28em] text-secondary lg:mb-0 lg:pt-2.5 lg:text-[11px] lg:tracking-[.3em]">
            {t(about.label)}
          </div>

          <div>
            <Reveal
              as="p"
              className="font-title mb-5 max-w-[760px] text-[26px] leading-[1.32] tracking-[-.015em] lg:mb-7 lg:text-[38px] lg:leading-[1.28] lg:tracking-[-.02em]"
            >
              {t(about.lead)}
            </Reveal>

            <div className="max-w-[860px] space-y-3.5 lg:grid lg:grid-cols-2 lg:gap-10 lg:space-y-0">
              <Reveal
                as="p"
                className="text-[15px] font-light leading-[1.85] text-prose lg:text-base lg:leading-[1.9]"
              >
                {t(about.paragraph1)}
              </Reveal>
              <Reveal
                as="p"
                delay={0.07}
                className="text-[15px] font-light leading-[1.85] text-prose lg:text-base lg:leading-[1.9]"
              >
                {t(about.paragraph2)}
              </Reveal>
            </div>
          </div>
        </div>

        {principles.length > 0 && (
          <ul className="mt-12 flex flex-col gap-6.5 lg:mt-21 lg:grid lg:grid-cols-4 lg:gap-11">
            {principles.map((principle, index) => (
              <Reveal
                as="li"
                key={index}
                delay={staggerDelay(index)}
                className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-3.5 lg:block lg:rounded-[34px] lg:bg-background/60 lg:px-7 lg:py-7.5"
              >
                <div className="font-title text-[28px] leading-none text-primary lg:mb-5 lg:text-[32px]">
                  {PRINCIPLE_NUMERALS[index] ?? index + 1}
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-medium lg:mb-2.5 lg:text-[17px]">
                    {t(principle.title)}
                  </h3>
                  <p className="text-sm font-light leading-[1.65] text-secondary lg:leading-[1.7]">
                    {t(principle.body)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      {/* ── Selected studio work ─────────────────────────────────────────── */}
      <section
        id="studio"
        className={`relative z-[4] -mt-4.5 mx-2.5 scroll-mt-24 rounded-[38px] bg-background px-6 pt-11 pb-13 lg:-mt-14 lg:mx-11 lg:rounded-[60px] lg:px-19 lg:pt-25 lg:pb-24 ${PANEL_SHADOW}`}
      >
        <div className="mb-7 lg:mb-13 lg:flex lg:items-end lg:gap-7">
          <Reveal
            as="h2"
            className="font-title mb-1.5 text-4xl font-normal leading-[1.05] tracking-[-.02em] lg:mb-0 lg:text-[60px] lg:leading-none lg:tracking-[-.025em]"
          >
            {t(studio.title)}
          </Reveal>

          {studio.linkUrl && (
            <a
              href={studio.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-caption inline-flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-secondary transition-opacity hover:opacity-60 lg:ml-auto lg:gap-2.5 lg:rounded-full lg:bg-card lg:px-5.5 lg:py-3 lg:text-[11px] lg:tracking-[.16em] lg:text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary lg:h-1.75 lg:w-1.75" />
              {t(studio.linkLabel)}
            </a>
          )}
        </div>

        <ul className="flex flex-col gap-5.5 lg:grid lg:grid-cols-3 lg:gap-9">
          {studio.items.map((item, index) => (
            <Reveal
              as="li"
              key={index}
              delay={staggerDelay(index)}
              className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 lg:flex lg:flex-col lg:gap-4.5"
            >
              <CreditImage
                item={item}
                ratio="square"
                className="rounded-[26px] shadow-[0_12px_26px_rgba(59,47,34,.16)] lg:rounded-[40px] lg:shadow-[0_20px_44px_rgba(59,47,34,.16)]"
              />
              <div className="lg:flex lg:items-baseline lg:justify-between lg:gap-3.5 lg:px-1.5">
                <div>
                  <div className="font-title text-[21px] leading-[1.1] lg:text-2xl">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity hover:opacity-60"
                      >
                        {item.artist}
                      </a>
                    ) : (
                      item.artist
                    )}
                  </div>
                  <div className="mt-1.5 text-[13px] font-light leading-[1.5] text-secondary">
                    {t(item.meta)}
                  </div>
                  <div className="font-caption mt-2 text-[10px] tracking-[.2em] text-secondary lg:hidden">
                    {item.year}
                  </div>
                </div>
                <span className="font-caption hidden text-[11px] tracking-[.16em] text-secondary lg:inline">
                  {item.year}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── The room ─────────────────────────────────────────────────────── */}
      <section
        id="room"
        className={`relative z-[5] -mt-5 mx-1 scroll-mt-24 overflow-hidden rounded-[38px] bg-card pb-12 lg:-mt-12 lg:mx-5 lg:rounded-[64px] lg:px-22 lg:py-25 ${PANEL_SHADOW}`}
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-center lg:gap-18">
          <Reveal className="lg:overflow-hidden lg:rounded-[48px] lg:shadow-[0_30px_66px_rgba(59,47,34,.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.image}
              alt={t(room.title)}
              loading="lazy"
              className="block h-65 w-full object-cover lg:h-115"
            />
          </Reveal>

          <div className="px-6.5 pt-8.5 lg:px-0 lg:pt-0">
            <Reveal
              as="h2"
              className="font-title mb-3.5 text-4xl font-normal leading-none tracking-[-.02em] lg:mb-5.5 lg:text-[60px] lg:tracking-[-.025em]"
            >
              {t(room.title)}
            </Reveal>
            <Reveal
              as="p"
              delay={0.07}
              className="max-w-[440px] text-[15px] font-light leading-[1.8] text-prose lg:text-[17px] lg:leading-[1.9]"
            >
              {t(room.body)}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Selected live work ───────────────────────────────────────────── */}
      <section
        id="live"
        className={`relative z-[6] -mt-4.5 mx-2.5 scroll-mt-24 rounded-[40px] bg-background px-6 pt-11 pb-13 lg:-mt-12 lg:mx-11 lg:rounded-[60px] lg:px-19 lg:pt-25 lg:pb-24 ${PANEL_SHADOW}`}
      >
        <div className="mb-7 lg:mb-13 lg:flex lg:items-end lg:gap-7">
          <Reveal
            as="h2"
            className="font-title mb-2 text-4xl font-normal leading-[1.05] tracking-[-.02em] lg:mb-0 lg:text-[60px] lg:leading-none lg:tracking-[-.025em]"
          >
            {t(live.title)}
          </Reveal>
          <div className="font-caption text-[10px] uppercase tracking-[.24em] text-secondary lg:ml-auto lg:whitespace-nowrap lg:text-[11px]">
            {t(live.kicker)}
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-4.5 lg:grid-cols-4 lg:gap-8">
          {live.items.map((item, index) => (
            <Reveal
              as="li"
              key={index}
              delay={staggerDelay(index)}
              className="flex flex-col gap-2.5 lg:gap-4.5"
            >
              <CreditImage
                item={item}
                ratio="portrait"
                className="rounded-[26px] shadow-[0_12px_26px_rgba(59,47,34,.16)] lg:rounded-[38px] lg:shadow-[0_20px_44px_rgba(59,47,34,.16)]"
              />
              <div className="lg:px-1.5">
                <div className="font-title text-lg leading-[1.15] lg:text-[22px]">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-60"
                    >
                      {item.artist}
                    </a>
                  ) : (
                    item.artist
                  )}
                </div>
                <div className="mt-1 text-xs font-light leading-[1.5] text-secondary lg:mt-1.5 lg:text-[13px]">
                  {t(item.meta)}
                </div>
                {item.year && (
                  <div className="font-caption mt-2 hidden text-[11px] tracking-[.16em] text-secondary lg:block">
                    {item.year}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className={`relative z-[7] -mt-5.5 mx-1 mb-2 scroll-mt-24 rounded-[38px] bg-primary px-6.5 pt-13 pb-11 lg:-mt-12 lg:mx-5 lg:mb-4 lg:rounded-[64px] lg:px-22 lg:pt-28 lg:pb-23 ${PANEL_SHADOW}`}
      >
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-15">
          <div>
            <Reveal
              as="h2"
              className="font-title mb-3 text-[40px] font-normal leading-[.98] tracking-[-.03em] lg:mb-4.5 lg:text-[76px] lg:leading-[.95] lg:tracking-[-.035em]"
            >
              {t(cta.title)}
            </Reveal>
            <Reveal
              as="p"
              delay={0.07}
              className="mb-7 text-sm font-light leading-[1.7] text-on-accent lg:mb-0 lg:text-base"
            >
              {t(cta.body)}
            </Reveal>
          </div>

          <a
            href={`mailto:${cta.email}`}
            className="font-caption block rounded-full bg-foreground px-5.5 py-4.5 text-center text-xs tracking-[.1em] text-background transition-opacity hover:opacity-80 lg:whitespace-nowrap lg:px-9.5 lg:py-5.5 lg:text-[13px] lg:tracking-[.08em]"
          >
            {cta.email} →
          </a>
        </div>
      </section>
    </div>
  )
}

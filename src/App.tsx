/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const secondaryLinks = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=160&h=160&fit=crop',
    targetUrl: 'https://github.com/',
    alt: 'Circuit board detail',
    openInNewTab: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&h=160&fit=crop',
    targetUrl: 'https://developer.mozilla.org/',
    alt: 'Retro game controller',
    openInNewTab: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=160&h=160&fit=crop',
    targetUrl: 'https://www.figma.com/',
    alt: 'Modern workspace',
    openInNewTab: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&h=160&fit=crop',
    targetUrl: 'https://www.npmjs.com/',
    alt: 'Laptop with code',
    openInNewTab: true,
  },
];

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#101114] text-white">
      <section className="relative isolate flex min-h-screen items-center justify-center px-6 py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#28303a_0%,#101114_48%,#0a0b0d_100%)]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="flex w-full max-w-5xl flex-col items-center gap-10 text-center">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Digital studio</p>
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-7xl">Make the next thing memorable.</h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              A focused space for bold ideas, thoughtful design, and useful digital experiences.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:gap-5">
            {secondaryLinks.slice(0, 2).map((link) => (
              <a
                key={link.targetUrl}
                href={link.targetUrl}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noreferrer' : undefined}
                className="group order-2 h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1 shadow-xl shadow-black/20 transition duration-300 hover:scale-110 hover:border-cyan-300/70 hover:brightness-125 hover:shadow-[0_0_28px_rgba(103,232,249,0.35)] sm:order-1"
              >
                <img src={link.imageUrl} alt={link.alt} className="h-full w-full rounded-xl object-cover transition duration-300 group-hover:scale-105" />
              </a>
            ))}

            <a
              href="https://example.com/start"
              target="_blank"
              rel="noreferrer"
              className="order-1 inline-flex min-h-14 items-center justify-center rounded-full bg-cyan-300 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_0_32px_rgba(103,232,249,0.22)] transition duration-300 hover:scale-105 hover:bg-cyan-200 hover:shadow-[0_0_44px_rgba(103,232,249,0.48)] sm:order-2"
            >
              Start a project
            </a>

            {secondaryLinks.slice(2).map((link) => (
              <a
                key={link.targetUrl}
                href={link.targetUrl}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noreferrer' : undefined}
                className="group order-2 h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1 shadow-xl shadow-black/20 transition duration-300 hover:scale-110 hover:border-cyan-300/70 hover:brightness-125 hover:shadow-[0_0_28px_rgba(103,232,249,0.35)] sm:order-3"
              >
                <img src={link.imageUrl} alt={link.alt} className="h-full w-full rounded-xl object-cover transition duration-300 group-hover:scale-105" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

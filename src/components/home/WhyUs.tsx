'use client';

const values = [
  {
    title: 'Private Access',
    copy: 'Many of our finest listings are never publicly advertised — available by introduction only.',
  },
  {
    title: 'Verified Portfolio',
    copy: 'Every residence is inspected and title-verified by our advisory team before it is presented to you.',
  },
  {
    title: 'White-Glove Viewings',
    copy: 'Private, unhurried tours arranged around your schedule, anywhere in the world.',
  },
  {
    title: 'Global Reach',
    copy: 'A network of on-the-ground advisors across 24 countries, working as one desk.',
  },
];

export function WhyUs() {
  return (
    <section className="bg-charcoal-deep text-ivory py-24 border-y border-emerald-900/30">
      <div className="container-xl">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="label-eyebrow !text-ruby-bright mb-3 block">Why Raja Construction</span>
          <h2 className="font-display text-4xl text-ivory">Premier quality, engineering & trust</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-emerald-800/20 border border-emerald-800/20">
          {values.map((v) => (
            <div key={v.title} className="bg-charcoal-deep p-10 hover:bg-charcoal-soft transition-colors">
              <div className="w-10 h-10 border border-ruby-bright/60 rounded-full mb-6 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ruby-bright" />
              </div>
              <h3 className="font-display text-lg mb-3 text-emerald-100">{v.title}</h3>
              <p className="text-[13.5px] leading-relaxed text-ivory/60 font-light">{v.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

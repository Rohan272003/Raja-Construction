"use client";

export function Footer() {
  return (
    <footer className="bg-charcoal-deep text-ivory mt-24 border-t border-emerald-900/30">
      <div className="container-xl py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-xl mb-4 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">RAJA</span>
            <span className="text-ruby-bright italic">Construction</span>
          </div>
          <p className="text-[13px] leading-relaxed text-ivory/60 max-w-[240px]">
            A private portfolio of premier residential and commercial properties
            in Erode, built with trust and excellence.
          </p>
        </div>
        <div>
          <div className="label-eyebrow !text-ruby-bright mb-4">Locations</div>
          <ul className="space-y-3 text-[13px] text-ivory/70">
            <li>
              <a
                href="/locations/thindal"
                className="hover:text-emerald-300 transition-colors"
              >
                Thindal
              </a>
            </li>
            <li>
              <a
                href="/locations/perundurai"
                className="hover:text-emerald-300 transition-colors"
              >
                Perundurai
              </a>
            </li>
            <li>
              <a
                href="/locations/gobichettipalayam"
                className="hover:text-emerald-300 transition-colors"
              >
                Gobichettipalayam
              </a>
            </li>
            <li>
              <a
                href="/locations/sathyamangalam"
                className="hover:text-emerald-300 transition-colors"
              >
                Sathyamangalam
              </a>
            </li>
            <li>
              <a
                href="/locations"
                className="hover:text-ruby-bright transition-colors text-[11px] uppercase tracking-wider font-semibold"
              >
                View All Locations →
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="label-eyebrow !text-ruby-bright mb-4">Company</div>
          <ul className="space-y-3 text-[13px] text-ivory/70">
            <li>
              <button
                type="button"
                className="hover:text-emerald-300 transition-colors text-left w-full"
              >
                Our Story
              </button>
            </li>
            <li>
              <button
                type="button"
                className="hover:text-emerald-300 transition-colors text-left w-full"
              >
                Engineers & Architects
              </button>
            </li>
            <li>
              <button
                type="button"
                className="hover:text-emerald-300 transition-colors text-left w-full"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                type="button"
                className="hover:text-emerald-300 transition-colors text-left w-full"
              >
                Careers
              </button>
            </li>
          </ul>
        </div>
        <div>
          <div className="label-eyebrow !text-ruby-bright mb-4">Contact</div>
          <ul className="space-y-3 text-[13px] text-ivory/70">
            <li>
              <a
                href="mailto:contact@rajaconstruction.com"
                className="hover:text-emerald-300 transition-colors"
              >
                contact@rajaconstruction.com
              </a>
            </li>
            <li>+91 (0424) 225-0148</li>
            <li>Erode District, Tamil Nadu</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-900/20 py-6 text-center text-[11px] tracking-[0.2em] uppercase text-ivory/40">
        © 2026 Raja Construction. All rights reserved.
      </div>
    </footer>
  );
}

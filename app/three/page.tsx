"use client";

import { ThreeBackground } from "../../src/components/home/ThreeBackground";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#061d15]">
      <ThreeBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-ivory px-6">
          <h1 className="font-display text-4xl md:text-6xl mb-4">
            3D Showcase
          </h1>
          <p className="max-w-2xl mx-auto text-ivory/75">
            Interactive, animated 3D background powered by Three.js. Move your
            mouse for subtle parallax.
          </p>
        </div>
      </div>
    </div>
  );
}

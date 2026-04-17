"use client";

import { ImageIcon } from 'lucide-react';

export default function FileLoadingState() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center p-4 bg-[#12141a] border border-[rgba(255,255,255,0.06)] rounded-xl"
        >
          <div className="w-14 h-14 bg-[#1a1d25] rounded-lg flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-[#22252f]" />
          </div>
          <div className="mt-3 h-3 w-3/4 bg-[#1a1d25] rounded-md"></div>
          <div className="mt-1.5 h-2.5 w-1/2 bg-[#1a1d25] rounded-md"></div>
        </div>
      ))}
    </div>
  );
}

"use client";

import React from 'react';

type FileActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function FileActionButton({ onClick, children, className = '' }: FileActionButtonProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm text-[#8b8fa3] hover:text-[#f0f0f3] hover:bg-[#22252f] cursor-pointer transition-colors ${className}`}
    >
      {children}
    </li>
  );
}

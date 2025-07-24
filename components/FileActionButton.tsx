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
      className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${className}`}
    >
      {children}
    </li>
  );
}

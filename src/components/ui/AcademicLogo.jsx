import React from 'react';

export const AcademicLogo = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 select-none ${className}`}
    aria-label="AcademicStack logo"
  >
    <rect width="32" height="32" rx="8" fill="#0057FF" />
    <path
      d="M16 6.5L25 11.5L16 16.5L7 11.5L16 6.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M7 15.5L16 20.5L25 15.5"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 19.5L16 24.5L25 19.5"
      stroke="#C8D8FF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AcademicLogo;

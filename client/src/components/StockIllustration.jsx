import React from 'react';

export const WarehouseIllustration = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Warehouse Building */}
    <rect x="50" y="100" width="300" height="180" fill="#4A5568" rx="5"/>
    <rect x="50" y="100" width="300" height="40" fill="#2D3748"/>
    
    {/* Roof */}
    <polygon points="50,100 200,40 350,100" fill="#E53E3E"/>
    
    {/* Windows */}
    <rect x="80" y="160" width="40" height="40" fill="#FBD38D" rx="3"/>
    <rect x="140" y="160" width="40" height="40" fill="#FBD38D" rx="3"/>
    <rect x="220" y="160" width="40" height="40" fill="#FBD38D" rx="3"/>
    <rect x="280" y="160" width="40" height="40" fill="#FBD38D" rx="3"/>
    
    {/* Door */}
    <rect x="175" y="200" width="50" height="80" fill="#2D3748" rx="3"/>
    <circle cx="210" cy="240" r="3" fill="#FBD38D"/>
    
    {/* Boxes/Stock */}
    <rect x="70" y="220" width="30" height="30" fill="#48BB78" rx="2"/>
    <rect x="110" y="220" width="30" height="30" fill="#4299E1" rx="2"/>
    <rect x="260" y="220" width="30" height="30" fill="#ED8936" rx="2"/>
    <rect x="300" y="220" width="30" height="30" fill="#9F7AEA" rx="2"/>
    
    {/* Ground */}
    <rect x="0" y="280" width="400" height="20" fill="#68D391"/>
  </svg>
);

export const PackageIllustration = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="60" height="60" fill="#4299E1" rx="3"/>
    <rect x="20" y="30" width="60" height="20" fill="#2B6CB0"/>
    <path d="M20 30 L50 15 L80 30" stroke="#2B6CB0" strokeWidth="2" fill="none"/>
    <line x1="50" y1="15" x2="50" y2="90" stroke="#2B6CB0" strokeWidth="2"/>
  </svg>
);

export const TruckIllustration = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Truck Body */}
    <rect x="15" y="40" width="50" height="30" fill="#ED8936" rx="2"/>
    <rect x="15" y="40" width="20" height="30" fill="#C05621"/>
    <rect x="50" y="50" width="20" height="20" fill="#2D3748" rx="2"/>
    
    {/* Wheels */}
    <circle cx="30" cy="75" r="8" fill="#2D3748"/>
    <circle cx="30" cy="75" r="5" fill="#4A5568"/>
    <circle cx="60" cy="75" r="8" fill="#2D3748"/>
    <circle cx="60" cy="75" r="5" fill="#4A5568"/>
    
    {/* Box on truck */}
    <rect x="55" y="35" width="15" height="15" fill="#48BB78" rx="1"/>
  </svg>
);

export const ChartIllustration = ({ className = "w-full h-48" }) => (
  <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid Lines */}
    <line x1="50" y1="20" x2="50" y2="180" stroke="#E2E8F0" strokeWidth="2"/>
    <line x1="50" y1="180" x2="380" y2="180" stroke="#E2E8F0" strokeWidth="2"/>
    
    {/* Chart Bars */}
    <rect x="70" y="120" width="40" height="60" fill="#4299E1" rx="3"/>
    <rect x="130" y="80" width="40" height="100" fill="#48BB78" rx="3"/>
    <rect x="190" y="100" width="40" height="80" fill="#ED8936" rx="3"/>
    <rect x="250" y="60" width="40" height="120" fill="#9F7AEA" rx="3"/>
    <rect x="310" y="90" width="40" height="90" fill="#F56565" rx="3"/>
    
    {/* Trend Line */}
    <polyline points="70,120 130,80 190,100 250,60 310,90" stroke="#667EEA" strokeWidth="3" fill="none"/>
  </svg>
);

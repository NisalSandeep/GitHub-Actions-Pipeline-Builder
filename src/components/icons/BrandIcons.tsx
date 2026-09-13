import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Realistic 3D Node.js Hexagonal Logo with authentic multi-facet gradients & depth
 */
export const NodeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="nodeGradTop" x1="64" y1="6" x2="64" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#76D257" />
        <stop offset="100%" stopColor="#53A637" />
      </linearGradient>
      <linearGradient id="nodeGradRight" x1="64" y1="40" x2="118" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#43853D" />
        <stop offset="100%" stopColor="#2E6929" />
      </linearGradient>
      <linearGradient id="nodeGradLeft" x1="64" y1="40" x2="10" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#33742E" />
        <stop offset="100%" stopColor="#1E4F1B" />
      </linearGradient>
      <linearGradient id="nodeGradBottom" x1="64" y1="64" x2="64" y2="122" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3E8C34" />
        <stop offset="100%" stopColor="#235E1C" />
      </linearGradient>
      <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Outer 3D Isometric Hexagon */}
    <g filter="url(#nodeShadow)">
      {/* Top Facet */}
      <path d="M64 6L116 36L64 66L12 36L64 6Z" fill="url(#nodeGradTop)" />
      {/* Right Facet */}
      <path d="M64 66L116 36V96L64 124V66Z" fill="url(#nodeGradRight)" />
      {/* Left Facet */}
      <path d="M64 66L12 36V96L64 124V66Z" fill="url(#nodeGradLeft)" />
      {/* Specular Rim Highlights */}
      <path d="M12 36L64 6L116 36" stroke="#A6F08B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M64 6L64 66L116 36" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.25" />
    </g>

    {/* Inner Monogram / Symbol */}
    <g filter="url(#nodeShadow)">
      {/* 'N' */}
      <path
        d="M44 48H52V76L76 50H84V80H76V52L52 78H44V48Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      {/* JS Badge Accent */}
      <circle cx="86" cy="46" r="4" fill="#E2E8F0" />
    </g>
  </svg>
);

/**
 * Realistic 3D Python Logo with rich dual-color tubular snakes & glossy depth
 */
export const PythonIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="pyBlueGrad" x1="16" y1="12" x2="76" y2="76" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4B8BBE" />
        <stop offset="50%" stopColor="#3776AB" />
        <stop offset="100%" stopColor="#1E476C" />
      </linearGradient>
      <linearGradient id="pyYellowGrad" x1="112" y1="116" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE873" />
        <stop offset="50%" stopColor="#FFD43B" />
        <stop offset="100%" stopColor="#DE9E00" />
      </linearGradient>
      <filter id="pyDropShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.38" />
      </filter>
    </defs>

    {/* Top/Left Blue Snake */}
    <path
      filter="url(#pyDropShadow)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M62.6 10C34.5 10 36.2 22.1 36.2 22.1L36.3 34.7H63.2V38.4H25.4C25.4 38.4 10.2 36.6 10.2 64.6C10.2 92.5 24 91.2 24 91.2H32.1V79.7C32.1 66.5 43.5 66.5 43.5 66.5H70.2C81.1 66.5 81.1 56 81.1 56V22.1C81.1 22.1 83.3 10 62.6 10ZM48.2 18.2C52.9 18.2 56.6 21.9 56.6 26.6C56.6 31.3 52.9 35 48.2 35C43.5 35 39.8 31.3 39.8 26.6C39.8 21.9 43.5 18.2 48.2 18.2Z"
      fill="url(#pyBlueGrad)"
    />

    {/* Bottom/Right Yellow Snake */}
    <path
      filter="url(#pyDropShadow)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M65.4 118C93.5 118 91.8 105.9 91.8 105.9L91.7 93.3H64.8V89.6H102.6C102.6 89.6 117.8 91.4 117.8 63.4C117.8 35.5 104 36.8 104 36.8H95.9V48.3C95.9 61.5 84.5 61.5 84.5 61.5H57.8C46.9 61.5 46.9 72 46.9 72V105.9C46.9 105.9 44.7 118 65.4 118ZM79.8 109.8C75.1 109.8 71.4 106.1 71.4 101.4C71.4 96.7 75.1 93 79.8 93C84.5 93 88.2 96.7 88.2 101.4C88.2 106.1 84.5 109.8 79.8 109.8Z"
      fill="url(#pyYellowGrad)"
    />

    {/* Snake Eye Highlights */}
    <circle cx="49" cy="25" r="2.2" fill="#FFFFFF" />
    <circle cx="79" cy="103" r="2.2" fill="#FFFFFF" />
  </svg>
);

/**
 * Realistic 3D Go (Golang) Brand Logo with speed streaks & cyan luster
 */
export const GoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="goGrad" x1="0" y1="0" x2="128" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#48D5F7" />
        <stop offset="50%" stopColor="#00ADD8" />
        <stop offset="100%" stopColor="#007D9C" />
      </linearGradient>
      <filter id="goGlow" x="-10%" y="-20%" width="120%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00ADD8" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#goGlow)">
      {/* Speed lines */}
      <path d="M8 18H32" stroke="url(#goGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M4 31H26" stroke="url(#goGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M11 44H29" stroke="url(#goGrad)" strokeWidth="4.5" strokeLinecap="round" />

      {/* G Letter */}
      <path
        d="M62 31.5C62 17.5 52.5 7.5 39 7.5C25.5 7.5 16 18 16 32C16 46 25.7 56.5 40 56.5C50.8 56.5 58.5 50.2 61.2 41H40.5V32.5H62V31.5Z"
        fill="url(#goGrad)"
      />
      {/* O Letter */}
      <path
        d="M101.5 7.5C87 7.5 75 17.5 75 32C75 46.5 87 56.5 101.5 56.5C116 56.5 128 46.5 128 32C128 17.5 116 7.5 101.5 7.5ZM101.5 44.5C93 44.5 86.5 39 86.5 32C86.5 25 93 19.5 101.5 19.5C110 19.5 116.5 25 116.5 32C116.5 39 110 44.5 101.5 44.5Z"
        fill="url(#goGrad)"
      />
    </g>
  </svg>
);

/**
 * Realistic 3D Java Logo with coffee cup, hot brew & glowing steam plumes
 */
export const JavaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="javaSteam" x1="64" y1="10" x2="64" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF8F00" />
        <stop offset="50%" stopColor="#E65100" />
        <stop offset="100%" stopColor="#C2185B" />
      </linearGradient>
      <linearGradient id="javaCup" x1="40" y1="70" x2="90" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5382A1" />
        <stop offset="60%" stopColor="#355872" />
        <stop offset="100%" stopColor="#1E384C" />
      </linearGradient>
      <filter id="javaGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#E65100" floodOpacity="0.3" />
      </filter>
    </defs>

    <g filter="url(#javaGlow)">
      {/* Steam Plumes */}
      <path
        d="M72 16C75 22 72 27 72 27C72 27 82 22 76 13C72 7 62 3 62 3C62 3 67 8 72 16Z"
        fill="url(#javaSteam)"
      />
      <path
        d="M84 26C88 32 85 38 85 38C85 38 95 32 89 20C83 11 69 5 69 5C69 5 76 12 84 26Z"
        fill="url(#javaSteam)"
      />
      <path
        d="M59 38C62 44 58 50 58 50C58 50 67 44 63 32C59 23 48 18 48 18C48 18 53 26 59 38Z"
        fill="url(#javaSteam)"
      />

      {/* Coffee Cup / Saucer Curves */}
      <path
        d="M48 94C48 94 58 98 72 94C84 91 89 87 89 87C89 87 84 89 74 91C59 92 48 94 48 94Z"
        fill="url(#javaCup)"
      />
      <path
        d="M42 104C42 104 57 109 76 104C90 100 95 94 95 94C95 94 88 98 76 100C57 103 42 104 42 104Z"
        fill="url(#javaCup)"
      />
      <path
        d="M58 68C58 68 38 72 50 76C60 79 80 79 92 76C96 75 98 73 98 73C98 73 93 75 82 76.5C64 79 50 76.5 50 76.5C50 76.5 68 72.5 84 72.5C96 72.5 102 70 102 70C102 70 96 72 84 72C68 72 58 68 58 68Z"
        fill="url(#javaCup)"
      />
      {/* Saucer Base */}
      <path
        d="M36 114C52 120 78 120 94 114C98 112 101 110 101 110C101 110 96 113 90 114C74 118 52 118 38 114C34 113 32 111 32 111C32 111 33 113 36 114Z"
        fill="url(#javaCup)"
      />
    </g>
  </svg>
);

/**
 * Realistic 3D Rust Cogwheel Logo with industrial copper/bronze sheen & embossed R
 */
export const RustIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <radialGradient id="rustGearGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFA67A" />
        <stop offset="35%" stopColor="#DE7C48" />
        <stop offset="70%" stopColor="#A7461B" />
        <stop offset="100%" stopColor="#4A1E0B" />
      </radialGradient>
      <linearGradient id="rustBevel" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFD3BA" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#2E1106" stopOpacity="0.8" />
      </linearGradient>
      <filter id="rustDepth" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </defs>

    <g filter="url(#rustDepth)">
      {/* 3D Gear Body */}
      <circle cx="64" cy="64" r="54" fill="url(#rustGearGrad)" stroke="url(#rustBevel)" strokeWidth="2" />

      {/* 16 Gear Teeth */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
        (angle, i) => (
          <rect
            key={i}
            x="59"
            y="4"
            width="10"
            height="12"
            rx="2.5"
            fill="url(#rustGearGrad)"
            stroke="#2E1106"
            strokeWidth="0.8"
            transform={`rotate(${angle} 64 64)`}
          />
        )
      )}

      {/* Recessed Inner Dark Well */}
      <circle cx="64" cy="64" r="38" fill="#180C07" />
      <circle cx="64" cy="64" r="38" stroke="#DE7C48" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* 5 Lightening Holes */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <circle
          key={i}
          cx={64 + 26 * Math.cos((deg * Math.PI) / 180)}
          cy={64 + 26 * Math.sin((deg * Math.PI) / 180)}
          r="4.5"
          fill="#100703"
          stroke="#FFA67A"
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
      ))}

      {/* Embossed White 'R' */}
      <path
        d="M48 40H66C74.5 40 81 45 81 53C81 59 76.5 64 70 66L82 86H72.5L62 67.5H55V86H48V40ZM55 60.5H65C70 60.5 73.5 58 73.5 53C73.5 48 70 46.5 65 46.5H55V60.5Z"
        fill="#FFFFFF"
        filter="url(#rustDepth)"
      />
    </g>
  </svg>
);

/**
 * Realistic 3D PHP Logo with rich purple oval badge & specular lighting
 */
export const PhpIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="phpBadge" x1="64" y1="16" x2="64" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8892BF" />
        <stop offset="40%" stopColor="#777BB4" />
        <stop offset="100%" stopColor="#434975" />
      </linearGradient>
      <linearGradient id="phpRim" x1="30" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C4CBF0" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#22253D" stopOpacity="0.9" />
      </linearGradient>
      <filter id="phpGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Background Glass Plate */}
    <rect x="10" y="10" width="108" height="108" rx="26" fill="#141724" />
    <rect x="10" y="10" width="108" height="108" rx="26" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.08" />

    {/* 3D Oval Badge */}
    <g filter="url(#phpGlow)">
      <ellipse cx="64" cy="64" rx="52" ry="32" fill="url(#phpBadge)" stroke="url(#phpRim)" strokeWidth="2.5" />
      {/* Specular Glint on Top */}
      <ellipse cx="64" cy="42" rx="38" ry="10" fill="#FFFFFF" fillOpacity="0.16" />
    </g>

    {/* Embossed 'php' Typography */}
    <g fill="#FFFFFF" filter="url(#phpGlow)">
      {/* P1 */}
      <path d="M34 46H47C53 46 56.5 49.5 56.5 55.5C56.5 61.5 52.5 65 46.5 65H40.5L36.5 82H28L34 46ZM42 58.5H46C49 58.5 50.5 57.5 50.5 55.5C50.5 53.5 49 52.5 46 52.5H40.5L42 58.5Z" />
      {/* H */}
      <path d="M59 38H67L64 51.5C66.5 48 70.5 46 75.5 46C81 46 84 49 83 55.5L77.5 82H69.5L74.5 58C75 55 73.5 53 70.5 53C67 53 64.5 56 63.5 61L59 82H50.5L59 38Z" />
      {/* P2 */}
      <path d="M87 46H100C106 46 109.5 49.5 109.5 55.5C109.5 61.5 105.5 65 99.5 65H93.5L89.5 82H81L87 46ZM95 58.5H99C102 58.5 103.5 57.5 103.5 55.5C103.5 53.5 102 52.5 99 52.5H93.5L95 58.5Z" />
    </g>
  </svg>
);

/**
 * Realistic 3D Microsoft .NET Logo with vibrant royal purple gradient & cyan wave
 */
export const DotnetIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="dotnetPlate" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7B52F4" />
        <stop offset="40%" stopColor="#512BD4" />
        <stop offset="100%" stopColor="#2A0888" />
      </linearGradient>
      <linearGradient id="dotnetCyan" x1="70" y1="36" x2="112" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <filter id="dotnetDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#512BD4" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Squircle Plate */}
    <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#dotnetPlate)" filter="url(#dotnetDrop)" />
    <rect x="8" y="8" width="112" height="112" rx="28" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.2" />

    {/* Specular Top Arch */}
    <path d="M16 28C16 19 23 12 32 12H96C105 12 112 19 112 28V46C80 32 48 32 16 46V28Z" fill="#FFFFFF" fillOpacity="0.12" />

    {/* Dot */}
    <circle cx="25" cy="84" r="6" fill="#FFFFFF" />

    {/* Letters N E T */}
    <g fill="#FFFFFF" filter="url(#dotnetDrop)">
      {/* N */}
      <path d="M37 90V40H48L64 69V40H73V90H62L46 61V90H37Z" />
      {/* E */}
      <path d="M79 90V40H101V49H89V60H99V69H89V81H101V90H79Z" />
      {/* T (Cyan dynamic wave) */}
      <path d="M105 40H121V49H116V90H110V49H105V40Z" fill="url(#dotnetCyan)" />
    </g>
  </svg>
);

/**
 * Realistic 3D Faceted Ruby Gemstone with refractive facets & diamond sparkle
 */
export const RubyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <radialGradient id="rubyGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FF7676" />
        <stop offset="60%" stopColor="#CC2222" />
        <stop offset="100%" stopColor="#550505" />
      </radialGradient>
      <filter id="gemDepth" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#CC1111" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Dark Jewel Setting Badge */}
    <rect x="8" y="8" width="112" height="112" rx="28" fill="#170F12" />
    <rect x="8" y="8" width="112" height="112" rx="28" stroke="#CC2222" strokeWidth="1" strokeOpacity="0.25" />

    {/* Faceted Gemstone Group */}
    <g filter="url(#gemDepth)">
      {/* Lower Pavilion Left */}
      <path d="M22 56L64 112L64 56L22 56Z" fill="#990E0E" />
      {/* Lower Pavilion Right */}
      <path d="M106 56L64 112L64 56L106 56Z" fill="#600808" />

      {/* Upper Girdle / Crown Facets */}
      {/* Top Left Triangle */}
      <path d="M38 34L22 56L64 56L38 34Z" fill="#E53935" />
      {/* Top Right Triangle */}
      <path d="M90 34L64 56L106 56L90 34Z" fill="#B71C1C" />
      {/* Top Center Triangle */}
      <path d="M38 34L90 34L64 56L38 34Z" fill="#FF5252" />
      {/* Top Bevels */}
      <path d="M38 34L64 24L90 34L64 56L38 34Z" fill="#FF7B7B" />
      {/* Left Tip */}
      <path d="M38 34L64 24L22 56L38 34Z" fill="#EF5350" />
      {/* Right Tip */}
      <path d="M90 34L64 24L106 56L90 34Z" fill="#8E0000" />

      {/* Center Refraction Glint */}
      <polygon points="64,36 74,56 64,96 54,56" fill="#FFFFFF" fillOpacity="0.35" />
      <polygon points="64,28 68,34 64,40 60,34" fill="#FFFFFF" fillOpacity="0.8" />
    </g>
  </svg>
);

/**
 * Realistic 3D Flutter Logo with overlapping dual azure & cyan wings with true cast shadow
 */
export const FlutterIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="flTopWing" x1="30" y1="20" x2="110" y2="76" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#54C5F8" />
        <stop offset="100%" stopColor="#29B6F6" />
      </linearGradient>
      <linearGradient id="flMidWing" x1="50" y1="70" x2="110" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0175C2" />
        <stop offset="100%" stopColor="#02569B" />
      </linearGradient>
      <filter id="flShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#02569B" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Background Dark Container */}
    <rect x="8" y="8" width="112" height="112" rx="28" fill="#0A1628" />
    <rect x="8" y="8" width="112" height="112" rx="28" stroke="#29B6F6" strokeWidth="1" strokeOpacity="0.2" />

    <g filter="url(#flShadow)">
      {/* Top Flying Wing */}
      <path d="M92 20L36 76H64L106 34L92 20Z" fill="url(#flTopWing)" />

      {/* Lower Diamond Wing */}
      <path d="M64 76L40 100L56 116L96 76H64Z" fill="url(#flTopWing)" />

      {/* Overlapping Deep Blue Shadow Chevron */}
      <path d="M64 108L76 96L88 108L76 120L64 108Z" fill="#014A85" />
      <path d="M76 96L96 76H80L64 92L76 96Z" fill="#02569B" />
      <path d="M76 96L88 108L104 92L92 80L76 96Z" fill="url(#flMidWing)" />
    </g>
  </svg>
);

/**
 * Realistic 3D Docker Whale Logo with shipping containers & marine wake
 */
export const DockerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="dockerWhale" x1="20" y1="50" x2="110" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2496ED" />
        <stop offset="60%" stopColor="#1976D2" />
        <stop offset="100%" stopColor="#0D47A1" />
      </linearGradient>
      <linearGradient id="dockerBox" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CFE4FC" />
      </linearGradient>
      <filter id="dockerShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#0D47A1" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Background Plate */}
    <rect x="8" y="8" width="112" height="112" rx="28" fill="#0B1A2C" />
    <rect x="8" y="8" width="112" height="112" rx="28" stroke="#2496ED" strokeWidth="1" strokeOpacity="0.25" />

    <g filter="url(#dockerShadow)">
      {/* 3 Tiers of Containers */}
      {/* Row 1 (Top) */}
      <rect x="58" y="24" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />

      {/* Row 2 (Middle) */}
      <rect x="30" y="38" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="44" y="38" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="58" y="38" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="72" y="38" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />

      {/* Row 3 (Base of Containers) */}
      <rect x="30" y="52" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="44" y="52" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="58" y="52" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="72" y="52" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />
      <rect x="86" y="52" width="12" height="11" rx="1.5" fill="url(#dockerBox)" />

      {/* 3D Whale Body */}
      <path
        d="M120 58C117 56 112 55.5 107 53C105 52 104 51 103 51C101 54 98 56.5 94 57C93 57 93 56.5 93.5 56C96 52 97 46 92 42C90 40 88 40 86 40C85 41 84.5 42 85 43C86 48 84 53 81 57C78 61 74 64 69 66H16C12 66 8 70 8 74C8 91 16 107 30 117C50 123 90 121 108 106C117 99 122 88 122 76C122 74 121 73 120 72C121 68 122 63 120 58Z"
        fill="url(#dockerWhale)"
      />

      {/* Eye */}
      <circle cx="30" cy="80" r="3.5" fill="#FFFFFF" />
      <circle cx="31" cy="79" r="1.5" fill="#0D47A1" />
    </g>
  </svg>
);

/**
 * Realistic 3D AWS Logo with glowing orange smile & dark slate badge
 */
export const AwsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="awsSmile" x1="20" y1="70" x2="108" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#FFBA42" />
      </linearGradient>
      <filter id="awsGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#FF9900" floodOpacity="0.4" />
      </filter>
    </defs>

    <rect x="8" y="8" width="112" height="112" rx="28" fill="#171E29" />
    <rect x="8" y="8" width="112" height="112" rx="28" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.1" />

    {/* AWS Typography */}
    <g fill="#FFFFFF">
      {/* A */}
      <path d="M38 64H30L25 48L20 64H12L21 36H29L38 64ZM32 58L27 43L22 58H32Z" />
      {/* W */}
      <path d="M68 64H61L56 46L51 64H44L38 36H45L49 56L54 36H59L64 56L68 36H74L68 64Z" />
      {/* S */}
      <path d="M96 58C96 62 92 65 87 65C82 65 78 63 77 60L82 56.5C83 58 85 59.5 87 59.5C89 59.5 90 58.5 90 57.5C90 56 89 55.5 86 54.5L84 54C79 52.5 77 50 77 46.5C77 42.5 81 40 86 40C90 40 94 42 95 44L91 48C90 46.5 88 45.5 86 45.5C84 45.5 83 46.5 83 47.5C83 48.5 84 49 87 50L89 50.5C94 52 96 54.5 96 58Z" />
    </g>

    {/* Radiant Smile Arrow */}
    <g filter="url(#awsGlow)">
      <path
        d="M96 83C85 91 70 95 55 95C34 95 15 87 0.5 73.5C0 73 0.5 72 1.2 72.5C15 85 34 93 55 93C70 93 84 89 97 81C98.5 80 99.5 81.5 96 83Z"
        fill="url(#awsSmile)"
      />
      <path
        d="M100.5 77C99 75.5 96 75 92.5 75.5C92.5 75.5 94.5 77 96.5 79.5C98.5 82 97 85 95 89C93 93 89 96 89 96C89 96 92.5 94 95.5 90.5C99 87 102 82.5 100.5 77Z"
        fill="url(#awsSmile)"
      />
    </g>
  </svg>
);

/**
 * Realistic 3D Vercel Logo with obsidian black plate & specular white triangle
 */
export const VercelIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="vercelPlate" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1A1A1A" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
      <linearGradient id="vercelTri" x1="64" y1="28" x2="64" y2="96" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <filter id="vercelBloom" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#FFFFFF" floodOpacity="0.25" />
      </filter>
    </defs>

    <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#vercelPlate)" stroke="#333333" strokeWidth="1" />
    <polygon points="64,28 104,96 24,96" fill="url(#vercelTri)" filter="url(#vercelBloom)" />
    <path d="M64 28L104 96H24L64 28Z" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
  </svg>
);

/**
 * Realistic 3D GitHub Octocat Logo with deep slate glass badge & silver emblem
 */
export const GitHubIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="ghPlate" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2D333B" />
        <stop offset="100%" stopColor="#1C2128" />
      </linearGradient>
      <filter id="ghShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </defs>

    <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#ghPlate)" stroke="#444C56" strokeWidth="1" />
    <path
      filter="url(#ghShadow)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M64 20C39.7 20 20 39.7 20 64C20 83.5 32.6 99.9 50.1 105.7C52.3 106.1 53.1 104.8 53.1 103.6C53.1 102.6 53 98.7 53 95.1C40.7 97.1 37.5 92.4 36.5 89.9C35.9 88.6 33.8 84.7 31.9 83.7C30.4 82.9 28.2 80.8 31.8 80.8C35.3 80.8 37.8 84 38.6 85.3C42.6 91.9 48.9 90.1 51.4 88.9C51.8 86.1 52.9 84.2 54.2 83.1C44.4 82 34.2 78.2 34.2 61.4C34.2 56.6 35.9 52.6 38.7 49.5C38.3 48.4 36.7 43.9 39.1 37.9C39.1 37.9 42.8 36.7 51.2 42.4C54.7 41.4 58.4 40.9 62.1 40.9C65.8 40.9 69.5 41.4 73 42.4C81.4 36.7 85.1 37.9 85.1 37.9C87.5 43.9 85.9 48.4 85.5 49.5C88.3 52.6 90 56.6 90 61.4C90 78.3 79.7 82 69.9 83.1C71.5 84.5 72.9 87.1 72.9 91.2C72.9 97.1 72.8 101.8 72.8 103.3C72.8 104.5 73.6 105.9 75.8 105.4C93.3 99.6 106 83.1 106 64C106 39.7 86.3 20 64 20Z"
      fill="#F0F6FC"
    />
  </svg>
);

/**
 * Realistic 3D Ubuntu Circle of Friends Logo with warm orange-aubergine sphere
 */
export const UbuntuIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <radialGradient id="ubSphere" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FF7A45" />
        <stop offset="50%" stopColor="#E95420" />
        <stop offset="100%" stopColor="#77216F" />
      </radialGradient>
      <filter id="ubShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#E95420" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Radiant Gradient Disk */}
    <circle cx="64" cy="64" r="54" fill="url(#ubSphere)" filter="url(#ubShadow)" />
    <circle cx="64" cy="64" r="54" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" />

    {/* 3 Friends Nodes & Linking Arcs */}
    <circle cx="94" cy="64" r="9" fill="#FFFFFF" />
    <circle cx="49" cy="38" r="9" fill="#FFFFFF" />
    <circle cx="49" cy="90" r="9" fill="#FFFFFF" />

    <path
      d="M64 26C46 26 31 38 26 54L36 58C40 45 51 36 64 36C75 36 85 42 90 52H101C95 37 81 26 64 26ZM26 74C31 90 46 102 64 102C81 102 95 91 101 76H90C85 86 75 92 64 92C51 92 40 83 36 70L26 74Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Modern Windows 11 3D Glass Tiles with Microsoft Blue Gradient
 */
export const WindowsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="winGrad" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4FC3F7" />
        <stop offset="50%" stopColor="#00A4EF" />
        <stop offset="100%" stopColor="#0277BD" />
      </linearGradient>
      <filter id="winGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#00A4EF" floodOpacity="0.45" />
      </filter>
    </defs>

    <g filter="url(#winGlow)">
      {/* 4 Windows 11 Rounded Tiles */}
      <rect x="16" y="16" width="44" height="44" rx="4" fill="url(#winGrad)" />
      <rect x="68" y="16" width="44" height="44" rx="4" fill="url(#winGrad)" />
      <rect x="16" y="68" width="44" height="44" rx="4" fill="url(#winGrad)" />
      <rect x="68" y="68" width="44" height="44" rx="4" fill="url(#winGrad)" />

      {/* Top Specular Rim */}
      <path d="M18 18H58" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      <path d="M70 18H110" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Realistic Brushed Metal Apple Logo
 */
export const AppleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="appleMetal" x1="64" y1="16" x2="64" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <filter id="appleDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </defs>

    <g filter="url(#appleDrop)">
      {/* Apple Leaf */}
      <path
        d="M79.6 18C82.8 14 85.2 8.4 84.4 2.8C79.6 3.2 74 6 70.8 10C68 13.2 65.6 19.2 66.4 24.8C71.6 25.2 76.8 22 79.6 18Z"
        fill="url(#appleMetal)"
      />
      {/* Apple Body with Bite */}
      <path
        d="M93.2 88.8C89.2 94.8 85.2 100.4 78.8 100.4C72.4 100.4 70.4 96.8 63.2 96.8C55.6 96.8 53.2 100.4 47.2 100.4C40.8 100.4 36.4 94.4 32.4 88.4C23.6 75.6 16.8 52.8 26.4 37.6C30.8 30 38.8 25.2 47.2 25.2C53.6 25.2 59.2 29.6 63.2 29.6C67.2 29.6 74.4 24.4 82.4 25.2C85.6 25.2 94.8 26.4 100.8 35.2C100 35.6 90 41.6 90 54C90 68.8 103.2 74 103.2 74C103.2 74 101.2 80.8 93.2 88.8Z"
        fill="url(#appleMetal)"
      />
    </g>
  </svg>
);

/**
 * Realistic 3D Terminal / Bash Icon with macOS dot header & glowing neon cursor
 */
export const TerminalBashIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="termPlate" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <filter id="termGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#22C55E" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Terminal Window */}
    <rect x="8" y="14" width="112" height="100" rx="16" fill="url(#termPlate)" stroke="#334155" strokeWidth="1.5" />

    {/* Window Titlebar */}
    <path d="M8 36H120" stroke="#334155" strokeWidth="1" />
    {/* macOS Dots */}
    <circle cx="24" cy="25" r="4" fill="#EF4444" />
    <circle cx="36" cy="25" r="4" fill="#F59E0B" />
    <circle cx="48" cy="25" r="4" fill="#10B981" />

    {/* Neon Shell Prompt: >_ */}
    <g filter="url(#termGlow)">
      <path d="M28 52L46 68L28 84" stroke="#4ADE80" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 84H92" stroke="#4ADE80" strokeWidth="5.5" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Realistic 3D CI Testing Beaker with luminous bubbling reaction
 */
export const BeakerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="beakerLiquid" x1="64" y1="60" x2="64" y2="108" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <filter id="beakerGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#06B6D4" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Glass Beaker Silhouette */}
    <g filter="url(#beakerGlow)">
      {/* Liquid Body */}
      <path
        d="M48 68L26 100C22 106 26 112 34 112H94C102 112 106 106 102 100L80 68C72 71 56 71 48 68Z"
        fill="url(#beakerLiquid)"
      />

      {/* Bubbles */}
      <circle cx="56" cy="94" r="4" fill="#FFFFFF" fillOpacity="0.6" />
      <circle cx="74" cy="86" r="3" fill="#FFFFFF" fillOpacity="0.7" />
      <circle cx="64" cy="76" r="2" fill="#FFFFFF" fillOpacity="0.8" />

      {/* Glass Outline & Measuring Lines */}
      <path
        d="M44 20H84M48 20V52L24 94C18 104 25 116 38 116H90C103 116 110 104 104 94L80 52V20"
        stroke="#E2E8F0"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Graduations */}
      <path d="M50 78H62" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M44 92H60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
    </g>
  </svg>
);

/**
 * Official npm red cube brand logo
 */
export const NpmIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#CB3837" />
    <path d="M24 24H104V104H64V44H44V104H24V24Z" fill="#FFFFFF" />
  </svg>
);

/**
 * Official pnpm 4-cube colorful logo
 */
export const PnpmIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#181B1F" />
    <rect x="28" y="28" width="32" height="32" rx="6" fill="#F9AD00" />
    <rect x="68" y="28" width="32" height="32" rx="6" fill="#F6821F" />
    <rect x="68" y="68" width="32" height="32" rx="6" fill="#F6821F" />
    <rect x="28" y="68" width="32" height="32" rx="6" fill="#4BA3E3" />
  </svg>
);

/**
 * Official Yarn Logo on marine blue badge
 */
export const YarnIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#2C8EBB" />
    <circle cx="64" cy="70" r="32" fill="#FFFFFF" />
    <path d="M42 52L52 34L60 46Z" fill="#FFFFFF" />
    <path d="M86 52L76 34L68 46Z" fill="#FFFFFF" />
    <path d="M48 70C56 78 72 78 80 70" stroke="#2C8EBB" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

/**
 * Official Bun Logo
 */
export const BunIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#FBF0DF" />
    <path
      d="M64 28C40 28 28 48 28 72C28 92 44 100 64 100C84 100 100 92 100 72C100 48 88 28 64 28Z"
      fill="#F4D3B0"
    />
    <circle cx="52" cy="70" r="6" fill="#3E2723" />
    <circle cx="76" cy="70" r="6" fill="#3E2723" />
    <ellipse cx="46" cy="78" rx="6" ry="3" fill="#FF8A80" />
    <ellipse cx="82" cy="78" rx="6" ry="3" fill="#FF8A80" />
    <path d="M60 80Q64 86 68 80" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/**
 * Official Codecov Logo
 */
export const CodecovIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#1C1F24" />
    <circle cx="64" cy="64" r="32" stroke="#FF0077" strokeWidth="7" />
    <path d="M46 64C46 54 54 46 64 46C74 46 82 54 82 64" stroke="#FF0077" strokeWidth="6" strokeLinecap="round" />
    <circle cx="64" cy="64" r="7" fill="#FF0077" />
  </svg>
);

/**
 * Official Trivy Security Shield Logo
 */
export const TrivyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#0D2034" />
    <path d="M64 28L96 40V64C96 84 70 98 64 104C58 98 32 84 32 64V40L64 28Z" fill="#0084FF" />
    <path d="M64 36L88 46V64C88 79 78 91 64 96C50 91 40 79 40 64V46L64 36Z" fill="#00C7FF" />
    <circle cx="64" cy="62" r="10" fill="#FFFFFF" />
  </svg>
);

/**
 * Official Slack 4-Color Logo
 */
export const SlackIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="28" fill="#1E1928" />
    <g transform="translate(16, 16) scale(0.75)">
      <path d="M28.4 47.6c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33z" fill="#36C5F0" />
      <path d="M15.2 60.8c-7.3 0-13.2 5.9-13.2 13.2s5.9 13.2 13.2 13.2h13.2V60.8H15.2z" fill="#36C5F0" />
      <path d="M47.6 99.6c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2h-33z" fill="#2EB67D" />
      <path d="M60.8 112.8c0 7.3 5.9 13.2 13.2 13.2s13.2-5.9 13.2-13.2V99.6H60.8v13.2z" fill="#2EB67D" />
      <path d="M99.6 80.4c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33z" fill="#E01E5A" />
      <path d="M112.8 67.2c7.3 0 13.2-5.9 13.2-13.2s-5.9-13.2-13.2-13.2H99.6v26.4h13.2z" fill="#E01E5A" />
      <path d="M80.4 28.4c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2h-33c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33z" fill="#ECB22E" />
      <path d="M67.2 15.2c0-7.3-5.9-13.2-13.2-13.2s-13.2 5.9-13.2 13.2v13.2h26.4V15.2z" fill="#ECB22E" />
    </g>
  </svg>
);

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Official Node.js Hexagonal Logo with authentic facet shading
 */
export const NodeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 256 289"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M128 0L255.3 73.5V220.5L128 288.5L0.7 220.5V73.5L128 0Z" fill="#339933" />
    <path d="M128 14.5L242.8 80.8V213.2L128 274L13.2 213.2V80.8L128 14.5Z" fill="#026E00" />
    <path d="M128 28.5L230 87.5V206.5L128 260.5L26 206.5V87.5L128 28.5Z" fill="#339933" />
    <path d="M128 65L198 105.4V186.2L128 226.6L58 186.2V105.4L128 65Z" fill="#215732" />
    <path
      d="M110 115H128V170C128 178 122 184 112 184C104 184 98 179 96 172L110 167C111 170 113 172 116 172C118 172 120 170 120 166V130H110V115Z"
      fill="#FFFFFF"
    />
    <path
      d="M140 155C140 145 147 140 156 140C163 140 168 143 170 148L158 153C157 151 155 150 153 150C149 150 147 152 147 155C147 158 149 160 153 161L158 162C166 164 170 169 170 175C170 184 162 190 153 190C144 190 138 185 136 178L148 174C149 177 152 179 155 179C158 179 161 177 161 174C161 171 159 169 155 168L150 167C143 165 140 161 140 155Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Python Logo (interlocking blue and yellow snakes)
 */
export const PythonIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 110 110"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M54.1 2C30 2 31.4 12.4 31.4 12.4L31.5 23.2H54.6V26.4H22.1C22.1 26.4 9 24.9 9 49C9 73 20.8 71.9 20.8 71.9H27.8V62C27.8 50.6 37.6 50.6 37.6 50.6H60.6C70 50.6 70 41.5 70 41.5V12.4C70 12.4 71.9 2 54.1 2ZM41.6 9.1C45.6 9.1 48.8 12.3 48.8 16.3C48.8 20.3 45.6 23.5 41.6 23.5C37.6 23.5 34.4 20.3 34.4 16.3C34.4 12.3 37.6 9.1 41.6 9.1Z"
      fill="#3776AB"
    />
    <path
      d="M55.9 108C80 108 78.6 97.6 78.6 97.6L78.5 86.8H55.4V83.6H87.9C87.9 83.6 101 85.1 101 61C101 37 89.2 38.1 89.2 38.1H82.2V48C82.2 59.4 72.4 59.4 72.4 59.4H49.4C40 59.4 40 68.5 40 68.5V97.6C40 97.6 38.1 108 55.9 108ZM68.4 100.9C64.4 100.9 61.2 97.7 61.2 93.7C61.2 89.7 64.4 86.5 68.4 86.5C72.4 86.5 75.6 89.7 75.6 93.7C75.6 97.7 72.4 100.9 68.4 100.9Z"
      fill="#FFD43B"
    />
  </svg>
);

/**
 * Official Go (Golang) Brand Logo with speed streaks
 */
export const GoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 100 40"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Speed lines */}
    <path d="M5 12H24M2 19H18M7 26H21" stroke="#00ADD8" strokeWidth="3" strokeLinecap="round" />
    {/* G */}
    <path
      d="M48 20C48 11.2 41.8 5 33 5C24.2 5 18 11.5 18 20.3C18 29.1 24.3 35.5 33.6 35.5C40.6 35.5 45.6 31.4 47.4 25.5H34V20.2H48V20Z"
      fill="#00ADD8"
    />
    {/* O */}
    <path
      d="M75 5C65.5 5 57.5 11.5 57.5 20.3C57.5 29.1 65.5 35.5 75 35.5C84.5 35.5 92.5 29.1 92.5 20.3C92.5 11.5 84.5 5 75 5ZM75 28C69.5 28 65 24.5 65 20.3C65 16 69.5 12.5 75 12.5C80.5 12.5 85 16 85 20.3C85 24.5 80.5 28 75 28Z"
      fill="#00ADD8"
    />
  </svg>
);

/**
 * Official Java Logo with coffee cup and steam
 */
export const JavaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M26.5 48.5C26.5 48.5 31.5 50.2 38.5 48.5C44 47.2 46.5 45 46.5 45C46.5 45 44 46.2 38.8 46.8C31.5 47.5 26.5 48.5 26.5 48.5Z"
      fill="#5382A1"
    />
    <path
      d="M24 53.5C24 53.5 31 56 40.5 53.5C47.5 51.5 50 48.5 50 48.5C50 48.5 46.5 50.5 40.5 51.5C31 52.8 24 53.5 24 53.5Z"
      fill="#5382A1"
    />
    <path
      d="M36.5 22C38.5 24 37.5 26 37.5 26C37.5 26 41.5 24 39.5 20C37.5 16 32.5 14 32.5 14C32.5 14 35 16 36.5 22Z"
      fill="#E76F00"
    />
    <path
      d="M42 14C44 16 43 18 43 18C43 18 47.5 15 44.5 10C41.5 5 34.5 3 34.5 3C34.5 3 38 6 42 14Z"
      fill="#E76F00"
    />
    <path
      d="M32 35C32 35 22 37 28 39C33 40.5 43 40.5 49 39C51 38.5 52 37.5 52 37.5C52 37.5 49.5 38.5 44 39.2C35 40.5 28 39.2 28 39.2C28 39.2 37 37.2 45 37.2C51 37.2 54 36 54 36C54 36 51 37 45 37C37 37 32 35 32 35Z"
      fill="#5382A1"
    />
    <path
      d="M29 27C30.5 28.5 29.5 30 29.5 30C29.5 30 33 28 31.5 25C29.8 22 25.5 20.5 25.5 20.5C25.5 20.5 27.5 22 29 27Z"
      fill="#E76F00"
    />
  </svg>
);

/**
 * Official Rust Cogwheel Gear Logo
 */
export const RustIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 106 106"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Rust Gear */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M53 0C55.2 0 57 1.8 57 4V8.1C62.4 8.7 67.5 10.3 72.3 12.7L75.2 9.8C76.8 8.2 79.3 8.2 80.9 9.8L83.7 12.6C85.3 14.2 85.3 16.7 83.7 18.3L80.8 21.2C83.2 26 84.8 31.1 85.4 36.5H89.5C91.7 36.5 93.5 38.3 93.5 40.5V44.5C93.5 46.7 91.7 48.5 89.5 48.5H85.4C84.8 53.9 83.2 59 80.8 63.8L83.7 66.7C85.3 68.3 85.3 70.8 83.7 72.4L80.9 75.2C79.3 76.8 76.8 76.8 75.2 75.2L72.3 72.3C67.5 74.7 62.4 76.3 57 76.9V81C57 83.2 55.2 85 53 85H49C46.8 85 45 83.2 45 81V76.9C39.6 76.3 34.5 74.7 29.7 72.3L26.8 75.2C25.2 76.8 22.7 76.8 21.1 75.2L18.3 72.4C16.7 70.8 16.7 68.3 18.3 66.7L21.2 63.8C18.8 59 17.2 53.9 16.6 48.5H12.5C10.3 48.5 8.5 46.7 8.5 44.5V40.5C8.5 38.3 10.3 36.5 12.5 36.5H16.6C17.2 31.1 18.8 26 21.2 21.2L18.3 18.3C16.7 16.7 16.7 14.2 18.3 12.6L21.1 9.8C22.7 8.2 25.2 8.2 26.8 9.8L29.7 12.7C34.5 10.3 39.6 8.7 45 8.1V4C45 1.8 46.8 0 49 0H53ZM51 21C35.5 21 23 33.5 23 49C23 64.5 35.5 77 51 77C66.5 77 79 64.5 79 49C79 33.5 66.5 21 51 21Z"
      fill="#DEA584"
    />
    {/* R letter */}
    <path
      d="M40 33H53.5C59.3 33 63.5 36.8 63.5 42C63.5 46 60.5 49.3 56.5 50.5L64 65H57.5L50.8 52H45.5V65H40V33ZM45.5 47.5H53C56 47.5 58 45.5 58 42.5C58 39.5 56 37.5 53 37.5H45.5V47.5Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Docker Whale with Shipping Containers
 */
export const DockerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M23.15 10.45c-.48-.37-1.39-.46-2.35-.91-.32-.15-.55-.41-.65-.37-.36.63-.97 1.05-1.69 1.13-.1 0-.15-.07-.12-.17a4.98 4.98 0 00.35-1.85 5.57 5.57 0 00-5.56-5.56c-.34 0-.68.04-1 .11a.22.22 0 00-.17.26c.15.93-.08 1.88-.63 2.62a3.9 3.9 0 01-2.92 1.47H1.5a.75.75 0 00-.75.75c0 3.32 1.5 6.4 4.07 8.35a11.96 11.96 0 0014.28-.58 7.37 7.37 0 002.9-4.73.75.75 0 00-.23-.67 4.2 4.2 0 001.38-1.67z"
      fill="#2496ED"
    />
    <rect x="5.4" y="9.15" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="8.25" y="9.15" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="11.1" y="9.15" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="5.4" y="6.3" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="8.25" y="6.3" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="11.1" y="6.3" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="13.95" y="6.3" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
    <rect x="11.1" y="3.45" width="2.15" height="2.15" rx="0.3" fill="#FFFFFF" />
  </svg>
);

/**
 * Official Amazon Web Services (AWS) Logo
 */
export const AwsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#232F3E" />
    <path
      d="M48 41.5C42.8 45.2 35 47.2 27.5 47.2C17 47.2 7.7 43.2 0.3 36.5C0 36.2 0.2 35.8 0.6 36C7.5 42.4 16.7 46.2 27.5 46.2C35 46.2 42.2 44.2 48.5 40.5C49.2 40.1 49.7 40.9 48 41.5Z"
      fill="#FF9900"
    />
    <path
      d="M50.2 38.5C49.5 37.8 48 37.5 46.2 37.8C46.2 37.8 47.2 38.5 48.2 39.8C49.2 41.1 48.5 42.5 47.5 44.5C46.5 46.5 44.5 48 44.5 48C44.5 48 46.2 47 47.8 45.2C49.5 43.5 51 41.2 50.2 38.5Z"
      fill="#FF9900"
    />
    <path
      d="M21.5 31.5H17.5L15 23L12.5 31.5H8.5L13 17.5H17L21.5 31.5ZM34.5 31.5H31L28.5 22L26 31.5H22.5L19.2 17.5H23L25 27.5L27.5 17.5H30L32.5 27.5L34.5 17.5H38.2L34.5 31.5ZM49 28.5C49 30.5 47.2 31.8 44.8 31.8C42.5 31.8 40.5 30.8 39.8 29.5L42.5 27.8C43.2 28.5 43.8 29.2 44.8 29.2C45.5 29.2 46.2 28.8 46.2 28.2C46.2 27.5 45.5 27.2 44.2 26.8L43 26.5C40.8 25.8 40 24.5 40 22.8C40 20.8 41.8 19.5 44.2 19.5C46.2 19.5 48 20.5 48.8 21.5L46.2 23.2C45.8 22.5 45 22 44.2 22C43.5 22 42.8 22.5 42.8 23C42.8 23.5 43.5 23.8 44.5 24.2L45.8 24.5C48 25.2 49 26.5 49 28.5Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Vercel Logo (Equilateral Triangle in dark badge)
 */
export const VercelIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#000000" />
    <path d="M32 14L52 48H12L32 14Z" fill="#FFFFFF" />
  </svg>
);

/**
 * Official GitHub Octocat Invertocat Logo
 */
export const GitHubIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
);

/**
 * Official Ubuntu "Circle of Friends" Logo
 */
export const UbuntuIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="14" fill="#E95420" />
    <circle cx="23.5" cy="16" r="2.4" fill="#FFFFFF" />
    <circle cx="12.2" cy="9.5" r="2.4" fill="#FFFFFF" />
    <circle cx="12.2" cy="22.5" r="2.4" fill="#FFFFFF" />
    <path
      d="M16 6.5C11.5 6.5 7.7 9.4 6.4 13.5L8.9 14.5C9.9 11.3 12.7 9 16 9C18.8 9 21.2 10.6 22.5 13H25.3C23.8 9.2 20.2 6.5 16 6.5ZM6.4 18.5C7.7 22.6 11.5 25.5 16 25.5C20.2 25.5 23.8 22.8 25.3 19H22.5C21.2 21.4 18.8 23 16 23C12.7 23 9.9 20.7 8.9 17.5L6.4 18.5Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Windows 4-Pane Logo
 */
export const WindowsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#00A4EF"
      d="M2 5.5L13.8 3.8V14.8H2V5.5ZM15.5 3.5L30 1.5V14.8H15.5V3.5ZM2 16.5H13.8V27.5L2 25.8V16.5ZM15.5 16.5H30V29.8L15.5 27.8V16.5Z"
    />
  </svg>
);

/**
 * Official Apple Silhouette Logo
 */
export const AppleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#F0F6FC"
      d="M23.3 22.2C22.3 23.7 21.3 25.1 19.7 25.1C18.1 25.1 17.6 24.2 15.8 24.2C13.9 24.2 13.3 25.1 11.8 25.1C10.2 25.1 9.1 23.6 8 22.1C5.8 18.9 4.1 13.2 6.5 9.4C7.6 7.5 9.6 6.3 11.7 6.3C13.3 6.3 14.8 7.4 15.8 7.4C16.8 7.4 18.6 6.1 20.6 6.3C21.4 6.3 23.7 6.6 25.2 8.8C25 8.9 22.5 10.4 22.5 13.5C22.5 17.2 25.8 18.5 25.8 18.5C25.8 18.6 25.3 20.3 23.3 22.2ZM19.9 4.5C20.7 3.5 21.3 2.1 21.1 0.7C19.9 0.8 18.5 1.5 17.7 2.5C17 3.3 16.4 4.8 16.6 6.2C17.9 6.3 19.2 5.5 19.9 4.5Z"
    />
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
    <path d="M28.4 47.6c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33z" fill="#36C5F0" />
    <path d="M15.2 60.8c-7.3 0-13.2 5.9-13.2 13.2s5.9 13.2 13.2 13.2h13.2V60.8H15.2z" fill="#36C5F0" />
    <path d="M47.6 99.6c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2h-33z" fill="#2EB67D" />
    <path d="M60.8 112.8c0 7.3 5.9 13.2 13.2 13.2s13.2-5.9 13.2-13.2V99.6H60.8v13.2z" fill="#2EB67D" />
    <path d="M99.6 80.4c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33z" fill="#E01E5A" />
    <path d="M112.8 67.2c7.3 0 13.2-5.9 13.2-13.2s-5.9-13.2-13.2-13.2H99.6v26.4h13.2z" fill="#E01E5A" />
    <path d="M80.4 28.4c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2h-33c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33z" fill="#ECB22E" />
    <path d="M67.2 15.2c0-7.3-5.9-13.2-13.2-13.2s-13.2 5.9-13.2 13.2v13.2h26.4V15.2z" fill="#ECB22E" />
  </svg>
);

/**
 * Official npm red brand logo
 */
export const NpmIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 256 256"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="256" height="256" rx="36" fill="#CB3837" />
    <path d="M48 48H208V208H128V88H88V208H48V48Z" fill="#FFFFFF" />
  </svg>
);

/**
 * Official pnpm orange 4-cube logo
 */
export const PnpmIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#1B1F24" />
    <rect x="14" y="14" width="16" height="16" rx="3" fill="#F9AD00" />
    <rect x="34" y="14" width="16" height="16" rx="3" fill="#F6821F" />
    <rect x="34" y="34" width="16" height="16" rx="3" fill="#F6821F" />
    <rect x="14" y="34" width="16" height="16" rx="3" fill="#4BA3E3" />
  </svg>
);

/**
 * Official Yarn Logo
 */
export const YarnIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#2C8EBB" />
    {/* Cat ears & yarn ball silhouette */}
    <circle cx="32" cy="35" r="16" fill="#FFFFFF" />
    <path d="M21 26L26 17L30 23Z" fill="#FFFFFF" />
    <path d="M43 26L38 17L34 23Z" fill="#FFFFFF" />
    <path d="M24 35C28 39 36 39 40 35" stroke="#2C8EBB" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * Official Bun Logo
 */
export const BunIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#FBF0DF" />
    <path
      d="M32 14C20 14 14 24 14 36C14 46 22 50 32 50C42 50 50 46 50 36C50 24 44 14 32 14Z"
      fill="#F4D3B0"
    />
    <circle cx="26" cy="35" r="3" fill="#3E2723" />
    <circle cx="38" cy="35" r="3" fill="#3E2723" />
    <ellipse cx="23" cy="39" rx="3" ry="1.5" fill="#FF8A80" />
    <ellipse cx="41" cy="39" rx="3" ry="1.5" fill="#FF8A80" />
    <path d="M30 40Q32 43 34 40" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Official Codecov Logo
 */
export const CodecovIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#1C1F24" />
    <circle cx="32" cy="32" r="16" stroke="#FF0077" strokeWidth="4" />
    <path
      d="M23 32C23 27 27 23 32 23C37 23 41 27 41 32"
      stroke="#FF0077"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="32" r="3.5" fill="#FF0077" />
  </svg>
);

/**
 * Official Trivy (Aqua Security) Security Shield Logo
 */
export const TrivyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="14" fill="#0D2034" />
    <path
      d="M32 14L48 20V32C48 42 41 49 32 52C23 49 16 42 16 32V20L32 14Z"
      fill="#0084FF"
    />
    <path
      d="M32 18L44 23V32C44 39.5 39 45.5 32 48C25 45.5 20 39.5 20 32V23L32 18Z"
      fill="#00C7FF"
    />
    <circle cx="32" cy="31" r="5" fill="#FFFFFF" />
  </svg>
);

/**
 * Modern Terminal/Bash icon
 */
export const TerminalBashIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="32" height="32" rx="8" fill="#161B22" stroke="#30363D" strokeWidth="2" />
    <path
      d="M7 11L13 16L7 21M16 21H25"
      stroke="#7EE787"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * CI / Testing Beaker Icon
 */
export const BeakerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="32" height="32" rx="8" fill="#161B22" stroke="#30363D" strokeWidth="2" />
    <path
      d="M12 7H20M13 7V12L8.5 22.5C7.9 23.9 8.9 25.5 10.5 25.5H21.5C23.1 25.5 24.1 23.9 23.5 22.5L19 12V7"
      stroke="#58A6FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 20H22" stroke="#3FB950" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

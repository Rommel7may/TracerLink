import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="/pampanga.png" // ✅ Replace with the actual path to your image
      alt="App Logo"
      className={`h-9 w-auto transition-all ${props.className || ''}`}
    />
  );
}

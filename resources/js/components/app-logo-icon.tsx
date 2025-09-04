import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="/pampanga.png"
      alt="App Logo"
      className={`h-9 w-auto transition-all ${props.className || ''}`}
    />
  );
}

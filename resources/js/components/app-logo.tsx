import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  return (
    <div className="flex items-center space-x-3">
      {/* Logo container */}
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
        <AppLogoIcon className="h-10 w-10 object-contain" />
      </div>

      {/* Text beside logo */}
      <div className="flex flex-col text-left leading-tight">
        <span className="font-semibold text-sm text-foreground">
          Pampanga State U - TracerLink
        </span>
        <span className="text-xs text-muted-foreground tracking-wide">
          Lubao Campus
        </span>
      </div>
    </div>
  );
}


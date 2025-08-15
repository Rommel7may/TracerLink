import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex size-10 items-center justify-center">
        <AppLogoIcon className="size-8 fill-current text-primary" />
      </div>
      <div className="grid flex-1 text-left text-sm">
        <span className="font-semibold leading-tight text-foreground">
          DLC TRACERLINK
        </span>
      </div>
    </div>
  );
}

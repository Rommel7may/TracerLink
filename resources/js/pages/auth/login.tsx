import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Shield, Mail, Lock } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceTabs from '@/components/appearance-tabs';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
}

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  // Effect to handle the lock timer
  useEffect(() => {
    // Check for existing lock time in localStorage
    const storedLockTime = localStorage.getItem('lockTime');
    const storedAttempts = localStorage.getItem('loginAttempts');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockTime) {
      const lockTimeInt = parseInt(storedLockTime);
      const currentTime = Date.now();
      
      if (currentTime < lockTimeInt) {
        // Still locked - calculate remaining time
        setIsLocked(true);
        setTimeRemaining(Math.floor((lockTimeInt - currentTime) / 1000));
      } else {
        // Lock expired - clear storage
        localStorage.removeItem('lockTime');
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  // Effect to handle the countdown timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isLocked && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsLocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('lockTime');
            localStorage.removeItem('loginAttempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLocked, timeRemaining]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) return;
    
    // For demonstration purposes - track failed attempts
    if (loginAttempts >= 5) {
      const lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes from now
      localStorage.setItem('lockTime', lockUntil.toString());
      setIsLocked(true);
      setTimeRemaining(300); // 5 minutes in seconds
      return;
    }
    post(route('login'), {
      onFinish: () => reset('password'),
      onError: () => {
        // Increment failed attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        
        if (newAttempts >= 3) {
          const lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes from now
          localStorage.setItem('lockTime', lockUntil.toString());
          setIsLocked(true);
          setTimeRemaining(300); // 5 minutes in seconds
        }
      },
    });
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <AuthLayout title="Log in to your account" description="Enter your credentials to access your account">
      <Head title="Log in" />

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <AppearanceTabs />
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 rounded-full">
              <AppLogoIcon/>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {status && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{status}</AlertDescription>
            </Alert>
          )}
          
          {isLocked && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Too many failed attempts. Please try again in {formatTimeRemaining()}.
              </AlertDescription>
            </Alert>
          )}

          <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="email@example.com"
                    className="pl-10"
                    disabled={processing || isLocked}
                  />
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {canResetPassword && (
                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                      Forgot password?
                    </TextLink>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    tabIndex={2}
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Password"
                    className="pl-10 pr-10"
                    disabled={processing || isLocked}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={3}
                    disabled={processing || isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={data.remember}
                    onClick={() => setData('remember', !data.remember)}
                    tabIndex={4}
                    disabled={processing || isLocked}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                tabIndex={5} 
                disabled={processing || isLocked}
                size="lg"
              >
                {processing ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : isLocked ? (
                  `Try again in ${formatTimeRemaining()}`
                ) : (
                  'Log in'
                )}
              </Button>
            </div>

            {canRegister && (
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <TextLink href={route('register')} tabIndex={6}>
                  Sign up
                </TextLink>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
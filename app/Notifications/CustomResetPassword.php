<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends ResetPasswordNotification
{
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Your Password - PAMPANGA STATE U - LC TRACERLINK')
            ->greeting('Hello, ' . ($notifiable->name ?? 'Alumni') . '!') // fallback if no name
            ->line('We received a request to reset the password for your account at **PAMPANGA STATE U - LC TRACERLINK**.')
            ->action('Reset Password', url(route('password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false)))
            ->line('⚠️ This link will expire in 60 minutes.')
            ->line('If you did not request a password reset, please ignore this email.')
            ->salutation('Regards, PAMPANGA STATE U - LC TRACERLINK Team');
    }
}

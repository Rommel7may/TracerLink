<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AlumniNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageContent;

    /**
     * Create a new message instance.
     */
    public function __construct($messageContent = null)
    {
        $this->messageContent = $messageContent ?? 'Greetings! This is a notification for our beloved alumni.';
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Alumni Notification')
                    ->view('emails.alumni-notification')
                    ->with(['content' => $this->messageContent]);
    }
}

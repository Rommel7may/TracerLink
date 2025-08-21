<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Alumni;

class JobReferralRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $alumni;

    public function __construct(Alumni $alumni)
    {
        $this->alumni = $alumni;
    }

    public function build()
    {
        return $this->subject('Job Referral Request for Unemployed Alumni')
                    ->view('emails.job_referral_request');
    }
}


<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\JobPost;

class JobNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    use Queueable, SerializesModels;

    public $job;

    public function __construct(JobPost $job)
    {
        $this->job = $job;
    }

    public function build()
{
    return $this->subject("New Job Opportunity: {$this->job->title} @ {$this->job->company_name}")
                ->view('emails.job-notification')
                ->with(['job' => $this->job]);

}

}

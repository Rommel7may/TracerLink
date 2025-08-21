<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreateJobPostMail extends Mailable
{
    use Queueable, SerializesModels;

    public $alumni;
    public $formUrl;

    /**
     * Create a new message instance.
     *
     * @param $alumni
     * @param string $formUrl
     */
    public function __construct($alumni, string $formUrl)
    {
        $this->alumni = $alumni;
        $this->formUrl = $formUrl;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Create a New Job Post')
                    ->view('emails.CreateJobPostForm');
    }
}

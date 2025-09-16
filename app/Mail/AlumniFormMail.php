<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AlumniFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $student;
    public $formUrl;

    public function __construct($student)
    {
        $this->student = $student;
        $this->formUrl = url("/alumni-form/{$student->student_number}");
    }

    public function build()
    {
        return $this->subject('Fill Out Your DHVSU Alumni Tracer Form')
                    ->view('emails.alumni-form');
    }
}

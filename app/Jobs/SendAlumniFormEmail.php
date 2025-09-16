<?php

namespace App\Jobs;

use App\Mail\AlumniFormMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendAlumniFormEmail implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
     use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $student;

    public function __construct($student)
    {
        $this->student = $student;
    }

    public function handle()
    {
        Mail::to($this->student->email)->send(new AlumniFormMail($this->student));
    }
}

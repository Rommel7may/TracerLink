<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use Illuminate\Support\Facades\Mail;

class SendController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('send', [
            'students' => Student::all(),
        ]);
    }

public function sendEmail(Request $request)
{
    $request->validate([
        'program' => 'required|string',
    ]);

    $students = Student::where('program', $request->program)->get();

    $sent = [];
    $failed = [];

    foreach ($students as $student) {
        $formUrl = url("/alumni-form/{$student->student_number}");

        try {
            \Mail::send('emails.alumni-form', [
                'student' => $student,
                'formUrl' => $formUrl,
            ], function ($message) use ($student) {
                $message->to($student->email)
                        ->subject('Fill Out Your DHVSU Alumni Tracer Form');
            });

            $sent[] = $student;
        } catch (\Exception $e) {
            \Log::error("Failed to send email to {$student->email}: " . $e->getMessage());
            $failed[] = $student;
        }
    }

    return response()->json([
        'message' => 'Emails processed.',
        'sent' => $sent,
        'failed' => $failed,
    ]);
}
}


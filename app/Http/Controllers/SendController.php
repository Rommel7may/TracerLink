<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Alumni;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendController extends Controller
{
    // Display email form page
    public function index()
    {
        return Inertia::render('send', [
            'students' => Student::all(),
        ]);
    }

    // Send email to selected students
    public function sendEmail(Request $request)
    {
        $request->validate([
            'emails' => 'required|array|min:1',
            'emails.*' => 'required|email',
        ]);

        $emails = $request->emails;
        $sent = [];
        $failed = [];

        foreach ($emails as $email) {
            $student = Student::where('email', $email)->first();

            if (!$student) {
                $failed[] = $email;
                continue;
            }

            try {
                Mail::send('emails.alumni-form', [
                    'student' => $student,
                    'formUrl' => url("/alumni-form/{$student->student_number}")
                ], function ($message) use ($student) {
                    $message->to($student->email)
                            ->subject('Fill Out Your DHVSU Alumni Tracer Form');
                });

                $sent[] = $email;
            } catch (\Exception $e) {
                Log::error("Failed to send to {$student->email}: " . $e->getMessage());
                $failed[] = $email;
            }
        }

        return response()->json([
            'message' => count($sent) . ' emails sent successfully.',
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }

    // Send email to alumni by program
    public function sendToProgram(Request $request)
    {
        $request->validate([
            'program' => 'required|string',
        ]);

        $alumniList = Alumni::where('program', $request->program)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->where('consent', true)
            ->get();

        $sent = [];
        $failed = [];

        foreach ($alumniList as $alum) {
            try {
                Mail::send('emails.alumni-form', [
                    'student' => $alum,
                    'formUrl' => url("/alumni-form/{$alum->student_number}")
                ], function ($message) use ($alum) {
                    $message->to($alum->email)
                            ->subject('Fill Out Your DHVSU Alumni Tracer Form');
                });

                $alum->update([
                    'email_sent_at' => now(),
                    'email_status' => 'sent',
                ]);

                $sent[] = $alum->email;
            } catch (\Exception $e) {
                Log::error("Failed to send to {$alum->email}: " . $e->getMessage());

                $alum->update([
                    'email_status' => 'failed',
                ]);

                $failed[] = $alum->email;
            }
        }

        return response()->json([
            'message' => '✅ Alumni emails by program processed.',
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }

    // Update alumni info based on student_number
    public function updateAlumniForm(Request $request)
    {
        $validated = $request->validate([
            'student_number' => ['required', 'string'],
            'email' => ['required', 'email'],
            'name' => ['required', 'string'],
            'program' => ['required', 'string'],
        ]);

        $alumni = Alumni::where('student_number', $validated['student_number'])->first();

        if (!$alumni) {
            return response()->json([
                'message' => '❌ Student not found.',
            ], 404);
        }

        $alumni->update($validated);

        return response()->json([
            'message' => '✅ Alumni record updated successfully.',
        ]);
    }
}

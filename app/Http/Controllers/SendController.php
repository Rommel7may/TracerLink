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
    // 📄 Display email form page
    public function index()
    {
        return Inertia::render('send', [
            'students' => Student::all(),
        ]);
    }

    // 📧 Send email to students (by program)
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
                Mail::send('emails.alumni-form', [
                    'student' => $student,
                    'formUrl' => $formUrl,
                ], function ($message) use ($student) {
                    $message->to($student->email)
                            ->subject('Fill Out Your DHVSU Alumni Tracer Form');
                });

                $sent[] = $student->email;
            } catch (\Exception $e) {
                Log::error("Failed to send email to {$student->email}: " . $e->getMessage());
                $failed[] = $student->email;
            }
        }

        return response()->json([
            'message' => 'Student emails processed.',
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }

    // ✅ Send email to alumni by program
    public function sendToProgram(Request $request)
    {
        $request->validate([
            'program' => 'required|string',
        ]);

        $alumni = Alumni::where('program', $request->program)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->where('consent', true)
            ->get();

        $sent = [];
        $failed = [];

        foreach ($alumni as $alum) {
            $formUrl = url("/alumni-form/{$alum->student_number}");

            try {
                Mail::send('emails.alumni-form', [
                    'student' => $alum,
                    'formUrl' => $formUrl,
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
                Log::error("❌ Failed to send to {$alum->email}: " . $e->getMessage());

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

    // ✅ Send email to all alumni
    public function sendToAllAlumni()
    {
        $alumniList = Alumni::where('consent', true)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        $sent = [];
        $failed = [];

        foreach ($alumniList as $alumni) {
            $formUrl = url("/alumni-form/{$alumni->student_number}");

            try {
                Mail::send('emails.alumni-form', [
                    'student' => $alumni,
                    'formUrl' => $formUrl,
                ], function ($message) use ($alumni) {
                    $message->to($alumni->email)
                            ->subject('Fill Out Your DHVSU Alumni Tracer Form');
                });

                $alumni->update([
                    'email_sent_at' => now(),
                    'email_status' => 'sent',
                ]);

                $sent[] = $alumni->email;
            } catch (\Exception $e) {
                Log::error("❌ Failed to send to {$alumni->email}: " . $e->getMessage());

                $alumni->update([
                    'email_status' => 'failed',
                ]);

                $failed[] = $alumni->email;
            }
        }

        return response()->json([
            'message' => '✅ All alumni emails processed.',
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }

    // ✅ NEW: Update alumni info based on student_number (used by form)
    public function updateAlumniForm(Request $request)
    {
        $validated = $request->validate([
            'student_number' => ['required', 'string'],
            'email' => ['required', 'email'],
            'name' => ['required', 'string'],
            'program' => ['required', 'string'],
            // 🔁 Add other fields here if needed
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

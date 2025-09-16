<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Alumni;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Jobs\SendAlumniFormEmail;

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
    $queued = [];
    $failed = [];

    foreach ($emails as $email) {
        $student = Student::where('email', $email)->first();

        if (!$student) {
           $failed[] = $email;
            continue;
        }

        try {
            // ✅ Dispatch to queue instead of sending immediately
            SendAlumniFormEmail::dispatch($student);

            $queued[] = $email;
        } catch (\Exception $e) {
            Log::error("Failed to queue {$student->email}: " . $e->getMessage());
            $failed[] = $email;
        }
    }

    return response()->json([
        'message' => count($queued) . ' Email have been sent successfully!',
        'queued' => $queued,
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

    $queued = [];
    $failed = [];

    foreach ($alumniList as $alum) {
        try {
            SendAlumniFormEmail::dispatch($alum);

            $alum->update([
                'email_status' => 'queued',
            ]);

            $queued[] = $alum->email;
        } catch (\Exception $e) {
            Log::error("Failed to queue {$alum->email}: " . $e->getMessage());

            $alum->update([
                'email_status' => 'failed',
            ]);

            $failed[] = $alum->email;
        }
    }

    return response()->json([
        'message' => '📩 Alumni emails have been queued by program.',
        'queued' => $queued,
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

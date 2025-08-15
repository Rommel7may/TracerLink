<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class UpdateEmailController extends Controller
{
    public function sendToAll()
    {
        $alumniList = Alumni::whereNotNull('email')
            ->where('consent', true)
            ->get();

        $sent = [];
        $failed = [];

        foreach ($alumniList as $alumni) {
            try {
                // ✅ Generate a signed URL to the update form
                $signedUrl = URL::signedRoute('alumni.update.form', [
                    'student_number' => $alumni->student_number,
                ]);

                // ✅ Send updated HTML email using AlumniUpdateForm.blade.php
                Mail::send('emails.AlumniUpdateForm', [
                    'student' => $alumni,
                    'formUrl' => $signedUrl,
                ], function ($message) use ($alumni) {
                    $message->to($alumni->email)
                            ->subject("Update Your Alumni Record");
                });

                $sent[] = $alumni->email;
            } catch (\Exception $e) {
                Log::error("Failed to send email to {$alumni->email}", ['error' => $e->getMessage()]);
                $failed[] = $alumni->email;
            }
        }

        return response()->json([
            'message' => 'Email sending completed.',
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }
}

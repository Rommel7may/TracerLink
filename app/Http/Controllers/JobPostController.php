<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobPost;
use App\Models\Alumni;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobNotificationMail;
use App\Mail\CreateJobPostMail; // ✅ Bagong mail
use App\Models\Program;

class JobPostController extends Controller
{
    // 📝 List all job posts with programs
    public function index()
    {
        $jobs = JobPost::latest()->get();
        $programs = Program::select('id', 'name')->get();

        return Inertia::render('job', [
            'jobs' => $jobs,
            'programs' => $programs,
        ]);
    }

    // ➕ Store a new job post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        JobPost::create($validated);

        return redirect()->route('job-posts.index')
                         ->with('success', 'Job post created successfully.');
    }

    // ✏️ Update existing job post
    public function update(Request $request, JobPost $jobPost)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        $jobPost->update($validated);

        return redirect()->route('job-posts.index')
                         ->with('success', 'Job post updated successfully.');
    }

    // 🗑 Delete a job post
    public function destroy(JobPost $jobPost)
    {
        $jobPost->delete();

        return redirect()->route('job-posts.index')
                         ->with('success', 'Job post deleted successfully.');
    }

    // 📧 Send email to unemployed alumni by program
    public function sendEmail(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|integer|exists:job_posts,id',
            'program_id' => 'nullable|integer|exists:programs,id',
        ]);

        $job = JobPost::findOrFail($validated['job_id']);

        $unemployedAlumni = Alumni::where('employment_status', 'Unemployed')
            ->when($validated['program_id'] ?? null, function ($query, $programId) {
                return $query->where('program_id', $programId);
            })
            ->get();

        if ($unemployedAlumni->isEmpty()) {
            return response()->json([
                'message' => 'No unemployed alumni found for the selected program.',
            ], 404);
        }

        foreach ($unemployedAlumni as $alumni) {
            try {
                Mail::to($alumni->email)->send(new JobNotificationMail($job));
            } catch (\Exception $e) {
                \Log::error('Mail failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Emails sent successfully']);
    }

    // 📧 Send email to ALL employed alumni to create new job post
    public function sendEmailToAllEmployed()
    {
        $employedAlumni = Alumni::where('employment_status', 'Employed')->get();

        if ($employedAlumni->isEmpty()) {
            return response()->json(['message' => 'No employed alumni found.'], 404);
        }

        foreach ($employedAlumni as $alumni) {
            try {
                $formUrl = route('job-posts.index'); // Link sa job creation form
                Mail::to($alumni->email)->send(new CreateJobPostMail($alumni, $formUrl));
            } catch (\Exception $e) {
                \Log::error('Mail failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Emails sent to all employed alumni successfully.']);
    }
}

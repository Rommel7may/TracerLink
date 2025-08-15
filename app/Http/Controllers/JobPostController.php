<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobPost;
use App\Models\Alumni; // ✅ Import Alumni model
use Illuminate\Support\Facades\Mail; // ✅ Import Mail facade
use App\Mail\JobNotificationMail; // ✅ Import your Mailable
use App\Models\Program;
class JobPostController extends Controller
{
    public function index()
    {
        $jobs = JobPost::latest()->get();
        $programs = Program::select('name')->get();

        return Inertia::render('job', [
            'jobs' => $jobs,
            'programs' => $programs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        JobPost::create($validated);

        return redirect()
            ->route('job-posts.index')
            ->with('success', 'Job post created successfully.');
    }

    public function update(Request $request, JobPost $jobPost)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        $jobPost->update($validated);

        return redirect()
            ->route('job-posts.index')
            ->with('success', 'Job post updated successfully.');
    }

    public function destroy(JobPost $jobPost)
    {
        $jobPost->delete();

        return redirect()
            ->route('job-posts.index')
            ->with('success', 'Job post deleted successfully.');
    }

 public function sendEmail(Request $request)
{
    $request->validate([
        'job_id' => 'required|integer|exists:job_posts,id',
    ]);

    $jobId = $request->job_id;
    $program = $request->program;
    $job = JobPost::findOrFail($jobId);

    // Fix typo in Alumni table
    $unemployedAlumni = Alumni::where('employment_status', 'Unemployed')
                              ->when($program, function ($query, $program) {
                                  return $query->where('program', $program);
                              })
                              ->get();

    foreach ($unemployedAlumni as $alumni) {
        try {
            Mail::to($alumni->email)->send(new JobNotificationMail($job));
        } catch (\Exception $e) {
            \Log::error('Mail failed: '.$e->getMessage());
        }
    }

    return response()->json(['message' => 'Emails sent successfully']);
}

}

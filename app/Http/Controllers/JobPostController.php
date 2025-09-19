<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobPost;
use App\Models\Alumni;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobNotificationMail;
use App\Mail\CreateJobPostMail;
use App\Models\Program;
use Carbon\Carbon;

class JobPostController extends Controller
{
    // 📝 List all job posts with programs and date filtering
    public function index(Request $request)
    {
        $query = JobPost::latest();
        
        // Date range filtering
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();
            
            $query->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('posted_date', [$startDate, $endDate])
                  ->orWhereBetween('application_deadline', [$startDate, $endDate])
                  ->orWhereBetween('start_date', [$startDate, $endDate]);
            });
        }
        
        // Filter by status if provided
        if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
            $query->where('status', $request->status);
        }
        
        // Filter expired jobs
        if ($request->has('show_expired')) {
            $query->expired();
        }
        
        // Filter active jobs (not expired)
        if ($request->has('show_active')) {
            $query->active();
        }
        
        // Filter upcoming jobs
        if ($request->has('show_upcoming')) {
            $query->upcoming();
        }

        $jobs = $query->get();
        $programs = Program::select('id', 'name')->get();

        return Inertia::render('job', [
            'jobs' => $jobs,
            'programs' => $programs,
            'filters' => $request->only(['start_date', 'end_date', 'status', 'show_expired', 'show_active', 'show_upcoming'])
        ]);
    }

    // ➕ Store a new job post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'location_link' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'apply_link' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            // Date validation
            'posted_date' => 'nullable|date',
            'application_deadline' => 'nullable|date|after_or_equal:posted_date',
            'start_date' => 'nullable|date|after_or_equal:posted_date',
        ]);

        // Set posted_date to current date if not provided
        if (empty($validated['posted_date'])) {
            $validated['posted_date'] = now();
        }

        JobPost::create($validated);

        return redirect()->route('job-posts.index')
                         ->with('success', 'Job post created successfully.');
    }

    // ✏️ Update existing job post
    public function update(Request $request, JobPost $jobPost)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'location_link' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'apply_link' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            // Date validation
            'posted_date' => 'nullable|date',
            'application_deadline' => 'nullable|date|after_or_equal:posted_date',
            'start_date' => 'nullable|date|after_or_equal:posted_date',
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
        

        // Only send emails for active jobs that haven't expired
        if (!$job->isActive()) {
            return response()->json([
                'message' => 'Cannot send notifications for inactive or expired job posts.',
            ], 422);
        }

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
                Mail::to($alumni->email)->queue(new JobNotificationMail($job));
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
    
    // 🔍 Get job posts by date range (API endpoint)
    public function getByDateRange(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'date_field' => 'nullable|in:posted_date,application_deadline,start_date'
        ]);
        
       $jobs = $query->paginate(10)->withQueryString();
        
        $dateField = $validated['date_field'] ?? 'posted_date';
        
        $jobs = $query->whereBetween($dateField, [
            Carbon::parse($validated['start_date'])->startOfDay(),
            Carbon::parse($validated['end_date'])->endOfDay()
        ])->get();
        
        return response()->json(['jobs' => $jobs]);
    }
}
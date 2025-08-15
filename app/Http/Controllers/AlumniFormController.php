<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AlumniFormController extends Controller
{
    // 📄 Show the blank public form
    public function show($student_number)
    {
        return Inertia::render('AlumniForm', [
            'mode' => 'create',
            'student_number' => $student_number,
            'email' => '',
            'program_id' => '',
        ]);
    }

    // 💾 Save new alumni info
    public function store(Request $request, $student_number)
    {
        $rules = [
            'student_number' => [
                'required',
                'string',
                Rule::unique('alumni', 'student_number'),
            ],
            'email' => 'required|email',
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => [
                'required',
                'email',
                Rule::unique('alumni', 'active_email'),
            ],
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'employment_status' => 'required|string',
            'further_studies' => 'nullable|string',
            'instruction_rating' => 'nullable|integer|min:1|max:5',
            'consent' => 'required|boolean',
        ];

        if ($request->employment_status === 'employed') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'sector' => 'required|string',
                'work_location' => 'required|string',
                'employer_classification' => 'required|string',
                'related_to_course' => ['required', Rule::in(['yes', 'no', 'unsure'])],
            ]);
        }

        $validated = $request->validate($rules);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
            $validated['sector'] = null;
            $validated['work_location'] = null;
            $validated['employer_classification'] = null;
            $validated['related_to_course'] = null;
        }

        Alumni::create($validated);

        return redirect()->back()->with('success', '🎉 Form submitted successfully!');
    }

    // ✏️ Update via dashboard modal
    public function update(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        $rules = [
            'email' => ['required', 'email', Rule::unique('alumni')->ignore($alumni->id)],
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => [
                'required',
                'email',
                Rule::unique('alumni', 'active_email')->ignore($alumni->id),
            ],
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'employment_status' => 'required|string',
            'further_studies' => 'nullable|string',
            'instruction_rating' => 'nullable|integer|min:1|max:5',
            'consent' => 'required|boolean',
        ];

        if ($request->employment_status === 'employed') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'sector' => 'required|string',
                'work_location' => 'required|string',
                'employer_classification' => 'required|string',
                'related_to_course' => ['required', Rule::in(['yes', 'no', 'unsure'])],
            ]);
        }

        $validated = $request->validate($rules);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
            $validated['sector'] = null;
            $validated['work_location'] = null;
            $validated['employer_classification'] = null;
            $validated['related_to_course'] = null;
        }

        $alumni->update($validated);

        return response()->json([
            'alumni' => $alumni,
            'message' => '✅ Alumni info updated successfully!',
        ]);
    }

    // 📨 Show update form via email link
    public function showUpdateForm(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        return Inertia::render('Alumni/UpdateForm', [
            'alumni' => $alumni,
        ]);
    }

    // ✏️ Handle update via email link
    public function updateFromEmail(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        $rules = [
            'email' => ['required', 'email', Rule::unique('alumni')->ignore($alumni->id)],
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => [
                'required',
                'email',
                Rule::unique('alumni', 'active_email')->ignore($alumni->id),
            ],
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'employment_status' => 'required|string',
            'further_studies' => 'nullable|string',
            'instruction_rating' => 'nullable|integer|min:1|max:5',
            'consent' => 'required|boolean',
        ];

        if ($request->employment_status === 'employed') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'sector' => 'required|string',
                'work_location' => 'required|string',
                'employer_classification' => 'required|string',
                'related_to_course' => ['required', Rule::in(['yes', 'no', 'unsure'])],
            ]);
        }

        $validated = $request->validate($rules);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
            $validated['sector'] = null;
            $validated['work_location'] = null;
            $validated['employer_classification'] = null;
            $validated['related_to_course'] = null;
        }

        $alumni->update($validated);

        return redirect()->back()->with('success', '✅ Alumni info updated successfully!');
    }

    // 🔍 Check if active email already exists
    public function checkActiveEmail(Request $request)
    {
        $email = $request->query('email');

        $exists = Alumni::where('active_email', $email)->exists();

        return response()->json(['exists' => $exists]);
    }
}

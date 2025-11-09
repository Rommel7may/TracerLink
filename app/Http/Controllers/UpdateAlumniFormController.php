<?php
// Controller for updating alumni info from signed email link
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UpdateAlumniFormController extends Controller
{
    /**
     * 📨 Show the update form from signed email link
     */
    public function show(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        return Inertia::render('Alumni/UpdateForm', [
            'alumni' => $alumni,
        ]);
    }

    /**
     * ✏️ Update alumni info submitted from signed email link
     */
    public function update(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        $employmentStatus = $request->input('employment_status');

        // Common validation rules
        $rules = [
            'email' => [
                'required',
                'email',
                Rule::unique('alumni', 'email')->ignore($alumni->id),
            ],
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'sex' => ['required', Rule::in(['male', 'female'])], // ✅ Gender validation
            'present_address' => 'required|string',
            'contact_number' => 'required|string',
            'graduation_year' => ['required', 'digits:4'],
            'employment_status' => 'required|string',
            'further_studies' => 'nullable|string',
            'consent' => 'required|boolean',
            'instruction_rating' => 'nullable|integer|min:1|max:5', // ✅ Rating validation
        ];

        // If employed, add required rules for job-related fields
        if ($employmentStatus === 'employed') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'work_position' => 'nullable|string|max:255', // ✅ Optional position
                'sector' => 'required|string',
                'work_location' => 'required|string',
                'employer_classification' => 'required|string',
                'related_to_course' => ['required', Rule::in(['yes', 'no', 'unsure'])],
            ]);
        }

        $validated = $request->validate($rules);

        // If not employed, clear job-related fields explicitly
        if ($employmentStatus !== 'employed') {
            $validated = array_merge($validated, [
                'company_name' => null,
                'work_position' => null, // ✅ Clear work_position
                'sector' => null,
                'work_location' => null,
                'employer_classification' => null,
                'related_to_course' => null,
            ]);
        }

        $alumni->update($validated);

        return redirect()->back()->with('success', '✅ Alumni info updated successfully!');
    }
}

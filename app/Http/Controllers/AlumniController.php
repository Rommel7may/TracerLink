<?php
namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;

class AlumniController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|exists:students,student_number',
            'email' => 'required|email',
            'program' => 'required|string',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => 'required|email',
            'contact_number' => 'required|string',
            'graduation_year' => 'required|string',
            'employment_status' => 'nullable|string',
            'further_studies' => 'nullable|string',
            'sector' => 'nullable|string',
            'work_location' => 'nullable|string',
            'employer_classification' => 'nullable|string',
            'consent' => 'accepted',
        ]);

        // Alumni::create($validated);
        dd($request);

        // return redirect()->back()->with('success', 'Alumni form submitted!');


    }
}

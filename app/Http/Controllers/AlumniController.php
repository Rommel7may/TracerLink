<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Events\AlumniCreated;
class AlumniController extends Controller
{
    // ✅ Dashboard chart data per graduation year
    public function dashboard()
    {
        $alumniPerYear = Alumni::selectRaw('graduation_year as year, COUNT(*) as total')
            ->groupBy('graduation_year')
            ->orderBy('graduation_year')
            ->get();

        return Inertia::render('Dashboard', [
            'alumniPerYear' => $alumniPerYear,
        ]);
    }

    /**
     * 📋 Return alumni list as JSON (for React table)
     */
    public function index(Request $request)
    {
        $program_id = $request->input('program_id');

        $alumni = Alumni::with('program')
            ->when($program_id, fn($query) => $query->where('program_id', $program_id))
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($alumni);
    }

    /**
     * ➕ Store a new alumni record
     */
  public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'student_number' => 'required|string|unique:alumni,student_number',
            'email' => 'required|email',
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => 'required|email|unique:alumni,active_email',
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'sex' => ['required', Rule::in(['male', 'female'])],
            'employment_status' => 'required|string',
            'company_name' => 'nullable|string|max:255',
            'work_position' => 'nullable|string|max:255',
            'further_studies' => 'nullable|string',
            'sector' => 'nullable|string',
            'work_location' => 'nullable|string',
            'employer_classification' => 'nullable|string',
            'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
            'instruction_rating' => 'nullable|numeric|min:0|max:5',
            'consent' => 'accepted',
        ]);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
            $validated['work_position'] = null;
            $validated['sector'] = null;
            $validated['work_location'] = null;
            $validated['employer_classification'] = null;
            $validated['related_to_course'] = null;
        }

        // ✅ Create the alumni once
        $alumni = Alumni::create($validated);

        // 🔔 FIX: Use broadcast() instead of event() for WebSocket broadcasting
          broadcast(new AlumniCreated($alumni))->toOthers();
        
        \Log::info('Alumni created and broadcasted', ['alumni_id' => $alumni->id]);

        return response()->json([
            'message' => '🎉 Alumni added successfully!',
            'data' => $alumni->load('program'),
        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
            'message' => '❌ Validation failed.',
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Error creating alumni: ' . $e->getMessage());
        return response()->json([
            'message' => '❌ Server error occurred.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * 🔄 Update alumni
     */
    public function update(Request $request, $id)
    {
        try {
            $alumni = Alumni::findOrFail($id);

            $validated = $request->validate([
                'student_number' => [
                    'required',
                    'string',
                    Rule::unique('alumni', 'student_number')->ignore($alumni->id),
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
                    Rule::unique('alumni', 'active_email')->ignore($alumni->id),
                ],
                'contact_number' => 'required|string',
                'graduation_year' => 'required|digits:4',
                'sex' => ['required', Rule::in(['male', 'female'])],
                'employment_status' => 'required|string',
                'company_name' => 'nullable|string|max:255',
                'work_position' => 'nullable|string|max:255', // ✅ Added
                'further_studies' => 'nullable|string',
                'sector' => 'nullable|string',
                'work_location' => 'nullable|string',
                'employer_classification' => 'nullable|string',
                'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
                'instruction_rating' => 'nullable|numeric|min:0|max:5', // ✅ Added
                'consent' => 'accepted',
            ]);

            if ($validated['employment_status'] !== 'employed') {
                $validated['company_name'] = null;
                $validated['work_position'] = null;
                $validated['sector'] = null;
                $validated['work_location'] = null;
                $validated['employer_classification'] = null;
                $validated['related_to_course'] = null;
            }

            $alumni->update($validated);

            return response()->json([
                'message' => '✅ Alumni updated successfully!',
                'data' => $alumni->load('program'),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
                'message' => '❌ Validation failed.',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ Server error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🗑️ Delete alumni
     */
    public function destroy($id)
    {
        $alumni = Alumni::find($id);

        if (!$alumni) {
            return response()->json(['message' => 'Alumni not found.'], 404);
        }

        $alumni->delete();

        return response()->json(['message' => '🗑️ Alumni deleted successfully.']);
    }

    /**
     * 📦 Bulk delete alumni
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json(['message' => 'No alumni IDs provided.'], 400);
        }

        Alumni::destroy($ids);

        return response()->json(['message' => '🗑️ Alumni deleted successfully.']);
    }
    
}

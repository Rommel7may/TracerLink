<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::withCount('alumni')->get();

        return Inertia::render('ProgramCrud', [
            'programs' => $programs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Program::create($validated);

        return redirect()->back()->with('success', 'Program added successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Program::findOrFail($id)->update($validated);

        return redirect()->back()->with('success', 'Program updated successfully.');
    }

    public function destroy($id)
    {
        try {
            $program = Program::findOrFail($id);

            if ($program->alumni()->exists()) {
                return redirect()->back()->with('error', 'You cannot delete this program because it has linked alumni records.');
            }

            $program->delete();

            return redirect()->back()->with('success', 'Program deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function create()
    {
        $programs = Program::select('name')->get();

        return Inertia::render('AlumniForm', [
            'programs' => $programs,
        ]);
    }
}

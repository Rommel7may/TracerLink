<?php

namespace App\Http\Controllers;
// Controller for employability data display
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Alumni;
use App\Models\Program; // ✅ import Program model

class EmployabilityController extends Controller
{
    public function index()
    {
        // Kunin lahat ng alumni kasama ang program
        $alumni = Alumni::with('program:id,name') 
            ->select(
                'id',
                'program_id',
                'last_name',
                'given_name',
                'middle_initial',
                'sex',
                'employment_status',
                'company_name',
                'work_position'
            )
            ->get();

        // Kunin lahat ng programs kahit walang alumni
        $programs = Program::select('id', 'name')->get();

        return Inertia::render('Employability', [
            'alumni' => $alumni,
            'programs' => $programs, 
        ]);
    }
}

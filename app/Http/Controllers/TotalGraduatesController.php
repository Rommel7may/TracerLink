<?php
// Controller for total graduates data aggregation
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;

class TotalGraduatesController extends Controller
{
    public function total(Request $request)
    {
        $query = Alumni::query();

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        if ($request->filled('year')) {
            $query->where('graduation_year', $request->year);
        }

        $data = $query
            ->selectRaw('graduation_year as year, COUNT(*) as total')
            ->groupBy('graduation_year')
            ->orderBy('graduation_year')
            ->get();

        return response()->json($data);
    }
}

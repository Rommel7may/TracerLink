<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;

class PursuingStudiesController extends Controller
{
    public function chart(Request $request)
    {
        $query = Alumni::query();

        if ($request->program_id) {
            $query->where('program_id', $request->program_id);
        }

        if ($request->year) {
            $query->where('graduation_year', $request->year);
        }

        $data = $query
            ->selectRaw('further_studies, COUNT(*) as count')
            ->groupBy('further_studies')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->further_studies ?? 'Unknown',
                    'value' => $item->count,
                ];
            });

        return response()->json($data);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use App\Models\Program;

class ChartController extends Controller
{
    /**
     * Return employment status pie chart data with optional filters.
     */
    public function alumniPie(Request $request)
    {
        $query = Alumni::query();

        // Apply filters if provided
        if ($request->has('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        if ($request->has('year')) {
            $query->where('graduation_year', $request->year);
        }

        $data = $query->selectRaw('employment_status, COUNT(*) as visitors')
            ->groupBy('employment_status')
            ->get()
            ->map(function ($item) {
                return [
                    'browser' => $item->employment_status ?? 'unknown',
                    'visitors' => $item->visitors,
                    'fill' => $this->getColor($item->employment_status),
                ];
            });

        return response()->json($data);
    }

    /**
     * Return available programs and distinct graduation years for filters.
     */
    public function options()
    {
        $programs = Program::select('id', 'name')->get();

        $years = Alumni::select('graduation_year')
            ->distinct()
            ->orderBy('graduation_year', 'desc')
            ->pluck('graduation_year');

        return response()->json([
            'programs' => $programs,
            'years' => $years,
        ]);
    }

    /**
     * Return chart color for each employment status.
     */
    private function getColor($status)
    {
        return match ($status) {
            'employed' => 'var(--chart-1)',
            'unemployed' => 'var(--chart-2)',
            'not-tracked' => 'var(--chart-3)',
            default => 'var(--chart-4)',
        };
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;

class LocationController extends Controller
{
    public function location(Request $request)
    {
        // Start query
        $query = Alumni::query();

        // Apply program filter if given
        if ($request->filled('programId')) {
            $query->where('program_id', $request->programId);
        }

        // Apply year filter if given
        if ($request->filled('year')) {
            $query->where('graduation_year', $request->year);
        }

        // Group by work_location and count
        $data = $query->selectRaw('work_location, COUNT(*) as visitors')
            ->groupBy('work_location')
            ->get()
            ->map(function ($item) {
                return [
                    'browser' => $item->work_location ?? 'unknown',
                    'visitors' => $item->visitors,
                    'fill' => $this->getColor($item->work_location),
                ];
            });

        return response()->json($data);
    }

    private function getColor($status)
    {
        return match($status) {
            'local' => 'var(--chart-1)',
            'abroad' => 'var(--chart-2)',
            default => 'var(--chart-5)',
        };
    }
}
